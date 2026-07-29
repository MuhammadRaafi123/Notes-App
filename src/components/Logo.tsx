import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function Logo() {
  return (
    <View style={styles.container}>
      <View style={styles.logoOuter}>
        <LinearGradient
          colors={["#7CC7E8", "#4A90A4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoBox}
        >
          <View style={styles.logoInner}>
            <Ionicons
              name="document-text"
              size={38}
              color="#FFFFFF"
            />
          </View>
        </LinearGradient>
      </View>

      <Text style={styles.title}>
        Catatan <Text style={styles.primary}>App</Text>
      </Text>

      <Text style={styles.subtitle}>
        SIMPAN IDE CEMERLANGMU
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 30,
  },

  logoOuter: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: "rgba(91,142,166,0.12)",
  },

  logoBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",

    ...Platform.select({
      ios: {
        shadowColor: "#5B8EA6",
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.35,
        shadowRadius: 18,
      },
      android: {
        elevation: 10,
      },
    }),
  },

  logoInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    marginTop: 18,
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: 0.5,
  },

  primary: {
    color: "#5B8EA6",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 3,
  },
});