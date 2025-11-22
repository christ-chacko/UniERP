import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import Toast from "react-native-toast-message";

export default function App() {
  return (
  <SafeAreaProvider>
    <AuthProvider>
     <AppNavigator />
      <Toast />
    </AuthProvider>
  </SafeAreaProvider>
  )
}
