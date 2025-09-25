import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../../auth/hooks/useAuth';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { authenticated, logout, checkAuth } = useAuth();
  const openLogin = useCallback(() => {
    navigation.navigate('Login' as never);
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      checkAuth();
    }, [checkAuth]),
  );

  if (authenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome</Text>
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
      <TouchableOpacity style={styles.button} onPress={openLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#000',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
