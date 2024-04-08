//MapScreen.js
import React, { useState, useEffect } from 'react';
import { Platform, Button, View, StyleSheet, Dimensions, Text, ActivityIndicator, Image, Linking, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import restaurantsData from '../assets/data/restaurants.json'; 

const getImage = (imageName) => {
  switch (imageName) {
    case 'tasty.jpg': return require('../assets/image/Tasty.jpg');
    case 'Kwang Tung.png': return require('../assets/image/Kwang Tung.png');
    case 'Jam.jpg': return require('../assets/image/Jam.jpg');
    case 'The Last Post.jpg': return require('../assets/image/The Last Post.jpg');
    case 'Pepes.jpg': return require('../assets/image/Pepes.jpg');
    case 'Greggs.jpg': return require('../assets/image/Greggs.jpg');
  }
};

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(null);
  const [places, setPlaces] = useState([]); 
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleMarkerPress = (place) => {
    // 用户点击餐馆时，设置选中的餐馆
    setSelectedPlace(place);
  };

  const handleStartNavigation = () => {
    // 当用户点击“开始导航”按钮时执行
    const { latitude, longitude } = selectedPlace;
    const url = Platform.select({
      ios: `comgooglemaps://?q=${latitude},${longitude}`,
    });
    Linking.openURL(url).catch((err) => {
      console.error('An error occurred', err);
      Alert.alert('Error', 'Could not open the maps app.');
    });
  };

  //电话
  const handlePlaceCall = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };




  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let locationResult = await Location.getCurrentPositionAsync({});
      setLocation(locationResult.coords);

      setRegion({
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // 直接设置places为导入的餐馆数据
      setPlaces(restaurantsData);
    })(); 
  }, []);

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!region) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        <Marker coordinate={region} title="Your Location" />
        {places.map(place => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            title={place.name}
            onPress={() => handleMarkerPress(place)} 
          >
            <Image source={getImage(place.image.split('/').pop())} style={styles.markerImage} />
            <Callout tooltip>
              <View style={styles.calloutView}>
                <Text style={styles.calloutTitle}>{place.name}</Text>
                <Text>{place.description}</Text>
                <Image source={getImage(place.image.split('/').pop())} style={styles.calloutImage} />
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      {selectedPlace && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleStartNavigation()}>
            <Text style={styles.buttonText}>Start Navigation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handlePlaceCall(selectedPlace.tel)}>
            <Text style={styles.buttonText}>Call {selectedPlace.name}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  calloutView: {
    width: 140, // 设置信息窗口的宽度
    height: 200, // 设置信息窗口的高度
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 5
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  markerImage: {
    width: 50, // 标记图片的宽度
    height: 50, // 标记图片的高度
  },
  calloutImage: {
    width: '100%', // 信息窗口图片的宽度
    height: 100, // 信息窗口图片的高度
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f9dede',
    padding: 9,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MapScreen;
