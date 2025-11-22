import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../../theme/colors";
import { useAuth } from "../../contexts/AuthContext";

export default function DashboardScreen({ navigation }) {
  const { signOut, user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Academics</Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Attendance")}
        >
          <Text style={styles.cardText}>Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Fees")}
        >
          <Text style={styles.cardText}>Fees</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Results")}
        >
          <Text style={styles.cardText}>Results</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("NoticeBoard")}
        >
          <Text style={styles.cardText}>Notices</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.bgLight },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: COLORS.text,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: COLORS.secondary,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },

  cardText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },

  logoutBtn: {
    marginTop: 30,
    backgroundColor: COLORS.error,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
