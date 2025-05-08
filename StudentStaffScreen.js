// Imports same as AdminLoginPage.js
import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import colors from './colors';

const UserLoginPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>9:34</Text>
      <Image source={require('./icons/network.png')} style={styles.networkIcon} />
      <Image source={require('./icons/wifi.png')} style={styles.wifiIcon} />
      <Image source={require('./icons/battery.png')} style={styles.batteryIcon} />

      <Text style={styles.heading}>Hi User</Text>

      <Image source={require('./assets/userIcon.png')} style={styles.mainIcon} />

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

export default UserLoginPage;

// You can reuse the exact same styles object from AdminLoginPage.js
