import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import Background from '../components/Background';
import styles from '../styles/HomeStyle';
import { supabase } from '../services/supabase';
import { Note } from '../types/note';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const CATEGORIES = ['Semua', 'Favorit', 'Pribadi', 'Pekerjaan', 'Ide'];

export default function HomeScreen({ navigation }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  //  Buat fiter search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Modal & Note Form State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Pribadi');
  const [isPinned, setIsPinned] = useState(false);
  const [saving, setSaving] = useState(false);

  const showAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
      if (onOk) onOk();
    } else {
      Alert.alert(title, message, [
        {
          text: 'OK',
          onPress: () => {
            if (onOk) onOk();
          },
        },
      ]);
    }
  };

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
        showAlert('Kesalahan', 'Gagal memuat catatan.');
      } else {
        setNotes(data || []);
      }
    } catch (err: any) {
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
    setCategory('Pribadi');
    setIsPinned(false);
    setModalVisible(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category || 'Pribadi');
    setIsPinned(!!note.is_pinned);
    setModalVisible(true);
  };

  const handleSaveNote = async () => {
    if (!title.trim()) {
      showAlert('Peringatan', 'Harap masukkan judul catatan.');
      return;
    }

    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        showAlert('Kesalahan', 'Sesi berakhir. Silakan masuk kembali.');
        navigation.replace('Login');
        return;
      }

      const notePayload = {
        title: title.trim(),
        content: content.trim(),
        category: category,
        is_pinned: isPinned,
        user_id: user.id,
      };

      if (editingNote) {
        const { error } = await supabase
          .from('notes')
          .update({
            title: title.trim(),
            content: content.trim(),
            category: category,
            is_pinned: isPinned,
          })
          .eq('id', editingNote.id);

        if (error) {
          console.warn('Fallback update without extra fields:', error.message);
          const { error: fallbackErr } = await supabase
            .from('notes')
            .update({
              title: title.trim(),
              content: content.trim(),
            })
            .eq('id', editingNote.id);

          if (fallbackErr) {
            showAlert('Gagal Menyimpan', fallbackErr.message);
            return;
          }
        }
      } else {
        const { error } = await supabase.from('notes').insert([notePayload]);

        if (error) {
          console.warn('Fallback insert without extra fields:', error.message);
          const { error: fallbackErr } = await supabase.from('notes').insert([
            {
              title: title.trim(),
              content: content.trim(),
              user_id: user.id,
            },
          ]);

          if (fallbackErr) {
            showAlert('Gagal Membuat', fallbackErr.message);
            return;
          }
        }
      }

      setModalVisible(false);
      fetchNotes();
    } catch (err: any) {
      showAlert('Kesalahan', err.message || 'Terjadi kesalahan yang tidak terduga.');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePin = async (note: Note) => {
    const newPinnedState = !note.is_pinned;
    setNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, is_pinned: newPinnedState } : n))
    );

    try {
      await supabase
        .from('notes')
        .update({ is_pinned: newPinnedState })
        .eq('id', note.id);
    } catch (err) {
      console.warn('Pin status update failed on server:', err);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    const confirmDelete = async () => {
      const { error } = await supabase.from('notes').delete().eq('id', noteId);

      if (error) {
        showAlert('Gagal Menghapus', error.message);
      } else {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
        confirmDelete();
      }
    } else {
      Alert.alert('Hapus Catatan', 'Apakah Anda yakin ingin menghapus catatan ini?', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: confirmDelete },
      ]);
    }
  };

  const handleLogout = () => {
    const doLogout = async () => {
      await supabase.auth.signOut();
      navigation.replace('Login');
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Apakah Anda yakin ingin keluar?')) {
        doLogout();
      }
    } else {
      Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar?', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', style: 'destructive', onPress: doLogout },
      ]);
    }
  };

  // Filter notes by search & category
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === 'Semua') return true;
      if (selectedCategory === 'Favorit') return !!n.is_pinned;
      return (n.category || 'Pribadi') === selectedCategory;
    });
  }, [notes, searchQuery, selectedCategory]);

  const pinnedNotes = useMemo(() => {
    return notes.filter((n) => !!n.is_pinned);
  }, [notes]);

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

  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

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
          {item.category ? (
            <View style={styles.noteCategoryPill}>
              <Text style={styles.noteCategoryText}>{item.category}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.noteActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.pinActionButton]}
            onPress={() => handleTogglePin(item)}
          >
            <Ionicons
              name={item.is_pinned ? 'pin' : 'pin-outline'}
              size={16}
              color={item.is_pinned ? '#5B8EA6' : '#A0B0BC'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteActionButton]}
            onPress={() => handleDeleteNote(item.id)}
          >
            <Ionicons name="trash-outline" size={16} color="#D9534F" />
          </TouchableOpacity>
        </View>
      </View>

      {item.content ? (
        <Text style={styles.noteContent} numberOfLines={3}>
          {item.content}
        </Text>
      ) : null}

      <View style={styles.noteFooter}>
        <Text style={styles.noteDate}>{formatDate(item.created_at)}</Text>
        <Ionicons name="chevron-forward-outline" size={14} color="#A0B0BC" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Background />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.userBadge}>
              <LinearGradient
                colors={['#5B8EA6', '#3D6C82']}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>{userInitial}</Text>
              </LinearGradient>
              <View>
                <Text style={styles.greeting}>Selamat datang,</Text>
                <Text style={styles.username}>
                  {userEmail ? userEmail.split('@')[0] : 'Pengguna'}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#D9534F" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerTitleSection}>
            <Text style={styles.headerTitle}>
              Dashboard <Text style={styles.headerAccent}>Catatan</Text>
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#7A8D9C" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari catatan berdasarkan judul atau isi..."
            placeholderTextColor="#A0B0BC"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#A0B0BC" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="document-text" size={18} color="#5B8EA6" />
              <Text style={styles.statNumber}>{notes.length}</Text>
            </View>
            <Text style={styles.statLabel}>Total Catatan</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="pin" size={18} color="#5B8EA6" />
              <Text style={styles.statNumber}>{pinnedNotes.length}</Text>
            </View>
            <Text style={styles.statLabel}>Disematkan</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="calendar-outline" size={18} color="#5B8EA6" />
              <Text style={styles.statNumber}>
                {
                  notes.filter((n) => {
                    const diffDays =
                      (new Date().getTime() - new Date(n.created_at).getTime()) /
                      (1000 * 3600 * 24);
                    return diffDays <= 7;
                  }).length
                }
              </Text>
            </View>
            <Text style={styles.statLabel}>Minggu Ini</Text>
          </View>
        </View>

        {/* Category Filters Scroll */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    isActive && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isActive && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Pinned Notes Highlight Section */}
        {pinnedNotes.length > 0 && selectedCategory === 'Semua' && !searchQuery ? (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Catatan Disematkan</Text>
              <Text style={styles.sectionBadge}>{pinnedNotes.length} disematkan</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pinnedList}
            >
              {pinnedNotes.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.pinnedCard}
                  activeOpacity={0.85}
                  onPress={() => openEditModal(item)}
                >
                  <View style={styles.pinnedCardHeader}>
                    <View style={styles.pinBadge}>
                      <Ionicons name="pin" size={12} color="#5B8EA6" />
                      <Text style={styles.pinBadgeText}>Disematkan</Text>
                    </View>
                    {item.category ? (
                      <Text style={styles.noteCategoryText}>{item.category}</Text>
                    ) : null}
                  </View>
                  <Text style={styles.pinnedTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.pinnedContent} numberOfLines={2}>
                    {item.content || 'Tidak ada isi...'}
                  </Text>
                  <Text style={styles.pinnedDate}>{formatDate(item.created_at)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* Notes List Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'Semua' ? 'Semua Catatan' : `Catatan ${selectedCategory}`}
          </Text>
          <Text style={styles.sectionBadge}>{filteredNotes.length} item</Text>
        </View>

        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color="#5B8EA6" />
          </View>
        ) : (
          <FlatList
            data={filteredNotes}
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
                  size={56}
                  color="#7A8D9C"
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyTitle}>Tidak Ada Catatan</Text>
                <Text style={styles.emptyText}>
                  {searchQuery
                    ? `Tidak ada catatan yang cocok dengan "${searchQuery}".`
                    : 'Ketuk tombol "+" di bawah untuk menambah catatan baru.'}
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
                {editingNote ? 'Edit Catatan' : 'Buat Catatan Baru'}
              </Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Judul Catatan..."
                placeholderTextColor="#A0B0BC"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />

              <TextInput
                style={styles.modalContentInput}
                placeholder="Tulis isi catatan Anda di sini..."
                placeholderTextColor="#A0B0BC"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={4}
              />

              <Text style={styles.label}>Pilih Kategori</Text>
              <View style={styles.modalCategoryContainer}>
                {['Pribadi', 'Pekerjaan', 'Ide'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.modalCategoryOption,
                      category === cat && styles.modalCategoryOptionActive,
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.modalCategoryText,
                        category === cat && styles.modalCategoryTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.pinToggleRow}>
                <Text style={styles.pinToggleText}>Sematkan ke atas Dashboard</Text>
                <Switch
                  value={isPinned}
                  onValueChange={setIsPinned}
                  trackColor={{ false: '#E8E2DA', true: '#5B8EA6' }}
                  thumbColor="#FFFFFF"
                />
              </View>

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
                        {editingNote ? 'Perbarui Catatan' : 'Simpan Catatan'}
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
