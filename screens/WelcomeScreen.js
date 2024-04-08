import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>FoodExplorer</Text>
      <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('Home')}
      activeOpacity={0.7}>
        <LinearGradient
          colors={['#fbb1a2', '#ead8fd']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={styles.customButtonText}>Go to FoodExplorer</Text>
        </LinearGradient>
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
  logo: {
    width: 300, 
    height: 300, 
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  customButton: {
    width: 230, 
    height: 40,
    borderRadius: 25, 
    overflow: 'hidden', 
  },
  customButtonText: {
    color: '#666',
    fontSize: 18, 
    textAlign: 'center',
    fontWeight: 'bold',
  },
  gradient: {
    width: '100%',
    height: '100%', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 25,
  },
});

export default WelcomeScreen;
