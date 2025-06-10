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

 const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title || 'Untitled'}</Text>
      <Text style={styles.itemType}>{item.type}</Text>
      {item.category && <Text style={styles.itemCategory}>{item.category}</Text>}
      {item.type === 'Announcement' && item.contentImageUrls && Array.isArray(item.contentImageUrls) && item.contentImageUrls.length > 0 && (
        item.contentImageUrls.map((uri, index) => (
          <Image
            key={`content-image-${item.id}-${index}`}
            source={{ uri }}
            style={styles.announcementImage}
          />
        ))
      )}
      {item.type === 'Announcement' && item.content && (
        <Text style={styles.itemContent}>{item.content}</Text>
      )}
      {(item.date || item.createdAt) && (
        <Text style={styles.itemDate}>
          {new Date(item.date || (item.createdAt.toDate ? item.createdAt.toDate() : item.createdAt)).toLocaleDateString()}
        </Text>
      )}
    </View>
  );

  const categoryIcons = {
    'All Notices': 'https://img.icons8.com/ios-filled/50/000000/pin.png',
    'New Notices': 'https://img.icons8.com/ios-filled/50/000000/bell.png',
    'Campus Calendar': 'https://img.icons8.com/ios-filled/50/000000/calendar.png',
  };

  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for notices here"
          placeholderTextColor={colors.yellow}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Image
          source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/search.png' }}
          style={styles.searchIcon}
        />
      </View>
      <View style={styles.categoryTabs}>
        {['All Notices', 'New Notices', 'Campus Calendar'].map(category => (
          <TouchableOpacity
            key={category}
            style={styles.tab}
            onPress={() => {}}
          >
            <Image
              source={{ uri: categoryIcons[category] }}
              style={styles.tabIcon}
            />
            <Text style={styles.tabText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.filterLabel}>Filter by Category</Text>
      <ScrollView style={styles.filterScroll}>
        {['Academics', 'Events', 'Sports', 'Job Opportunities', 'Health & Wellness', 'News'].map(category => (
          <TouchableOpacity
            key={category}
            style={styles.filterButton}
            onPress={() => {
              const filtered = data.filter(item => item.category && item.category.toLowerCase() === category.toLowerCase());
              setFilteredData(filtered);
            }}
          >
            <Text style={styles.filterButtonText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('StudentStaffHomeScreen')}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/home.png' }} style={styles.bottomIcon} />
        </TouchableOpacity>
        <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/search.png' }} style={styles.bottomIcon} />
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: colors.black,
    marginBottom: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.black,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: colors.black,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    paddingRight: 25,
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: colors.black,
  },
  categoryTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: width * 0.3,
    height: 60,
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: colors.yellow,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: colors.yellow,
    textAlign: 'center',
  },
  filterLabel: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: colors.red,
    marginBottom: 10,
  },
  filterScroll: {
    maxHeight: 200,
    marginBottom: 20,
  },
  filterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.red,
  },
  filterButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: colors.red,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  itemTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: colors.red,
  },
  itemType: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: colors.red,
  },
  itemCategory: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: colors.red,
    marginTop: 5,
  },
  itemContent: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: colors.black,
    marginTop: 5,
  },
  announcementImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  itemDate: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: colors.red,
    marginTop: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  bottomIcon: {
    width: 30,
    height: 30,
    tintColor: colors.red,
   },
}); 
