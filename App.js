import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SelectionScreen from './SelectionScreen';
import StudentStaffScreen from './StudentStaffScreen';
import StudentStaffHomeScreen from './StudentStaffHomeScreen';
import StudentStaffSearchScreen from './StudentStaffSearchScreen';
import StudentStaffIconScreen from './StudentStaffIconScreen';
import StudentStaffCalendarScreen from './StudentStaffCalendarScreen';
import AdminScreen from './AdminScreen';
import AdminHomeScreen from './AdminHomeScreen';
import AdminAnnouncementScreen from './AdminAnnouncementScreen';
import AdminIconScreen from './AdminIconScreen';
import AdminCalendarScreen from './AdminCalendarScreen';
import SplashScreen from './SplashScreen';

const Stack = createStackNavigator();

export default function App() {
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSplashVisible(false);
    }, 4000);
  }, []);

  if (splashVisible) {
    return <SplashScreen />;
  }

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Selection">
          <Stack.Screen name="Selection" component={SelectionScreen} options={{ headerShown: false }} />
          <Stack.Screen name="StudentStaff" component={StudentStaffScreen} options={{ headerShown: false }} />
          <Stack.Screen name="StudentStaffHomeScreen" component={StudentStaffHomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Search" component={StudentStaffSearchScreen} options={{ headerShown: false }} />
          <Stack.Screen name="StudentStaffIcon" component={StudentStaffIconScreen} options={{ headerShown: false }} />
          <Stack.Screen name="StudentStaffCalendar" component={StudentStaffCalendarScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Admin" component={AdminScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AdminHomeScreen" component={AdminHomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AdminAnnouncements" component={AdminAnnouncementScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AdminIcon" component={AdminIconScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AdminCalendar" component={AdminCalendarScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});