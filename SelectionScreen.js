import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import colors from './colors';

const SelectionScreen = ({ navigation }) => {
  const handleSelection = (role) => {
    if (role === 'student/staff') {
      navigation.navigate('StudentStaff');
    } else if (role === 'admin') {
      navigation.navigate('Admin');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/selection.png')} style={styles.image} />

      <Text style={styles.title}>Are you a:</Text>
      <Text style={styles.subtitle}>Please choose your role to continue</Text>

      <TouchableOpacity
        style={[styles.selectionBox, styles.studentStaffBox]}
        onPress={() => handleSelection('student/staff')}
      >
        <Text style={styles.selectionText}>STUDENT / STAFF</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.selectionBox, styles.adminBox]}
        onPress={() => handleSelection('admin')}
      >
        <Text style={styles.selectionText}>ADMIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightRed,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 201,
    height: 186,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.black,
  },
  subtitle: {
    fontSize: 16,
    color: colors.black,
    marginTop: 5,
    marginBottom: 30,
  },
  selectionBox: {
    width: '100%',
    maxWidth: 300,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,

    // shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    // elevation for Android
    elevation: 5,
  },
  selectionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.yellow,
  },
});

export default SelectionScreen;
