import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import colors from './Colors';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function StudentStaffSearchScreen() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsSnapshot = await getDocs(collection(db, 'news'));
        const news = newsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'News',
        }));

        const eventsSnapshot = await getDocs(collection(db, 'events'));
        const events = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'Event',
        }));

        const announcementsSnapshot = await getDocs(collection(db, 'announcements'));
        const announcements = announcementsSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            type: 'Announcement',
          }))
          .filter(item => !item.isDraft);

        const combinedData = [...news, ...events, ...announcements];
        setData(combinedData);
        setFilteredData([]);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load data');
      }
    };

    fetchData();
  }, []);

  const filterData = (dataToFilter) => {
    let result = [...dataToFilter];
    if (searchQuery) {
      result = result.filter(item =>
        item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredData(result);
  };

  useEffect(() => {
    filterData(data);
  }, [searchQuery, data]);
