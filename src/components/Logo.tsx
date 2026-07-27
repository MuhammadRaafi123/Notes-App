import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Logo() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#5B8EA6', '#3D6C82']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.logoBox}
      >
        <Ionicons name="document-text" size={34} color="#FFFFFF" />
      </LinearGradient>

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
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#3D6C82',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 14,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    marginTop: 14,
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  primary: {
    color: '#5B8EA6',
  },
  subtitle: {
    marginTop: 4,
    color: '#94A3B8',
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '600',
  },
});