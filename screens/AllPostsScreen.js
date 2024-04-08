// AllPostsScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const AllPostsScreen = () => {
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );


  // 获取所有帖子并按发布时间降序排序
  const fetchPosts = async () => {
    const storedPosts = await AsyncStorage.getItem('posts');
    let formattedPosts = storedPosts ? JSON.parse(storedPosts) : [];
    // 按日期降序排序帖子，确保最新的帖子显示在列表顶部
    formattedPosts = formattedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    setPosts(formattedPosts);
  };

  // 处理编辑按钮点击事件
  const handleEdit = (post) => {
    navigation.navigate('EditPostScreen', { post });
  };

  // 处理删除按钮点击事件
  const handleDelete = async (date) => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      { 
        text: "OK", 
        onPress: async () => {
          const filteredPosts = posts.filter(post => post.date !== date);
          await AsyncStorage.setItem('posts', JSON.stringify(filteredPosts));
          setPosts(filteredPosts);
        }
      }
    ]);
  };

  const renderPost = ({ item }) => {
    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <Text style={styles.timestamp}>{new Date(item.date).toLocaleString()}</Text>
          {item.postLocation && (
            <Text style={styles.locationText}>
              Location: {item.postLocation.latitude.toFixed(2)}, {item.postLocation.longitude.toFixed(2)}
            </Text>
          )}
        </View>
        <FlatList
          horizontal
          data={item.postImages}
          renderItem={({ item: uri }) => <Image source={{ uri }} style={styles.postImage} />}
          keyExtractor={(_, index) => String(index)}
          showsHorizontalScrollIndicator={false}
        />
        <Text style={styles.postText}>{item.postText}</Text>
        <View style={styles.postFooter}>
          <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.date)}>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => String(item.date)}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  postContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: 'grey',
  },
  locationText: {
    fontSize: 12,
    color: 'grey',
  },
  editButton: {
    backgroundColor: '#f9dede',
    padding: 5,
    marginRight: 5,
    borderRadius: 10,
    width: 60,
    alignItems: 'center', // 水平居中
    justifyContent: 'center', // 垂直居中
  },
  deleteButton: {
    backgroundColor: '#ffaecc',
    padding: 5,
    borderRadius: 10,
    width: 60,
    alignItems: 'center', // 水平居中
    justifyContent: 'center', // 垂直居中
  },
  postImage: {
    width: screenWidth - 20,
    height: screenWidth - 20,
    borderRadius: 10,
    marginVertical: 8,
  },
  postText: {
    fontSize: 16,
    color: 'black',
  },
});

export default AllPostsScreen;
