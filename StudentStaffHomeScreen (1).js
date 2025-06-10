import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, Alert, Image, ActivityIndicator } from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import colors from './Colors';
import { auth, db } from './firebaseConfig';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function StudentStaffHomeScreen() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  const [announcements, setAnnouncements] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState(1);

  // Cycling dots animation for loading text
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev % 3) + 1);
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigation.navigate('Selection');
      }
    });

    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      const announcementsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(announcementsData);
      setLoading(false);
    }, (error) => {
      console.error('Firestore error:', error);
      Alert.alert('Error', 'Failed to load announcements');
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
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

  const renderAnnouncement = ({ item }) => (
    <View style={styles.announcementCard}>
      <Text style={styles.announcementTitle}>{item.title}</Text>
      <Text style={styles.announcementContent}>{item.content}</Text>
    </View>
  );

  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Home</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.red} />
          <Text style={styles.loadingText}>Loading{'.'.repeat(dots)}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>
      <FlatList
        data={announcements}
        renderItem={renderAnnouncement}
        keyExtractor={(item) => item.id}
        style={styles.announcementList}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Latest News</Text>}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>LOGOUT</Text>
      </TouchableOpacity>
      <View style={styles.bottomNav}>
        <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/home.png' }} style={styles.bottomIcon} />
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/search.png' }} style={styles.bottomIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('StudentStaffCalendar')}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/calendar.png' }} style={styles.bottomIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('StudentStaffIcon')}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/user-male-circle.png' }} style={styles.bottomIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: colors.red,
    width: '100%',
    padding: 20,
    alignItems: 'left',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 30,
    fontFamily: 'Poppins_700Bold',
    color: colors.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    color: colors.black,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: colors.black,
    marginBottom: 10,
    paddingTop: 20,
  },
  announcementList: {
    width: '100%',
  },
  announcementCard: {
    backgroundColor: colors.red,
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: width * 0.9,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.red,
  },
  announcementTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: colors.black,
  },
  announcementContent: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: colors.yellow,
    marginTop: 5,
  },
  logoutButton: {
    width: width * 0.5,
    height: 44,
    borderRadius: 20,
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 100,
  },
  buttonText: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: colors.red,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
  bottomIcon: {
    width: 30,
    height: 30,
    tintColor: colors.red,
  },
});