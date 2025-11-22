import React, { useEffect, useState, useCallback, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import { COLORS } from "../../theme/colors";
import { useAuth } from "../../contexts/AuthContext";
import MessageBubble from "../../components/chat/MessageBubble";
import MessageInput from "../../components/chat/MessageInput";

import {
  getServers,
  getChannels,
  getMessages,
  sendMessage,
  subscribeToMessages,
  createServer,
  createChannel,
} from "../../controllers/chatController";

import CreateServerModal from "../../components/chat/CreateServerModal";
import CreateChannelModal from "../../components/chat/CreateChannelModal";

export default function HomeContainer() {
  const { user } = useAuth();

  const [servers, setServers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showServerModal, setShowServerModal] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const loadServers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getServers(user.id, user.role);
      setServers(data);
      if (data.length > 0) setSelectedServer(data[0]);
    } catch (err) {
      console.error("Failed to load servers:", err);
      Alert.alert("Error", "Failed to load servers.");
    } finally {
      setLoading(false);
    }
  }, [user.id, user.role]);

  useEffect(() => {
    loadServers();
  }, [loadServers]);

  useEffect(() => {
    if (!selectedServer) return;

    (async () => {
      const data = await getChannels(selectedServer.id);
      setChannels(data);
      if (data.length > 0) setSelectedChannel(data[0]);
    })();
  }, [selectedServer]);

  useEffect(() => {
    if (!selectedChannel) return;

    let unsubscribe = null;

    (async () => {
      const msgs = await getMessages(selectedChannel.id);
      setMessages(msgs);

      unsubscribe = subscribeToMessages(selectedChannel.id, (payload) => {
        if (payload.eventType === "INSERT") {
          setMessages((prev) => [...prev, payload.new]);
        }
      });
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedChannel]);

  const handleSend = async (text) => {
    try {
      await sendMessage({
        channelId: selectedChannel.id,
        authorId: user.id,
        content: text,
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const canManage = user.role === "admin" || user.role === "faculty";

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {/* SERVER LIST */}
      <View style={styles.serverList}>
        <FlatList
          data={servers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.serverItem,
                selectedServer?.id === item.id && styles.activeServer,
              ]}
              onPress={() => setSelectedServer(item)}
            >
              <Text style={styles.serverText}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}
        />

        {canManage && (
          <TouchableOpacity
            style={styles.addServerButton}
            onPress={() => setShowServerModal(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* CHANNEL + CHAT */}
      <View style={styles.chatArea}>
        <View style={styles.channelBar}>
          <FlatList
            horizontal
            data={channels}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.channelItem,
                  selectedChannel?.id === item.id && styles.activeChannel,
                ]}
                onPress={() => setSelectedChannel(item)}
              >
                <Text
                  style={[
                    styles.channelText,
                    selectedChannel?.id === item.id &&
                      styles.activeChannelText,
                  ]}
                >
                  #{item.name}
                </Text>
              </TouchableOpacity>
            )}
          />

          {canManage && (
            <TouchableOpacity
              style={styles.addChannelButton}
              onPress={() => setShowChannelModal(true)}
            >
              <Text style={styles.addChannelText}>+</Text>
            </TouchableOpacity>
          )}
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 48}
        >
          <View style={{ flex: 1 }}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <MessageBubble
                  message={item}
                  isOwn={item.author?.id === user.id}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 12,
                paddingTop: 8,
                paddingBottom: 30,
                flexGrow: 1,
              }}
            />
          </View>

          {selectedChannel && (
            <View style={{ backgroundColor: "#fff" }}>
              <MessageInput onSend={handleSend} />
            </View>
          )}
        </KeyboardAvoidingView>
      </View>

      {/* SERVER CREATE MODAL */}
      <CreateServerModal
        visible={showServerModal}
        onClose={() => setShowServerModal(false)}
        onSubmit={async (name, emails) => {
          try {
            const result = await createServer({
              name,
              created_by: user.id,
              creator_role: user.role,
              emails,
            });

            setShowServerModal(false);

            await loadServers();

            if (result?.server?.id) {
              setSelectedServer(result.server);
            }
          } catch (err) {
            console.error("Failed to create server:", err);
            Alert.alert("Error", "Failed to create server.");
          }
        }}
      />

      {/* CHANNEL CREATE MODAL */}
      <CreateChannelModal
        visible={showChannelModal}
        serverName={selectedServer?.name}
        onClose={() => setShowChannelModal(false)}
        onSubmit={async (name) => {
          if (!selectedServer) {
            Alert.alert("No server selected");
            return;
          }
          try {
            await createChannel({
              server_id: selectedServer.id,
              name,
              type: "text",
            });
            setShowChannelModal(false);
            const updated = await getChannels(selectedServer.id);
            setChannels(updated);
          } catch (err) {
            console.error("Failed to create channel:", err);
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: COLORS.bgLight },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  serverList: {
    width: 65,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    paddingVertical: 1,
  },

  serverItem: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },

  activeServer: { backgroundColor: COLORS.highlight },
  serverText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

  addServerButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: COLORS.highlight,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },

  addButtonText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },

  chatArea: { flex: 1, backgroundColor: "#fff" },

  channelBar: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: COLORS.bgLight,
  },

  channelItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.secondary,
  },

  activeChannel: { backgroundColor: COLORS.primary },
  channelText: { color: COLORS.textMuted },
  activeChannelText: { color: "#fff", fontWeight: "600" },

  addChannelButton: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
  },

  addChannelText: {
    fontSize: 20,
    color: "#fff",
  },
});
