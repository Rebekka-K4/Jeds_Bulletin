 import React from 'react';
 import { View, Text, StyleSheet , Image } from 'react-native';
 import colors from './colors'; 
 
 export default function SplashScreen(){
   return (
     <View style={styles.container}>
       <Image source={require('./assets/icon.png')} style={styles.image} />
       <Text style={styles.text}>Welcome to JED's Bulletin!</Text>
       <Text style={styles.subtext}>"Keeping you up to date"</Text>
     </View>
   );
 }
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: colors.red, 
   },
   image: {
     width: 200,
     height: 200,
     marginBottom: 20,
   },
   text: {
     fontSize: 30,
     fontWeight: 'bold',
     color: colors.yellow, 
   },
   subtext: {
    fontSize: 24,
    textAlign: 'flex-start',
    paddingLeft:0.5,
    paddingRight:10,
    marginLeft:0.1,
    color: colors.yellow, 
    },
 });
 
 