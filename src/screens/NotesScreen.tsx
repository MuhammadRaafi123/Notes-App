import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import Background from '../components/Background';
import styles from '../styles/NotesStyle';
import { supabase } from '../services/supabase';
import { Note } from '../types/note';

type Props = NativeStackScreenProps<RootStackParamList, 'Notes'>;

export default function NotesScreen({ navigation }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const fetchNotes = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigation.replace('Login');
        return;
      }

      setUserEmail(user.email || '');

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error.message);
        Alert.alert('Kesalahan', 'Gagal memuat catatan.');
      } else {
        setNotes(data || []);
      }
    } catch (err) {
      console.error('Error in fetchNotes:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigation]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotes();
  };

  const openAddModal = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setModalVisible(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setModalVisible(true);
  };

  const handleSaveNote = async () => {
    if (!title.trim()) {
      Alert.alert('Peringatan', 'Harap masukkan judul catatan.');
      return;
    }

    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Kesalahan', 'Sesi berakhir. Silakan masuk kembali.');
        navigation.replace('Login');
        return;
      }

      if (editingNote) {
        const { error } = await supabase
          .from('notes')
          .update({
            title: title.trim(),
            content: content.trim(),
          })
          .eq('id', editingNote.id);

        if (error) {
          Alert.alert('Gagal Menyimpan', error.message);
        } else {
          setModalVisible(false);
          fetchNotes();
        }
      } else {
        const { error } = await supabase.from('notes').insert([
          {
            title: title.trim(),
            content: content.trim(),
            user_id: user.id,
          },
        ]);

        if (error) {
          Alert.alert('Gagal Membuat', error.message);
        } else {
          setModalVisible(false);
          fetchNotes();
        }
      }
    } catch (err: any) {
      Alert.alert('Kesalahan', err.message || 'Terjadi kesalahan yang tidak terduga.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    Alert.alert(
      'Hapus Catatan',
      'Apakah Anda yakin ingin menghapus catatan ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('notes')
              .delete()
              .eq('id', noteId);

            if (error) {
              Alert.alert('Gagal Menghapus', error.message);
            } else {
              setNotes((prev) => prev.filter((n) => n.id !== noteId));
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.noteCard}
      activeOpacity={0.8}
      onPress={() => openEditModal(item)}
    >
      <View style={styles.noteHeader}>
        <View style={styles.noteTitleContainer}>
          <Text style={styles.noteTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNote(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={18} color="#D9534F" />
        </TouchableOpacity>
      </View>

      {item.content ? (
        <Text style={styles.noteContent} numberOfLines={3}>
          {item.content}
        </Text>
      ) : null}

      <Text style={styles.noteDate}>{formatDate(item.created_at)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Background />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>
                {userEmail ? `Halo, ${userEmail.split('@')[0]}` : 'Halo'}
              </Text>
              <Text style={styles.headerTitle}>
                Catatan <Text style={styles.headerAccent}>Saya</Text>
              </Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#D9534F" />
              <Text style={styles.logoutText}>Keluar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{notes.length}</Text>
            <Text style={styles.statLabel}>Total Catatan</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {notes.filter((n) => {
                const diffDays =
                  (new Date().getTime() - new Date(n.created_at).getTime()) /
                  (1000 * 3600 * 24);
                return diffDays <= 7;
              }).length}
            </Text>
            <Text style={styles.statLabel}>Minggu Ini</Text>
          </View>
        </View>

        {/* Note List */}
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color="#5B8EA6" />
          </View>
        ) : (
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            renderItem={renderNoteItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#5B8EA6']}
                tintColor="#5B8EA6"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="document-text-outline"
                  size={64}
                  color="#7A8D9C"
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyTitle}>Belum Ada Catatan</Text>
                <Text style={styles.emptyText}>
                  Ketuk tombol '+' di bawah untuk membuat catatan pertama Anda.
                </Text>
              </View>
            }
          />
        )}

        {/* FAB */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={openAddModal}
        >
          <LinearGradient
            colors={['#5B8EA6', '#3D6C82']}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Create / Edit Note Modal */}
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {editingNote ? 'Edit Catatan' : 'Catatan Baru'}
              </Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Judul..."
                placeholderTextColor="#A0B0BC"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />

              <TextInput
                style={styles.modalContentInput}
                placeholder="Tulis catatan Anda di sini..."
                placeholderTextColor="#A0B0BC"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={5}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setModalVisible(false)}
                  disabled={saving}
                >
                  <Text style={styles.modalCancelText}>Batal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={handleSaveNote}
                  disabled={saving}
                >
                  <LinearGradient
                    colors={['#5B8EA6', '#3D6C82']}
                    style={styles.modalSaveGradient}
                  >
                    {saving ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.modalSaveText}>
                        {editingNote ? 'Perbarui' : 'Simpan'}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
