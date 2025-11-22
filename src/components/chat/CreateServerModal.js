import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS } from "../../theme/colors";

export default function CreateServerModal({ visible, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [emails, setEmails] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;

    // parse emails -> array
    const emailList = emails
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    onSubmit(name.trim(), emailList);

    setName("");
    setEmails("");
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Create Server</Text>

          <Text style={styles.label}>Server Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter server name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Invite Members (optional)</Text>
          <TextInput
            style={[styles.input, { height: 70 }]}
            placeholder="Enter emails, separated by commas"
            value={emails}
            onChangeText={setEmails}
            multiline
          />

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
              <Text style={styles.btnTextWhite}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    color: COLORS.text,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: COLORS.text,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  createBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  btnText: { color: COLORS.textMuted },
  btnTextWhite: { color: "#fff", fontWeight: "600" },
});
