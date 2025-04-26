import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import colors from './Colors'; 

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
      <Image
        source={require('./assets/selection.png')}
        style={styles.image}
      />
      <Text style={styles.question}>Are you a:</Text>

      <TouchableOpacity
        style={[styles.selectionBox, styles.studentStaffBox]}
        onPress={() => handleSelection('student/staff')}
      >
        <Text style={styles.selectionText}>STUDENT/STAFF</Text>
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
  },
  image: {
    width: 201,
    height: 186,
    marginBottom: 20,
  },
  question: {
    fontSize: 25,
    color: colors.black, 
  },
  selectionBox: {
    width: 261,
    height: 44,
    borderRadius: 20,
    backgroundColor: colors.red, 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  selectionText: {
    fontSize: 24,
    color: colors.yellow, 
  },
});

export default SelectionScreen;