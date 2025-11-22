// src/views/notice/NewNoticeScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { COLORS } from "../../theme/colors";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../services/supabaseClient";
import uuid from "react-native-uuid";

/**
 * Robust NewNoticeScreen:
 * - Works across multiple expo-image-picker versions
 * - Does not assume MediaType enums exist
 * - Handles both result.uri and result.assets[0].uri shapes
 * - Uses base64 -> Uint8Array upload compatible with React Native
 */
export default function NewNoticeScreen({ route, navigation }) {
  const { user } = useAuth();
  const { editMode, notice } = route.params || {};

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null); // uri
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editMode && notice) {
      setTitle(notice.title || "");
      setContent(notice.content || "");
      setImage(notice.image_url || null);
    }
  }, [editMode, notice]);

  // Helper: normalize result from picker
  const extractUriFromResult = (result) => {
    // handles old shape { cancelled, uri } or new { canceled, assets: [{ uri }] }
    if (!result) return null;
    if (result.uri) return result.uri;
    if (result.assets && Array.isArray(result.assets) && result.assets[0]?.uri)
      return result.assets[0].uri;
    if (result.canceled === false && result.assets && result.assets[0]?.uri)
      return result.assets[0].uri;
    return null;
  };

  // Request permissions helper (media library)
  const ensureMediaLibraryPermission = async () => {
    try {
      // Android: request READ/WRITE as needed via expo-image-picker
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "You need to allow photo access in system settings."
        );
        return false;
      }
      return true;
    } catch (err) {
      console.error("Permission check failed:", err);
      return false;
    }
  };

  // Request camera permission
  const ensureCameraPermission = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "You need to allow camera access in system settings."
        );
        return false;
      }
      return true;
    } catch (err) {
      console.error("Camera permission check failed:", err);
      return false;
    }
  };

  // PICK IMAGE - no mediaTypes to avoid enum/version issues
  const pickImage = async () => {
    try {
      const ok = await ensureMediaLibraryPermission();
      if (!ok) return;

      // Do not pass mediaTypes (works across versions)
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      const uri = extractUriFromResult(result);
      if (uri) setImage(uri);
    } catch (err) {
      console.error("Gallery error:", err);
      Alert.alert("Error", "Unable to open gallery. Try restarting the app.");
    }
  };

  // TAKE PHOTO
  const takePhoto = async () => {
    try {
      const ok = await ensureCameraPermission();
      if (!ok) return;

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      const uri = extractUriFromResult(result);
      if (uri) setImage(uri);
    } catch (err) {
      console.error("Camera error:", err);
      Alert.alert("Error", "Unable to open the camera. Try restarting the app.");
    }
  };

  // upload helper: base64 -> Uint8Array -> Supabase upload
  const uploadImage = async (uri) => {
    try {
      // read file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // convert base64 to Uint8Array safely
      // atob may not exist; provide small fallback
      const atobFn = (typeof atob === "function") ? atob : (b64) => Buffer.from(b64, "base64").toString("binary");
      // Use Buffer approach if available (Node polyfill sometimes present), else use global atob
      let binaryString;
      if (typeof atob === "function") {
        binaryString = atob(base64);
      } else if (typeof Buffer !== "undefined") {
        // Buffer exists in some RN setups
        binaryString = Buffer.from(base64, "base64").toString("binary");
      } else {
        // fallback (should rarely happen)
        throw new Error("No base64 decoder available in this runtime.");
      }

      const uint8 = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8[i] = binaryString.charCodeAt(i);
      }

      const ext = uri.split(".").pop().split("?")[0] || "jpg";
      const filename = `${uuid.v4()}.${ext}`;
      const path = `notice-images/${filename}`;

      const { error: upErr } = await supabase.storage
        .from("notice-images")
        .upload(path, uint8, {
          contentType: `image/${ext === "png" ? "png" : "jpeg"}`,
          upsert: false,
        });

      if (upErr) throw upErr;

      const { data: pu } = supabase.storage.from("notice-images").getPublicUrl(path);
      return pu.publicUrl;
    } catch (err) {
      console.error("Upload failed:", err);
      throw err;
    }
  };

  // Submit (create or update)
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Validation", "Please enter both title and content.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = image;
      if (image && !image.startsWith("http")) {
        imageUrl = await uploadImage(image);
      }

      if (editMode && notice) {
        const { error } = await supabase
          .from("notices")
          .update({ title, content, image_url: imageUrl })
          .eq("id", notice.id);
        if (error) throw error;
        Alert.alert("Success", "Notice updated.");
      } else {
        const { error } = await supabase.from("notices").insert([
          {
            title,
            content,
            image_url: imageUrl,
            author_id: user?.id || null,
          },
        ]);
        if (error) throw error;
        Alert.alert("Success", "Notice created.");
      }

      navigation.goBack();
    } catch (err) {
      console.error("Save error:", err);
      Alert.alert("Error", "Failed to save notice. Check logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter notice title" />

      <Text style={styles.label}>Content</Text>
      <TextInput
        style={[styles.input, { height: 120 }]}
        value={content}
        onChangeText={setContent}
        placeholder="Write your notice content here..."
        multiline
      />

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Text style={styles.imageBtnText}>Choose from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageBtn} onPress={takePhoto}>
          <Text style={styles.imageBtnText}>Take a Picture</Text>
        </TouchableOpacity>
      </View>

      {image ? <Image source={{ uri: image }} style={styles.previewImage} resizeMode="cover" /> : null}

      <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.7 }]} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>{editMode ? "Update Notice" : "Post Notice"}</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.bgLight },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 6, color: COLORS.text },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 10, backgroundColor: "#fff", marginBottom: 16, fontSize: 15 },
  btnRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  imageBtn: { flex: 1, backgroundColor: COLORS.secondary, padding: 10, borderRadius: 8, marginHorizontal: 4, alignItems: "center" },
  imageBtnText: { color: COLORS.text, fontWeight: "500" },
  previewImage: { width: "100%", height: 200, marginTop: 10, borderRadius: 8 },
  submitBtn: { backgroundColor: COLORS.primary, padding: 14, borderRadius: 8, alignItems: "center", marginTop: 16 },
  submitText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
