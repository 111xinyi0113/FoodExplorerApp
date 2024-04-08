import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import EditPostScreen from '../screens/EditPostScreen';



const Stack = createNativeStackNavigator();

function AppNavigator() {
  useEffect(() => {
  
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EditPostScreen" component={EditPostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
