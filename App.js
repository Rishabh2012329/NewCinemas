/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useEffect} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios'
import {TMDB} from '@env'
import {MovieProvider} from './src/context/movie'
import Bar from './src/components/Bar'
import theme from './theme'
import ShowMovies from './src/components/ShowMovies';
import { NativeRouter, Route} from "react-router-native";
import MovieScreen from './src/screens/MovieScreen'
import Home from './src/screens/Home'
import { NavigationContainer } from '@react-navigation/native';
import Torrent from './src/screens/Torrent';


const Stack = createNativeStackNavigator();

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: theme['dark'].backgroundColor,
    flex:1
  };
  const screenOptions={
    headerShown: false
  }
  return (
      <NavigationContainer>
        <MovieProvider>
            <StatusBar/>
            <SafeAreaView style={backgroundStyle}>
            <Stack.Navigator initialRouteName='Home' screenOptions={screenOptions} >
              <Stack.Screen  name="Home" component={Home} />
              <Stack.Screen name="Movie" component={MovieScreen} />
              <Stack.Screen name="Torrent" component={Torrent} />
            </Stack.Navigator >
            </SafeAreaView>
        </MovieProvider>
      </NavigationContainer>
    
  );
};

const styles = StyleSheet.create({
  
});

export default App;
