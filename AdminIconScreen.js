import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Alert, SafeAreaView } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import colors from './Colors';
import { auth } from './firebaseConfig';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useNavigation } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
export default function AdminIconScreen() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigation.navigate('Selection');
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Selection');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };
    if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Profile</Text>
        <Ionicons name="information-circle-outline" size={24} color="black" />
      </View>

      {/* Large Profile Image */}
      <TouchableOpacity onPress={pickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.largeProfileImage} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Image
              source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/add-image.png' }}
              style={styles.placeholderImage}
            />
          </View>
        )}
      </TouchableOpacity>
      {/* Profile Info */}
      <View style={styles.profileCard}>
        <Text style={styles.name}>{user?.displayName || 'Admin User'}</Text>
        <Text style={styles.username}>Username: {user?.email || 'N/A'}</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
        <Text style={styles.signOutText}>SIGN OUT</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomTab}>
        <TouchableOpacity onPress={() => navigation.navigate('AdminHomeScreen')}>
          <Ionicons name="home" size={30} color={colors.red} />
        </TouchableOpacity>
        <TouchableOpacity>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.bottomProfileIcon} />
          ) : (
            <Image
              source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/user-male-circle.png' }}
              style={styles.bottomProfileIcon}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AdminCalendar')}>
          <Ionicons name="calendar" size={30} color={colors.red} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AdminAnnouncements')}>
          <Ionicons name="search" size={30} color={colors.red} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
  },
  largeProfileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: 'center',
    borderWidth: 4,
    borderColor: '#333',
    marginTop: 10,
    marginBottom: 20,
  },
  placeholderContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.lightRed,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 4,
    borderColor: '#333',
    marginTop: 10,
    marginBottom: 20,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    tintColor: colors.red,
  },
  profileCard: {
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    padding: 20,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
  },
  username: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#555',
    marginTop: 5,
  },
  signOutButton: {
    backgroundColor: colors.red,
    borderRadius: 30,
    marginTop: 30,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 50,
  },
  signOutText: {
    color: colors.yellow,
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    height: 70,
    width: '100%',
    backgroundColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomProfileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#888',
  },
});


