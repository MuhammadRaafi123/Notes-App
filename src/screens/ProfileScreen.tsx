import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';

import { RootStackParamList } from '../navigation/AppNavigator';
import Background from '../components/Background';
import Navbar from '../components/navbar/Navbar';
import styles from '../styles/ProfileStyle';
import { supabase } from '../services/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const [userEmail, setUserEmail] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [totalNotes, setTotalNotes] = useState(0);
  const [pinnedCount, setPinnedCount] = useState(0);

  // State Modal Edit Profil
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [inputUsername, setInputUsername] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [updating, setUpdating] = useState(false);

  // State Modal Keamanan & Sandi
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigation.replace('Login');
        return;
      }

      setUserEmail(user.email || '');
      
      const meta = user.user_metadata;
      const currentUsername = meta?.username || (user.email ? user.email.split('@')[0] : 'Pengguna');
      setUsername(currentUsername);
      setInputUsername(currentUsername);
      setInputEmail(user.email || '');
      
      if (meta?.avatar_url) {
        setAvatarUrl(meta.avatar_url);
      }

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id);

      if (!error && data) {
        setTotalNotes(data.length);
        setPinnedCount(data.filter((n) => n.is_pinned).length);
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
    }
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Izin Ditolak', 'Anda perlu memberikan izin akses galeri untuk mengganti foto profil.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const localUri = result.assets[0].uri;
      uploadAvatar(localUri);
    }
  };

  const uploadAvatar = async (uri: string) => {
    setUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: uri }
      });

      if (error) {
        Alert.alert('Gagal', error.message);
      } else {
        setAvatarUrl(uri);
        Alert.alert('Berhasil', 'Foto profil berhasil diperbarui.');
      }
    } catch (err: any) {
      Alert.alert('Kesalahan', err.message || 'Gagal mengunggah foto.');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!inputUsername.trim()) {
      Alert.alert('Peringatan', 'Username tidak boleh kosong.');
      return;
    }

    setUpdating(true);
    try {
      const updatePayload: any = {
        data: { username: inputUsername.trim() }
      };

      if (inputEmail.trim() !== userEmail) {
        updatePayload.email = inputEmail.trim();
      }

      const { error } = await supabase.auth.updateUser(updatePayload);

      if (error) {
        Alert.alert('Gagal Memperbarui', error.message);
      } else {
        setUsername(inputUsername.trim());
        setUserEmail(inputEmail.trim());
        setEditModalVisible(false);
        Alert.alert('Berhasil', 'Informasi akun berhasil diperbarui.');
      }
    } catch (err: any) {
      Alert.alert('Kesalahan', err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setUpdating(false);
    }
  };

  // Fungsi untuk Memperbarui Password secara Nyata via Supabase
  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Peringatan', 'Semua kolom sandi harus diisi.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Peringatan', 'Sandi baru minimal harus terdiri dari 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Peringatan', 'Konfirmasi sandi baru tidak cocok.');
      return;
    }

    setUpdatingPassword(true);
    try {
      // Validasi sesi aktif sebelum update password
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        Alert.alert('Sesi Berakhir', 'Silakan login ulang untuk mengubah kata sandi.');
        navigation.replace('Login');
        return;
      }

      // Eksekusi update password ke Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        Alert.alert('Gagal Mengubah Sandi', error.message);
      } else {
        Alert.alert('Berhasil', 'Kata sandi berhasil diperbarui. Silakan gunakan sandi baru untuk login berikutnya.');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordModalVisible(false);
      }
    } catch (err: any) {
      Alert.alert('Kesalahan', err.message || 'Terjadi kesalahan saat memperbarui sandi.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogout = () => {
    const doLogout = async () => {
      await supabase.auth.signOut();
      navigation.replace('Login');
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Apakah Anda yakin ingin keluar dari akun ini?')) {
        doLogout();
      }
    } else {
      Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar dari akun ini?', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', style: 'destructive', onPress: doLogout },
      ]);
    }
  };

  const userInitial = username ? username.charAt(0).toUpperCase() : 'U';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Background />

      <View style={[styles.container, { flex: 1 }]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleSection}></View>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity activeOpacity={0.9} onPress={handlePickImage}>
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <LinearGradient colors={['#5B8EA6', '#3D6C82']} style={styles.avatar}>
                    <Text style={styles.avatarText}>{userInitial}</Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.editAvatarBadge}
                onPress={handlePickImage}
              >
                <Ionicons name="camera" size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.username}>{username}</Text>
            <Text style={styles.emailText}>{userEmail}</Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Ionicons name="document-text" size={18} color="#5B8EA6" />
                <Text style={styles.statNumber}>{totalNotes}</Text>
              </View>
              <Text style={styles.statLabel}>Total Catatan</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Ionicons name="pin" size={18} color="#5B8EA6" />
                <Text style={styles.statNumber}>{pinnedCount}</Text>
              </View>
              <Text style={styles.statLabel}>Disematkan</Text>
            </View>
          </View>

          {/* Menu / Preferensi Akun */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Preferensi Akun</Text>
          </View>

          <View style={{ gap: 10, marginBottom: 20 }}>
            <TouchableOpacity
              style={styles.menuCard}
              activeOpacity={0.8}
              onPress={() => setEditModalVisible(true)}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="person-outline" size={20} color="#5B8EA6" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Edit Informasi Akun</Text>
                <Text style={styles.menuSubtitle}>Ubah username & email</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color="#A0B0BC" />
            </TouchableOpacity>

            {/* Menu Keamanan dan Sandi */}
            <TouchableOpacity
              style={styles.menuCard}
              activeOpacity={0.8}
              onPress={() => setPasswordModalVisible(true)}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#5B8EA6" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Keamanan dan Sandi</Text>
                <Text style={styles.menuSubtitle}>Perbarui kata sandi akun</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color="#A0B0BC" />
            </TouchableOpacity>
          </View>

          {/* Lainnya */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lainnya</Text>
          </View>

          <View style={{ gap: 10 }}>
            <TouchableOpacity
              style={styles.menuCard}
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert(
                  'Tentang Aplikasi',
                  'Aplikasi Catatan v1.0.0\nDibangun menggunakan React Native, Expo, dan Supabase.'
                )
              }
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="information-circle-outline" size={20} color="#5B8EA6" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Tentang Aplikasi</Text>
                <Text style={styles.menuSubtitle}>Versi dan informasi sistem</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color="#A0B0BC" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuDangerCard}
              activeOpacity={0.8}
              onPress={handleLogout}
            >
              <View style={styles.menuDangerIconContainer}>
                <Ionicons name="log-out-outline" size={20} color="#D9534F" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuDangerTitle}>Keluar</Text>
                <Text style={styles.menuSubtitle}>Akhiri sesi perangkat ini</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color="#A0B0BC" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Modal Edit Username & Email */}
      <Modal
        visible={editModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Informasi Akun</Text>
            <Text style={styles.modalSubtitleText}>
              Perbarui username dan alamat email Anda.
            </Text>

            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Masukkan username baru..."
              placeholderTextColor="#A0B0BC"
              value={inputUsername}
              onChangeText={setInputUsername}
            />

            <Text style={styles.label}>Alamat Email</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Masukkan email baru..."
              placeholderTextColor="#A0B0BC"
              value={inputEmail}
              onChangeText={setInputEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setEditModalVisible(false)}
                disabled={updating}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleUpdateProfile}
                disabled={updating}
              >
                <LinearGradient colors={['#5B8EA6', '#3D6C82']} style={styles.modalSaveGradient}>
                  {updating ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.modalSaveText}>Simpan</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal Keamanan & Sandi */}
      <Modal
        visible={passwordModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Keamanan dan Sandi</Text>
            <Text style={styles.modalSubtitleText}>
              Masukkan kata sandi baru untuk akun Anda.
            </Text>

            <Text style={styles.label}>Sandi Baru</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Minimal 6 karakter..."
              placeholderTextColor="#A0B0BC"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <Text style={styles.label}>Konfirmasi Sandi Baru</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ulangi sandi baru..."
              placeholderTextColor="#A0B0BC"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setPasswordModalVisible(false)}
                disabled={updatingPassword}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleUpdatePassword}
                disabled={updatingPassword}
              >
                <LinearGradient colors={['#5B8EA6', '#3D6C82']} style={styles.modalSaveGradient}>
                  {updatingPassword ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.modalSaveText}>Perbarui</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Navbar bawah */}
      <Navbar
        onAddPress={() => {
          navigation.navigate('Home');
        }}
      />
    </SafeAreaView>
  );
}