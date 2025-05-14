// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './SplashScreen';
import SelectionScreen from './SelectionScreen';
import StudentStaffScreen from './StudentStaffScreen';
import AdminScreen from './AdminScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isShowSplash) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Selection" component={SelectionScreen} />
        <Stack.Screen name="StudentStaff" component={StudentStaffScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
