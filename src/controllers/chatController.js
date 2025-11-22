import { supabase } from "../services/supabaseClient";
import uuid from "react-native-uuid";

/**
 * Fetch all servers accessible to the user.
 * Admins see all, others see only their joined servers.
 */
export async function getServers(userId, role) {
  if (role === "admin") {
    const { data, error } = await supabase
      .from("servers")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("server_members")
    .select("servers(*)")
    .eq("user_id", userId);

  if (error) throw error;

  return data.map((m) => m.servers);
}

/**
 * Fetch channels of a server
 */
export async function getChannels(serverId) {
  const { data, error } = await supabase
    .from("channels")
    .select("id, name, description")
    .eq("server_id", serverId)
    .order("created_at");

  if (error) throw error;
  return data;
}

/**
 * Fetch messages with author info
 */
export async function getMessages(channelId) {
  const { data, error } = await supabase
    .from("messages")
    .select(`
      id,
      content,
      created_at,
      author:app_users!messages_author_id_fkey(id, full_name, role)
    `)
    .eq("channel_id", channelId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data.map((msg) => ({
    id: msg.id,
    content: msg.content,
    created_at: msg.created_at,
    author: msg.author
      ? {
          id: msg.author.id,
          name: msg.author.full_name,
          role: msg.author.role,
        }
      : { id: null, name: "Unknown User", role: "unknown" },
  }));
}

/**
 * Send a message
 */
export async function sendMessage({ channelId, authorId, content }) {
  const { data, error } = await supabase
    .from("messages")
    .insert([{ channel_id: channelId, author_id: authorId, content }])
    .select(
      `
      id,
      content,
      created_at,
      author:app_users!messages_author_id_fkey(id, full_name, role)
      `
    )
    .single();

  if (error) throw error;
  return data;
}

/**
 * Realtime subscription
 */
export function subscribeToMessages(channelId, onMessage) {
  const channel = supabase
    .channel(`realtime:messages:${channelId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `channel_id=eq.${channelId}`,
      },
      async (payload) => {
        try {
          const { data: userData } = await supabase
            .from("app_users")
            .select("id, full_name, role")
            .eq("id", payload.new.author_id)
            .single();

          onMessage({
            eventType: "INSERT",
            new: {
              ...payload.new,
              author: userData
                ? {
                    id: userData.id,
                    name: userData.full_name,
                    role: userData.role,
                  }
                : { id: null, name: "Unknown User", role: "unknown" },
            },
          });
        } catch (err) {
          console.warn("Hydration failed:", err.message);
          onMessage(payload);
        }
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

/**
 * Create server (with invite emails)
 */
export async function createServer({ name, created_by, creator_role, emails = [] }) {
  try {
    const serverId = uuid.v4();
    const created_at = new Date().toISOString();

    // 1. Create server
    const { data: serverData, error: sErr } = await supabase
      .from("servers")
      .insert([{ id: serverId, name, created_by, created_at }])
      .select()
      .single();

    if (sErr) throw sErr;

    // 2. Add creator to server_members (admin or faculty)
    await supabase.from("server_members").insert([
      {
        id: uuid.v4(),
        server_id: serverId,
        user_id: created_by,
        role: creator_role, // only admin / faculty
        joined_at: created_at,
      },
    ]);

    // 3. Add invited students
    for (const email of emails) {
      const { data: userRow } = await supabase
        .from("app_users")
        .select("id, role")
        .eq("email", email.toLowerCase())
        .maybeSingle();

      if (!userRow) continue;

      await supabase.from("server_members").insert([
        {
          id: uuid.v4(),
          server_id: serverId,
          user_id: userRow.id,
          role: userRow.role, // student / faculty automatically
          joined_at: created_at,
        },
      ]);
    }

    return { server: serverData };
  } catch (err) {
    console.error("createServer error:", err);
    throw err;
  }
}

/**
 * Create a channel
 */
export async function createChannel({ server_id, name, type }) {
  const created_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("channels")
    .insert([{ server_id, name, type, created_at }])
    .select()
    .single();

  if (error) throw error;
  return data;
}
