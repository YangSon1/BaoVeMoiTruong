// src/services/communityService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const POSTS_KEY = 'ENV_APP_POSTS';

// Lấy danh sách bài
export async function getAllPosts() {
  const json = await AsyncStorage.getItem(POSTS_KEY);
  return json ? JSON.parse(json) : [];
}

// Lưu danh sách
async function saveAllPosts(posts) {
  await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

// Tạo bài đăng mới
export async function createPost(data) {
  const posts = await getAllPosts();
  const newPost = {
    id: Date.now().toString(),
    userId: data.userId,
    author: data.author,
    area: data.area,
    content: data.content,
    imageUri: data.imageUri || null,
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: [],
  };
  posts.unshift(newPost);
  await saveAllPosts(posts);
  return newPost;
}

// Like bài viết
export async function likePost(id) {
  const posts = await getAllPosts();
  const i = posts.findIndex(p => p.id === id);
  if (i !== -1) {
    posts[i].likes++;
    await saveAllPosts(posts);
  }
  return posts;
}

// Bình luận bài viết
export async function addComment(postId, comment) {
  const posts = await getAllPosts();
  const i = posts.findIndex(p => p.id === postId);
  if (i !== -1) {
    posts[i].comments.push({
      id: Date.now().toString(),
      user: comment.user,
      text: comment.text,
      time: new Date().toISOString(),
    });
    await saveAllPosts(posts);
  }
  return posts;
}
