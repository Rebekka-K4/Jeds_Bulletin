import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import colors from './Colors';
import { auth } from './firebaseConfig';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

export default function AdminScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      setError('');
      navigation.navigate('AdminHomeScreen');
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      setError('Invalid email or password');
      Alert.alert('Login Failed', `${error.code}: ${error.message}`);
    }
  };

  const handleBack = () => {
    navigation.navigate('Selection');
  };

  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hi admin...</Text>
      <Image
        source={require('./assets/admin.png')}
        style={styles.image}
      />
      <Text style={styles.detailsText}>Please enter your details:</Text>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="EMAIL"
          placeholderTextColor={colors.yellow}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={[styles.inputBox, { top: 434 + 45 + 20 }]}>
        <TextInput
          style={styles.input}
          placeholder="PASSWORD"
          placeholderTextColor={colors.yellow}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.buttonText}>BACK</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray,
  },
  welcomeText: {
    position: 'absolute',
    top: 70,
    left: 14,
    width: 264,
    height: 36,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular',
    color: colors.black,
  },
  image: {
   position: 'absolute',
    top: 100,
    left:'center',
    width: 194,
    height: 194,
    borderRadius: 97,
    alignSelf: 'center',
    borderWidth: 4,
    borderColor: colors.black,
    marginTop: 10,
    marginBottom: 20,
  },
  detailsText: {
    position: 'absolute',
    top: 350,
    left: 14,
    width: 306,
    height: 36,
    fontSize: 24,
    fontFamily: 'Poppins_400Regular',
    color: colors.black,
  },
  inputBox: {
    position: 'absolute',
    top: 434,
    left: 20,
    width: '95%',
    height: 45,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.red,
    backgroundColor: colors.lightRed,
    justifyContent: 'center',
  },
  input: {
    position: 'absolute',
    top: 338 - 334,
    left: 14,
    width: '95%',
    height: 35,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: colors.yellow,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.red,
    paddingHorizontal: 10,
  },
  errorText: {
    position: 'absolute',
    top: 499 + 45 + 20,
    left: 24,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: colors.red,
  },
  backButton: {
    position: 'absolute',
    top: 660,
    left: 100,
    width: 300,
    height: 36,
    borderRadius: 20,
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    position: 'absolute',
    top: 660,
    left: 1100,
    width: 300,
    height: 36,
    borderRadius: 20,
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: colors.yellow,
  },
});