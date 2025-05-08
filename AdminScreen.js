import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import colors from './colors';

const AdminLoginPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>9:34</Text>
      <Image source={require('./icons/network.png')} style={styles.networkIcon} />
      <Image source={require('./icons/wifi.png')} style={styles.wifiIcon} />
      <Image source={require('./icons/battery.png')} style={styles.batteryIcon} />

      <Text style={styles.heading}>Hi Admin</Text>

      <Image source={require('./assets/adminIcon.png')} style={styles.mainIcon} />

      <Text style={styles.prompt}>Please enter your details :</Text>

      <View style={styles.inputWrapper}>
        <TextInput style={styles.input} placeholder="USERNAME" placeholderTextColor={colors.placeholder} />
      </View>

      <View style={[styles.inputWrapper, { marginTop: 8 }]}>
        <TextInput style={styles.input} placeholder="PASSWORD" placeholderTextColor={colors.placeholder} secureTextEntry />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdminLoginPage;

const styles = StyleSheet.create({
  container: {
    width: 404,
    height: 917,
    borderRadius: 30,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
  },
  time: {
    fontSize: 24,
    position: 'absolute',
    top: 24,
    left: 15,
    color: colors.text,
  },
  networkIcon: {
    width: 22.55,
    height: 21,
    position: 'absolute',
    top: 24,
    left: 262.8,
  },
  wifiIcon: {
    width: 24.51,
    height: 22,
    position: 'absolute',
    top: 24,
    left: 301.04,
  },
  batteryIcon: {
    width: 24.51,
    height: 12.5,
    position: 'absolute',
    top: 29,
    left: 343.2,
  },
  heading: {
    position: 'absolute',
    top: 129,
    left: 21,
    fontSize: 24,
    fontFamily: 'Poppins',
    color: colors.text,
    textAlign: 'left',
  },
  mainIcon: {
    width: 194,
    height: 182,
    position: 'absolute',
    top: 173,
    left: 95,
  },
  prompt: {
    position: 'absolute',
    top: 381,
    left: 11,
    width: 306,
    height: 36,
    fontSize: 24,
    fontFamily: 'Poppins',
    color: colors.text,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 20,
    backgroundColor: colors.inputFill,
    paddingHorizontal: 10,
    height: 42,
    justifyContent: 'center',
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  input: {
    fontSize: 14,
    color: colors.placeholder,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 10,
    width: '100%',
    paddingHorizontal: 24,
  },
  button: {
    width: 129,
    height: 36,
    backgroundColor: colors.buttonBackground,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins',
    fontSize: 24,
    color: colors.buttonText,
  },
});