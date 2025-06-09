import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import colors from './Colors';
import { auth } from './firebaseConfig';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
export default function StudentStaffIconScreen() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
   const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const db = getFirestore();

  useEffect(() => {
   const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole(userData.role === 'admin' ? 'Admin' : 'Student/Staff');
            setName(userData.name || 'No Name Provided');
          } else {
            setRole('Unknown');
            setName('Unknown');
            Alert.alert('Error', 'User data not found. Please contact an admin.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setRole('Unknown');
          setName('Unknown');
          Alert.alert('Error', 'Failed to load user data.');
        }
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

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };
    if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Profile</Text>
      </View>
      <View style={styles.profileContainer}>
        <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Image
                source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/add-image.png' }}
                style={styles.placeholderImage}
              />
            </View>
          )}
          <Text style={styles.addPhotoText}>Add Profile Photo</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>User Information</Text>
        {user ? (
          <>
            <Text style={styles.profileText}>Email: {user.email}</Text>
            <Text style={styles.profileText}>Role: {user.email.includes('admin') ? 'Admin' : 'Student/Staff'}</Text>
          </>
        ) : (
          <Text style={styles.profileText}>No user data available</Text>
        )}
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>LOGOUT</Text>
      </TouchableOpacity>
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('StudentStaffHomeScreen')}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/home.png' }} style={styles.bottomIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/search.png' }} style={styles.bottomIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('StudentStaffCalendar')}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/calendar.png' }} style={styles.bottomIcon} />
        </TouchableOpacity>
        <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/user-male-circle.png' }} style={styles.bottomIcon} />
      </View>
    </View>
  );
}


