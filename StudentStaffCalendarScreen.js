import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Calendar } from 'react-native-calendars';
import colors from './Colors';
import { auth, db } from './firebaseConfig';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function StudentStaffCalendarScreen() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigation.navigate('Selection');
      }
    });
    return () => unsubscribeAuth();
  }, [navigation]);

  useEffect(() => {
    const eventsQuery = query(collection(db, 'events'), orderBy('date', 'asc'));
    const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: 'Event',
      }));
      setEvents(eventsData);
    }, (error) => {
      console.error('Events fetch error:', error);
    });

    const announcementsQuery = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsubscribeAnnouncements = onSnapshot(announcementsQuery, (snapshot) => {
      const announcementsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: 'Announcement',
      }));
      setAnnouncements(announcementsData);
    }, (error) => {
      console.error('Announcements fetch error:', error);
    });

    return () => {
      unsubscribeEvents();
      unsubscribeAnnouncements();
    };
  }, []);

  useEffect(() => {
    const marked = {};
    const today = new Date();
    const cutoffDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    events.forEach((event) => {
      if (event.date) {
        const eventDate = event.date.toDate ? event.date.toDate() : new Date(event.date);
        if (eventDate >= cutoffDate) {
          const dateString = eventDate.toISOString().split('T')[0];
          marked[dateString] = {
            marked: true,
            dotColor: colors.red,
            selected: selectedDate === dateString,
            selectedColor: event.isHighlighted ? colors.yellow : colors.red,
            customStyles: event.isHighlighted ? {
              container: { backgroundColor: colors.yellow },
              text: { color: colors.black },
            } : undefined,
          };
        }
      }
    });

    announcements.forEach((announcement) => {
      if (announcement.createdAt) {
        const announcementDate = announcement.createdAt.toDate ? announcement.createdAt.toDate() : new Date(announcement.createdAt);
        if (announcementDate >= cutoffDate) {
          const dateString = announcementDate.toISOString().split('T')[0];
          marked[dateString] = {
            marked: true,
            dotColor: colors.red,
            selected: selectedDate === dateString,
            selectedColor: colors.red,
          };
        }
      }
    });

    setMarkedDates(marked);
  }, [events, announcements, selectedDate]);

  const handleDayPress = (day) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);

    const selectedEvents = events.filter((event) => {
      const eventDate = event.date.toDate ? event.date.toDate() : new Date(event.date);
      return eventDate.toISOString().split('T')[0] === dateString;
    });

    setSelectedEvent(selectedEvents.length > 0 ? selectedEvents[0] : null);
  };
