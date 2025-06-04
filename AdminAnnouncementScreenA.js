import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Dimensions } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from './firebaseConfig';
import colors from './Colors';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function AdminAnnouncementScreen() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [isDraft, setIsDraft] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null); // Track announcement being edited

  // Real-time listener for announcements
  useEffect(() => {
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const announcementsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(announcementsData);
    }, (error) => {
      console.error('Firestore error:', error);
      Alert.alert('Error', 'Failed to load announcements');
    });

    return () => unsubscribe();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Denied', 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !category || !content) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setUploading(true);
    try {
      let imageUrl = editingAnnouncement?.imageUrl || '';
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `announcements/${Date.now()}_${title}`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      if (editingAnnouncement) {
        // Update existing announcement
        await setDoc(doc(db, 'announcements', editingAnnouncement.id), {
          title,
          category,
          content,
          isDraft,
          imageUrl,
          createdAt: editingAnnouncement.createdAt, // Preserve original creation date
        });
        Alert.alert('Success', 'Announcement updated');
      } else {
        // Create new announcement
        await addDoc(collection(db, 'announcements'), {
          title,
          category,
          content,
          isDraft,
          imageUrl,
          createdAt: new Date(),
        });
        Alert.alert('Success', 'Announcement added');
      }

      // Reset form
      setTitle('');
      setCategory('');
      setContent('');
      setImage(null);
      setIsDraft(false);
      setEditingAnnouncement(null);
    } catch (error) {
      console.error('Error saving announcement:', error);
      Alert.alert('Error', `Failed to ${editingAnnouncement ? 'update' : 'add'} announcement`);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (announcement) => {
    // Populate form with announcement data
    setTitle(announcement.title);
    setCategory(announcement.category);
    setContent(announcement.content);
    setIsDraft(announcement.isDraft);
    setImage(announcement.imageUrl || null);
    setEditingAnnouncement(announcement);
  };

  const handleCancelEdit = () => {
    // Reset form to create mode
    setTitle('');
    setCategory('');
    setContent('');
    setImage(null);
    setIsDraft(false);
    setEditingAnnouncement(null);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this announcement?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'announcements', id));
              Alert.alert('Success', 'Announcement deleted');
            } catch (error) {
              console.error('Delete announcement error:', error);
              Alert.alert('Error', 'Failed to delete announcement');
            }
          },
        },
      ]
    );
  };
