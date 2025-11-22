import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';


export default function FakeLoginScreen({ navigation }) {
  const { switchRole } = useAuth();

  const handleLogin = (role) => {
    switchRole(role);
    navigation.replace('MainApp'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select Role to Login</Text>
      <Button title="Login as Admin" onPress={() => handleLogin('admin')} />
      <Button title="Login as Faculty" onPress={() => handleLogin('faculty')} />
      <Button title="Login as Student" onPress={() => handleLogin('student')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, marginBottom: 20, fontWeight: '600' },
});
