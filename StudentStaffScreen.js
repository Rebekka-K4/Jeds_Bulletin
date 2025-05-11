import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import colors from './colors';

const UserLoginPage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: add authentication logic here
    navigation.navigate('UserHome');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hi User</Text>
      <Text style={styles.prompt}>Please enter your details:</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="USERNAME"
          placeholderTextColor={colors.gray}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={[styles.inputWrapper, { marginTop: 8 }]}>  
        <TextInput
          style={styles.input}
          placeholder="PASSWORD"
          placeholderTextColor={colors.gray}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 10,
  },
  prompt: {
    fontSize: 16,
    color: colors.black,
    marginBottom: 20,
  },
  inputWrapper: {
    width: '100%',
    backgroundColor: colors.lightRed,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    color: colors.black,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    flex: 1,
    backgroundColor: colors.red,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserLoginPage;
