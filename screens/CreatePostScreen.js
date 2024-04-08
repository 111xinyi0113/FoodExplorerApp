// CreatePostScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';




const CreatePostScreen = () => {
  const navigation = useNavigation();

  // 直接初始化状态，不依赖于任何外部参数
  const [postText, setPostText] = useState('');
  const [postImages, setPostImages] = useState([]);
  const [postLocation, setPostLocation] = useState(null);



  //位置权限
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant location access');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setPostLocation(location.coords);
  };


  //相机权限
  const takePhoto = async () => {
    const cameraPermissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPermissionResult.granted) {
      Alert.alert('Permission required', 'Please grant camera access');
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.cancelled && result.assets) {
      setPostImages([...postImages, result.assets[0].uri]);
    }
  };
  



  //图库权限
  const pickImage = async () => {
    const libraryPermissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!libraryPermissionResult.granted) {
      Alert.alert('Permission required', 'Please grant photo library access');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
  
    if (!result.cancelled && result.assets) {
      setPostImages([...postImages, result.assets[0].uri]);
    }
  };


  // 在图片预览上添加删除按钮的函数
  const removeImage = (index) => {
    setPostImages(prevImages => prevImages.filter((_, i) => i !== index));
  };



  const submitPost = async () => {
    const newPost = {
      postText,
      postImages,
      postLocation,
      date: new Date().toISOString(),
    };
    try {
      const existingPosts = JSON.parse(await AsyncStorage.getItem('posts')) || [];
      const updatedPosts = [...existingPosts, newPost];
      await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
      // 重置状态
      setPostText('');
      setPostImages([]);
      setPostLocation(null);
      // 导航回 AllPostsScreen
      navigation.navigate('AllPostsScreen');
    } catch (e) {
      Alert.alert('Error', 'Failed to save the post');
    }
  };
  



  



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setPostText}
        value={postText}
        placeholder="What's on your mind?"
        multiline
      />
      <View style={styles.imagePreviewContainer}>
        {postImages.map((imageUri, index) => (
          <View key={String(index)} style={styles.imageWrapper}>
            <Image
              source={{ uri: imageUri }}
              style={styles.imagePreview}
            />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeImage(index)}
            >
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={takePhoto} style={styles.button}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={getLocation} style={styles.button}>
        <Text style={styles.buttonText}>Use My Location</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitButton} onPress={submitPost}>
        <Text style={styles.submitButtonText}>Submit Post</Text>
      </TouchableOpacity>

      {postLocation && (
        <Text>
          Location: {postLocation.latitude}, {postLocation.longitude}
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    minHeight: 100,
    textAlignVertical: 'top'
  },
  imageContainer: {
    flexDirection: 'row',
    marginBottom: 10
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // 添加这个属性以居中图片
    alignItems: 'center', // 确保图片在容器内居中
    marginBottom: 10,
  },
  imagePreview: {
    width: 100, // 可以根据您的需求调整
    height: 100, // 可以根据您的需求调整
    marginRight: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  deleteButton: {
    position: 'absolute',
    right: 10,
    top: 0,
    backgroundColor: '#666',
    borderRadius: 10,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#e8c6bf', // 更改为您希望的颜色
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20, // 圆角边框
    marginBottom: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)', 
    shadowOffset: { width: 0, height: 2 }, // 阴影偏移
    shadowOpacity: 1, // 阴影不透明度
    shadowRadius: 4, // 阴影半径
  },
  buttonText: {
    color: '#666', // 文本颜色
    fontSize: 16, // 字体大小
    fontWeight: 'bold', // 字体加粗
  },



  submitButton: {
    alignItems: 'center',
    backgroundColor: '#e8b7bf', // 按钮的背景颜色
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20, // 圆角
    marginBottom: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)', // 阴影颜色
    shadowOffset: { width: 0, height: 4 }, // 阴影偏移
    shadowOpacity: 1, // 阴影不透明度
    shadowRadius: 5, // 阴影半径
  },
  submitButtonText: {
    color: 'white', // 文本颜色
    fontSize: 18, // 字体大小
    fontWeight: 'bold', // 字体加粗
  }
});

export default CreatePostScreen;
