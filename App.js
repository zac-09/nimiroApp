import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Splash } from './src/screens';

export default function App() {
  return (
    <Splash/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
