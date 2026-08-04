import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

interface NavbarProps {
  onAddPress: () => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Komponen Item Navbar Biasa (Home / Profile)
const NavItem = ({ 
  icon, 
  label, 
  isActive,
  onPress
}: { 
  icon: keyof typeof Ionicons.glyphMap, 
  label: string, 
  isActive?: boolean,
  onPress?: () => void
}) => {
  const translateY = useRef(new Animated.Value(0)).current;

  const handleHoverIn = () => {
    Animated.spring(translateY, {
      toValue: -4,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();
  };

  const handleHoverOut = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onHoverIn={Platform.OS === 'web' ? handleHoverIn : undefined}
      onHoverOut={Platform.OS === 'web' ? handleHoverOut : undefined}
      onPressIn={Platform.OS !== 'web' ? handleHoverIn : undefined}
      onPressOut={Platform.OS !== 'web' ? handleHoverOut : undefined}
      style={[
        styles.navItem, 
        { transform: [{ translateY }] },
        Platform.OS === 'web' && { cursor: 'pointer' } as any 
      ]}
    >
      <Ionicons name={icon} size={22} color={isActive ? "#5B8EA6" : "#A0B0BC"} />
      <Text style={[styles.navText, { color: isActive ? '#5B8EA6' : '#A0B0BC' }]}>{label}</Text>
      {isActive && <View style={styles.activeDot} />}
    </AnimatedPressable>
  );
};

const Navbar = ({ onAddPress }: NavbarProps) => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();

  const centerTranslateY = useRef(new Animated.Value(0)).current;

  const handleCenterHoverIn = () => {
    Animated.spring(centerTranslateY, {
      toValue: -10,
      useNativeDriver: true,
      speed: 20,
      bounciness: 15,
    }).start();
  };

  const handleCenterHoverOut = () => {
    Animated.spring(centerTranslateY, {
      toValue: 0,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  return (
    <View style={styles.wrapper}>
      <AnimatedPressable
        onPress={onAddPress}
        onHoverIn={Platform.OS === 'web' ? handleCenterHoverIn : undefined}
        onHoverOut={Platform.OS === 'web' ? handleCenterHoverOut : undefined}
        onPressIn={Platform.OS !== 'web' ? handleCenterHoverIn : undefined}
        onPressOut={Platform.OS !== 'web' ? handleCenterHoverOut : undefined}
        style={[
          styles.floatingButtonContainer,
          { transform: [{ translateY: centerTranslateY }] },
          Platform.OS === 'web' && { cursor: 'pointer' } as any
        ]}
      >
        <View style={styles.floatingButton}>
          <Ionicons name="add" size={28} color="#ffffff" />
        </View>
      </AnimatedPressable>

      {/* Badan Navbar Utama */}
      <View style={styles.navContainer}>
        <NavItem 
          icon="home" 
          label="Home" 
          isActive={route.name === 'Home'} 
          onPress={() => navigation.navigate('Home')}
        />
        
        {/* Ruang kosong di tengah */}
        <View style={styles.centerSpacer} />

        <NavItem 
          icon={route.name === 'Profile' ? 'person' : 'person-outline'} 
          label="Profile" 
          isActive={route.name === 'Profile'} 
          onPress={() => navigation.navigate('Profile')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: '100%',
    backgroundColor: 'transparent',
    paddingBottom: 20,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 65,
    paddingHorizontal: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  centerSpacer: {
    width: 70,
  },
  floatingButtonContainer: {
    position: 'absolute',
    top: -22,
    left: '50%',
    marginLeft: -28,
    zIndex: 10,
  },
  floatingButton: {
    width: 56,
    height: 56,
    backgroundColor: '#5B8EA6',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#5B8EA6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    borderWidth: 4,
    borderColor: '#F5F5F5',
  },
  navText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#5B8EA6',
    marginTop: 2,
  }
});

export default Navbar;