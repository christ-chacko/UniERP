import { supabase } from '../services/supabaseClient';
import uuid from 'react-native-uuid';

/**
 * Fetch notices with author info and reactions
 */
export async function getNotices(limit = 50) {
  const { data, error } = await supabase
    .from("notices")
    .select(`
      id,
      title,
      content,
      image_url,
      created_at,
      author:app_users!notices_author_id_fkey(id, full_name),
      notice_likes(type)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data.map((row) => {
    const likeCount = row.notice_likes?.filter((r) => r.type === "like").length || 0;
    const dislikeCount = row.notice_likes?.filter((r) => r.type === "dislike").length || 0;

    return {
      id: row.id,
      title: row.title,
      content: row.content,
      image_url: row.image_url,
      created_at: row.created_at,
      author: row.author ? { id: row.author.id, name: row.author.full_name } : null,
      likes: likeCount,
      dislikes: dislikeCount,
    };
  });
}

/**
 * Create new notice
 */
export async function createNotice({ title, content, imageFileUri, author_id }) {
  try {
    let image_url = null;
    const noticeId = uuid.v4();

    if (imageFileUri) {
      const response = await fetch(imageFileUri);
      const blob = await response.blob();
      const ext = imageFileUri.split('.').pop().split('?')[0];
      const fileName = `notice_${noticeId}.${ext || 'jpg'}`;
      const storagePath = `public/${noticeId}/${fileName}`;

      const { error: upErr } = await supabase.storage
        .from('notice-images')
        .upload(storagePath, blob, { upsert: true });
      if (upErr) throw upErr;

      const { data: pu } = supabase.storage
        .from('notice-images')
        .getPublicUrl(storagePath);
      image_url = pu.publicUrl;
    }

    const { error } = await supabase
      .from('notices')
      .insert([{ id: noticeId, title, content, image_url, author_id }]);
    if (error) throw error;
  } catch (err) {
    console.error("createNotice error:", err);
    throw err;
  }
}

/**
 * Like/Dislike a notice
 */
export async function reactToNotice({ notice_id, author_id, type }) {
  try {
    const { data: existing, error: fetchErr } = await supabase
      .from("notice_likes")
      .select("id, type")
      .eq("notice_id", notice_id)
      .eq("author_id", author_id)
      .maybeSingle();

    if (fetchErr) throw fetchErr;

    if (existing) {
      if (existing.type === type) {
        await supabase.from("notice_likes").delete().eq("id", existing.id);
        return { message: "Reaction removed" };
      } else {
        await supabase.from("notice_likes").update({ type }).eq("id", existing.id);
        return { message: "Reaction updated" };
      }
    }

    await supabase.from("notice_likes").insert([{ notice_id, author_id, type }]);
    return { message: "Reaction added" };
  } catch (err) {
    console.error("reactToNotice error:", err);
    throw err;
  }
}

/**
 * Fetch comments
 */
export async function getComments(notice_id, limit = 100) {
  const { data, error } = await supabase
    .from("notice_comments")
    .select(`
      id,
      notice_id,
      content,
      created_at,
      author:app_users!notice_comments_author_id_fkey(id, full_name)
    `)
    .eq("notice_id", notice_id)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) throw error;

  return data.map((r) => ({
    id: r.id,
    notice_id: r.notice_id,
    content: r.content,
    created_at: r.created_at,
    author: r.author ? { id: r.author.id, name: r.author.full_name } : null,
  }));
}

/**
 * Add comment
 */
export async function addComment({ notice_id, author_id, content }) {
  const id = uuid.v4();
  const created_at = new Date().toISOString();

  const { error } = await supabase
    .from("notice_comments")
    .insert([{ id, notice_id, author_id, content, created_at }]);
  if (error) throw error;
}
