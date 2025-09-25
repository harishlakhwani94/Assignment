import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import TabNavigator from '../navigation/TabNavigator';
import LoginScreen from '../../features/auth/screens/LoginScreen';

const Stack = createStackNavigator();

const AppContainer = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppContainer;
