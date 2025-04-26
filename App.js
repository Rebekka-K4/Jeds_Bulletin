import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View} from 'react-native';
import SplashScreen from './SplashScreen';
import SelectionScreen from './SelectionScreen';

export default function App() {
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsShowSplash(false);
    }, 3000);
  });
  return <>{isShowSplash ? <SplashScreen /> : <SelectionScreen />}</>;   
}