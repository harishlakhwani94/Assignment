import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NewsFeed from '../../features/news/screens/NewsFeed';
import WeatherScreen from '../../features/weather/screens/WeatherScreen';
import ProfileScreen from '../../features/profile/screens/ProfileScreen';
import ProductList from '../../features/products/screens/ProductList';

const BottomTab = createBottomTabNavigator();

const TabNavigator = () => (
  <BottomTab.Navigator initialRouteName="News">
    <BottomTab.Screen
      name="News"
      component={NewsFeed}
      options={{ title: 'News' }}
    />
    <BottomTab.Screen
      name="Weather"
      component={WeatherScreen}
      options={{ title: 'Weather' }}
    />
    <BottomTab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
    <BottomTab.Screen
      name="Products"
      component={ProductList}
      options={{ title: 'Products' }}
    />
  </BottomTab.Navigator>
);

export default TabNavigator;
