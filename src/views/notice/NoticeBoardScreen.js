// src/views/notice/NoticeBoardScreen.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { getNotices, reactToNotice, deleteNotice } from "../../controllers/noticeController";
import { COLORS } from "../../theme/colors";
import { canEdit } from "../../utils/permissions";
import Toast from "react-native-toast-message";
import { Ionicons, Feather } from "@expo/vector-icons";

export default function NoticeBoardScreen({ navigation }) {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotices(100);
      setNotices(data);
    } catch (err) {
      console.error("getNotices", err);
      Toast.show({ type: "error", text1: "Failed to load notices" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // show “New Post” button for admin/faculty
  useEffect(() => {
    if (canEdit(user, "notices")) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("NewNotice")}
            style={{ marginRight: 12 }}
          >
            <Feather name="plus-circle" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({ headerRight: null });
    }
  }, [navigation, user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleReact = async (noticeId, type) => {
    try {
      await reactToNotice({
        notice_id: noticeId,
        author_id: user.id,
        type,
      });

      const updated = await getNotices(100);
      setNotices(updated);
    } catch (err) {
      console.error("Reaction failed:", err);
      Toast.show({
        type: "error",
        text1: "Action failed",
        text2: "Unable to register your reaction.",
      });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.authorText}>{item.author?.name || "Unknown"}</Text>
          <Text style={styles.timeText}>
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>

        {/* options for admin/faculty */}
        {["admin", "faculty"].includes(user.role) && item.author?.id === user.id && (
          <TouchableOpacity
            onPress={() => {
              setSelectedNotice(item);
              setShowOptions(true);
            }}
          >
            <Ionicons name="ellipsis-vertical" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>

      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="cover" />
      ) : null}

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleReact(item.id, "like")}>
          <Ionicons name="heart-outline" size={18} color={COLORS.text} />
          <Text style={styles.actionText}> {item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => handleReact(item.id, "dislike")}>
          <Ionicons name="thumbs-down-outline" size={18} color={COLORS.text} />
          <Text style={styles.actionText}> {item.dislikes}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() =>
            navigation.navigate("NoticeThread", {
              noticeId: item.id,
              title: item.title,
            })
          }
        >
          <Feather name="message-circle" size={18} color={COLORS.text} />
          <Text style={styles.actionText}> Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={notices}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View style={styles.center}>
              <Text style={{ color: COLORS.textMuted }}>No notices yet.</Text>
            </View>
          )}
        />
      )}

      {/* modal for edit/delete */}
      <Modal
        transparent
        visible={showOptions}
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Pressable
              style={styles.modalOption}
              onPress={() => {
                setShowOptions(false);
                navigation.navigate("NewNotice", {
                  editMode: true,
                  notice: selectedNotice,
                });
              }}
            >
              <Text style={styles.modalText}>Edit Post</Text>
            </Pressable>

            <Pressable
              style={styles.modalOption}
              onPress={() => {
                Alert.alert(
                  "Delete Notice",
                  "Are you sure you want to delete this post?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: async () => {
                        await deleteNotice(selectedNotice.id);
                        setShowOptions(false);
                        await load();
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={[styles.modalText, { color: COLORS.error }]}>
                Delete Post
              </Text>
            </Pressable>

            <Pressable
              style={[styles.modalOption, { borderTopWidth: 0.5, borderColor: COLORS.border }]}
              onPress={() => setShowOptions(false)}
            >
              <Text style={styles.modalText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  authorText: { fontWeight: "600", color: COLORS.text },
  timeText: { color: COLORS.textMuted, fontSize: 12 },
  title: { fontSize: 16, fontWeight: "700", color: COLORS.text, marginBottom: 6 },
  content: { color: COLORS.textMuted, marginBottom: 8 },
  image: { width: "100%", height: 180, borderRadius: 8, marginTop: 8 },
  actionsRow: { flexDirection: "row", marginTop: 10, alignItems: "center" },
  actionBtn: { flexDirection: "row", alignItems: "center", marginRight: 18 },
  actionText: { color: COLORS.textMuted, fontSize: 14, marginLeft: 6 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 240,
    paddingVertical: 8,
  },
  modalOption: {
    paddingVertical: 12,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
});
