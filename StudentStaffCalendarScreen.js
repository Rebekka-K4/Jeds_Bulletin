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
        theme={{
          calendarBackground: colors.white,
          textSectionTitleColor: colors.black,
          selectedDayBackgroundColor: colors.yellow,
          selectedDayTextColor: colors.black,
          todayTextColor: colors.red,
          dayTextColor: colors.black,
          textDisabledColor: colors.gray,
          dotColor: colors.red,
          selectedDotColor: colors.black,
          arrowColor: colors.red,
          monthTextColor: colors.black,
          textDayFontFamily: 'Poppins_400Regular',
          textMonthFontFamily: 'Poppins_700Bold',
          textDayHeaderFontFamily: 'Poppins_400Regular',
          textDayFontSize: 16,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 14,
        }}
        onDayPress={handleDayPress}
      />
      <Text style={styles.sectionTitle}>Upcoming Events & Announcements</Text>
      <FlatList
        data={upcomingItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      {selectedEvent && (
        <View style={styles.eventDetails}>
          <Text style={styles.eventDetailsTitle}>{selectedEvent.title}</Text>
          {selectedEvent.category && (
            <Text style={styles.eventDetailsCategory}>{selectedEvent.category}</Text>
          )}
          <Text style={styles.eventDetailsContent}>{selectedEvent.content || 'No additional details.'}</Text>
          {selectedEvent.isHighlighted && (
            <Text style={styles.eventDetailsHighlight}>[Highlighted Event]</Text>
          )}
        </View>
      )}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('StudentStaffHomeScreen')}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/home.png' }} style={styles.bottomIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/search.png' }} style={styles.bottomIcon} />
        </TouchableOpacity>
        <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/calendar.png' }} style={styles.bottomIcon} />
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
    backgroundColor: colors.white,
    alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: colors.red,
    width: '100%',
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 30,
    fontFamily: 'Poppins_700Bold',
    color: colors.yellow,
  },
  calendar: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.red,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: colors.red,
    marginBottom: 10,
  },
  list: {
    width: '100%',
  },
  itemContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: width * 0.9,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.red,
  },
  itemTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: colors.black,
  },
  itemType: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: colors.red,
  },
  itemDate: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: colors.black,
  },
  itemContent: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: colors.black,
    marginTop: 5,
  },
  highlightLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: colors.yellow,
    marginTop: 5,
  },
  eventDetails: {
    backgroundColor: colors.lightRed,
    borderRadius: 10,
    padding: 15,
    width: '90%',
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.red,
  },
  eventDetailsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: colors.black,
  },
  eventDetailsCategory: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: colors.red,
    marginVertical: 5,
  },
  eventDetailsContent: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: colors.black,
  },
  eventDetailsHighlight: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: colors.yellow,
    marginTop: 5,
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