import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from '../screens/MapScreen'; // 确保你有这个屏幕组件
import AllPostsScreen from '../screens/AllPostsScreen'; // 你的全部帖子屏幕
import CreatePostScreen from '../screens/CreatePostScreen'; // 你的发布帖子屏幕
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'ios-list';

          if (route.name === 'MapScreen') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'AllPostsScreen') {
            iconName = focused ? 'albums' : 'albums-outline';
          } else if (route.name === 'CreatePostScreen') {
            iconName = focused ? 'create' : 'create-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarShowLabel: true, 
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="MapScreen" component={MapScreen} options={{ tabBarLabel: 'Map' }} />
      <Tab.Screen name="AllPostsScreen" component={AllPostsScreen} options={{ tabBarLabel: 'All Posts' }} />
      <Tab.Screen name="CreatePostScreen" component={CreatePostScreen} options={{ tabBarLabel: 'Create Post' }} />
    </Tab.Navigator>
  );
};

export default HomeScreen;
