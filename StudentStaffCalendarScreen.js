import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
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

  // Check for authentication
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

  // Fetch events and announcements
  useEffect(() => {
    const eventsQuery = query(collection(db, 'events'), orderBy('date', 'asc'));
    const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: 'Event',
      }));
      setEvents(eventsData);
    }, (error) => console.error('Events fetch error:', error));

    const announcementsQuery = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsubscribeAnnouncements = onSnapshot(announcementsQuery, (snapshot) => {
      const announcementsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: 'Announcement',
      }));
      setAnnouncements(announcementsData);
    }, (error) => console.error('Announcements fetch error:', error));

    return () => {
      unsubscribeEvents();
      unsubscribeAnnouncements();
    };
  }, []);

  // Mark calendar dates with events/announcements
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

  // Handle day press on calendar
  const handleDayPress = (day) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);

    const selectedEvents = events.filter((event) => {
      const eventDate = event.date.toDate ? event.date.toDate() : new Date(event.date);
      return eventDate.toISOString().split('T')[0] === dateString;
    });

    setSelectedEvent(selectedEvents.length > 0 ? selectedEvents[0] : null);
  };

  // Combine upcoming events and announcements
  const upcomingItems = [...events, ...announcements]
    .filter((item) => {
      const itemDate = item.date ? (item.date.toDate ? item.date.toDate() : new Date(item.date)) :
        (item.createdAt.toDate ? item.createdAt.toDate() : new Date(item.createdAt));
      const today = new Date();
      const futureCutoff = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      return itemDate >= today && itemDate <= futureCutoff;
    })
    .sort((a, b) => {
      const dateA = a.date ? (a.date.toDate ? a.date.toDate() : new Date(a.date)) :
        (a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt));
      const dateB = b.date ? (b.date.toDate ? b.date.toDate() : new Date(b.date)) :
        (b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt));
      return dateA - dateB;
    });

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemType}>{item.type}</Text>
      <Text style={styles.itemDate}>
        {item.date ? new Date(item.date.toDate ? item.date.toDate() : item.date).toLocaleDateString() :
          new Date(item.createdAt.toDate ? item.createdAt.toDate() : item.createdAt).toLocaleDateString()}
      </Text>
      {item.content && <Text style={styles.itemContent}>{item.content}</Text>}
      {item.isHighlighted && <Text style={styles.highlightLabel}>[Highlighted]</Text>}
    </View>
  );

  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Calendar</Text>
      </View>

      <Calendar
        style={styles.calendar}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          calendarBackground: colors.white,
          textSectionTitleColor: colors.black,
          selectedDayBackgroundColor: colors.yellow,
          selectedDayTextColor: colors.black,
          todayTextColor: colors.red,
          dayTextColor: colors.black,
          textDisabledColor: colors.gray,
          dotColor: colors.red, // Fixed typo here
        }}
      />

      <FlatList
        data={upcomingItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.lightGray,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: colors.black,
  },
  calendar: {
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: colors.lightGray,
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: colors.black,
  },
  itemType: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: colors.darkGray,
  },
  itemDate: {
    fontSize: 14,
    color: colors.black,
  },
  itemContent: {
    marginTop: 5,
    fontSize: 14,
    color: colors.black,
  },
  highlightLabel: {
    marginTop: 5,
    color: colors.yellow,
    fontWeight: 'bold',
  },
});
