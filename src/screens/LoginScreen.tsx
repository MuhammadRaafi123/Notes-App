import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

import Background from "../components/Background";
import GlassCard from "../components/GlassCard";
import Logo from "../components/Logo";
import AuthInput from "../components/AuthInput";
import GlowButton from "../components/GlowButton";

import styles from "../styles/LoginStyle";
import { supabase } from "../services/supabase";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const showAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === "web") {
      window.alert(`${title}: ${message}`);
      if (onOk) onOk();
    } else {
      Alert.alert(title, message, [
        {
          text: "OK",
          onPress: () => {
            if (onOk) onOk();
          },
        },
      ]);
    }
  };

  const login = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      showAlert("Peringatan", "Harap isi semua kolom.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error) {
        showAlert("Gagal Masuk", error.message);
        return;
      }

      navigation.replace("Home");
    } catch (err: any) {
      console.error("Login error:", err);
      showAlert("Kesalahan", err.message || "Terjadi kesalahan yang tidak terduga.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Background />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 22,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <GlassCard>
            <Logo />

            <Text style={styles.welcome}>Selamat Datang</Text>

            <Text style={styles.subtitle}>
              Masuk untuk melanjutkan aktivitas Anda.
            </Text>

            <AuthInput
              icon="mail-outline"
              placeholder="Alamat Email"
              value={email}
              onChangeText={setEmail}
            />

            <AuthInput
              icon="lock-closed-outline"
              placeholder="Kata Sandi"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={hidePassword}
              showPassword={!hidePassword}
              togglePassword={() => setHidePassword(!hidePassword)}
            />

            <TouchableOpacity>
              <Text style={styles.forgot}>Lupa Kata Sandi?</Text>
            </TouchableOpacity>

            <GlowButton
              title="MASUK →"
              onPress={login}
              loading={loading}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.register}>
                Belum punya akun? Daftar sekarang
              </Text>
            </TouchableOpacity>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}