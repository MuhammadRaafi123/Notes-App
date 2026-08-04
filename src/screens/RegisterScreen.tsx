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

import styles from "../styles/RegisterStyle";
import { supabase } from "../services/supabase";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

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

  const register = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword || !confirmPassword) {
      showAlert("Peringatan", "Harap isi semua kolom.");
      return;
    }

    if (cleanPassword !== confirmPassword.trim()) {
      showAlert("Peringatan", "Kata sandi tidak cocok.");
      return;
    }

    if (cleanPassword.length < 6) {
      showAlert("Peringatan", "Kata sandi minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error) {
        showAlert("Gagal Mendaftar", error.message);
        return;
      }

      const msg = data.session
        ? "Akun berhasil dibuat!"
        : "Akun berhasil dibuat! Silakan cek email Anda untuk konfirmasi jika diperlukan, lalu masuk.";

      showAlert("Sukses", msg, () => {
        navigation.replace("Login");
      });
    } catch (err: any) {
      console.error("Register error:", err);
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

            <AuthInput
              icon="shield-checkmark-outline"
              placeholder="Konfirmasi Kata Sandi"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={hideConfirmPassword}
              showPassword={!hideConfirmPassword}
              togglePassword={() =>
                setHideConfirmPassword(!hideConfirmPassword)
              }
            />

            <GlowButton
              title="DAFTAR"
              onPress={register}
              loading={loading}
            />

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.register}>
                Sudah punya akun? Masuk
              </Text>
            </TouchableOpacity>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}