import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";

export default function MessageBubble({ message, isOwn }) {
  return (
    <View
      style={[
        styles.bubble,
        isOwn ? styles.bubbleOwn : styles.bubbleOther,
      ]}
    >
      <Text style={styles.author}>{message.author?.name || "Unknown"}</Text>
      <Text style={styles.text}>{message.content}</Text>
      <Text style={styles.time}>
        {new Date(message.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    marginVertical: 6,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  bubbleOwn: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
  },
  bubbleOther: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.secondary,
  },
  author: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textMuted,
  },
  text: {
    color: COLORS.text,
    marginTop: 4,
  },
  time: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
    alignSelf: "flex-end",
  },
});
