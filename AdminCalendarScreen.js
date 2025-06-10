import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, Alert, Image, Modal, TextInput } from 'react-native';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import colors from './Colors';
import { db, auth } from './firebaseConfig';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function AdminCalendar() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '' });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigation.navigate('Selection');
      }
    });

    const q = query(collection(db, 'events'), orderBy('date', 'desc'));
    const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
      setLoading(false);
    }, (error) => {
      console.error('Firestore error:', error);
      setError('Failed to load events');
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, [navigation]);

  const handleAddEvent = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in to add an event');
      return;
    }
    if (!newEvent.title || !newEvent.description || !newEvent.date) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const date = new Date(newEvent.date).toISOString();
      await addDoc(collection(db, 'events'), {
        title: newEvent.title,
        description: newEvent.description,
        date,
        createdAt: new Date(),
      });
      setModalVisible(false);
      setNewEvent({ title: '', description: '', date: '' });
      Alert.alert('Success', 'Event added');
    } catch (error) {
      console.error('Error adding event:', error);
      Alert.alert('Error', 'Failed to add event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!user) {
      Alert.alert('Error', 'Please log in to delete an event');
      return;
    }
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'events', id));
              Alert.alert('Success', 'Event deleted');
            } catch (error) {
              console.error('Delete event error:', error);
              Alert.alert('Error', 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  const renderEvent = ({ item }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventContentContainer}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>{new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.eventDescription}>{item.description}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteEvent(item.id)}>
        <Image
          source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/trash.png' }}
          style={styles.deleteIcon}
        />
      </TouchableOpacity>
    </View>
  );

  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Admin Calendar</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id}
          style={styles.eventList}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListHeaderComponent={<Text style={styles.sectionTitle}>Events</Text>}
          ListEmptyComponent={<Text style={styles.emptyText}>No events available</Text>}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Add Event</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Event</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newEvent.title}
              onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newEvent.description}
              onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Date (YYYY-MM-DD)"
              value={newEvent.date}
              onChangeText={(text) => setNewEvent({ ...newEvent, date: text })}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleAddEvent}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.bottomNav}>
        <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/home.png' }} style={styles.bottomIcon} />
        <TouchableOpacity onPress={() => navigation.navigate('AdminIcon')}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/user-male-circle.png' }} style={styles.bottomIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AdminCalendar')}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/calendar.png' }} style={styles.bottomIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AdminAnnouncements')}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/microphone.png' }} style={styles.bottomIcon} />
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
    paddingBottom: 60,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: colors.red,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: colors.red,
    marginBottom: 10,
    paddingTop: 20,
  },
  eventList: {
    width: '100%',
  },
  eventCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: width * 0.9,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eventContentContainer: {
    flex: 1,
    marginRight: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: colors.black,
  },
  eventDate: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: colors.red,
    marginVertical: 5,
  },
  eventDescription: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: colors.black,
  },
  deleteButton: {
    padding: 5,
  },
  deleteIcon: {
    width: 24,
    height: 24,
    tintColor: colors.red,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: colors.black,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: colors.red,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: colors.gray,
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: colors.red,
    borderRadius: 10,
    padding: 15,
    width: width * 0.9,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: colors.yellow,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: width * 0.9,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: colors.red,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: colors.black,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: colors.red,
    borderRadius: 10,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
  modalCancelButton: {
    backgroundColor: colors.gray,
    borderRadius: 10,
    padding: 10,
    width: '100',
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignSelf: 'center',
  },
  bottomIcon: {
    width: 30,
    height: 30,
    tintColor: colors.red,
  },
});