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
  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>
      {image && (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      )}
      <TouchableOpacity
        style={styles.draftButton}
        onPress={() => setIsDraft(!isDraft)}
      >
        <Text style={styles.buttonText}>{isDraft ? 'Save as Published' : 'Save as Draft'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.submitButton, uploading && { opacity: 0.5 }]}
        onPress={handleSubmit}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>{uploading ? 'Saving...' : (editingAnnouncement ? 'Update' : 'Submit')}</Text>
      </TouchableOpacity>
      {editingAnnouncement && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelEdit}
        >
          <Text style={styles.buttonText}>Cancel Edit</Text>
        </TouchableOpacity>
      )}
      {announcements.length > 0 && (
        <View style={styles.announcementsList}>
          <Text style={styles.sectionTitle}>Recent Announcements</Text>
          {announcements.slice(0, 3).map((item) => (
            <View key={item.id} style={styles.announcementItem}>
              <View style={styles.announcementContent}>
                <Text style={styles.announcementTitle}>{item.title}</Text>
                <Text style={styles.announcementCategory}>{item.category}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/edit.png' }}
                    style={styles.actionIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/trash.png' }}
                    style={styles.actionIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    paddingBottom: 60,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: colors.red,
    marginBottom: 20,
  },
  input: {
    width: width * 0.9,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.black,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
  },
  imageButton: {
    backgroundColor: colors.gray,
    borderRadius: 10,
    padding: 15,
    width: width * 0.9,
    alignItems: 'center',
    marginVertical: 10,
  },
  imagePreview: {
    width: width * 0.9,
    height: 150,
    borderRadius: 10,
    marginVertical: 10,
  },
  draftButton: {
    backgroundColor: colors.gray,
    borderRadius: 10,
    padding: 15,
    width: width * 0.9,
    alignItems: 'center',
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: colors.red,
    borderRadius: 10,
    padding: 15,
    width: width * 0.9,
    alignItems: 'center',
    marginVertical: 10,
  },
  cancelButton: {
    backgroundColor: colors.gray,
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
  announcementsList: {
    width: width * 0.9,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: colors.red,
    marginBottom: 10,
  },
  announcementItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: colors.black,
    alignItems: 'center',
  },
  announcementContent: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: colors.black,
  },
  announcementCategory: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: colors.red,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
    tintColor: colors.red,
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
