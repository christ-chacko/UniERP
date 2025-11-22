import { Pressable, Text, StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";

export default function Button({ title, onPress }) {
  return (
    <Pressable style={styles.btn} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 6,
    width: "80%", 
  },
  text: {
    color: "#fff",
    fontWeight: "600",
  },
});
