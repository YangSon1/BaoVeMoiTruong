// src/screens/Community/PostDetailScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useUser } from '../../store/userContext';
import { addComment } from '../../services/communityService';

export default function PostDetailScreen({ route }) {
  const { post } = route.params;
  const { user } = useUser();

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments);

  const handleSendComment = async () => {
    if (!comment.trim()) return;
    const newComment = {
      user: user.email || 'Người dùng',
      text: comment,
    };
    const updated = await addComment(post.id, newComment);
    const updatedPost = updated.find(p => p.id === post.id);
    setComments(updatedPost.comments);
    setComment('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{post.author}</Text>
        <Text style={styles.area}>{post.area}</Text>
        <Text style={styles.content}>{post.content}</Text>

        {post.imageUri && (
          <Image source={{ uri: post.imageUri }} style={styles.image} />
        )}

        <Text style={styles.sub}>Bình luận</Text>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.commentBox}>
              <Text style={styles.commentUser}>{item.user}:</Text>
              <Text style={styles.commentText}>{item.text}</Text>
            </View>
          )}
        />

        <TextInput
          style={styles.input}
          placeholder="Viết bình luận..."
          value={comment}
          onChangeText={setComment}
        />
        <Button title="Gửi bình luận" onPress={handleSendComment} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 12, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold' },
  area: { color: '#666', marginBottom: 8 },
  content: { marginBottom: 8 },
  image: { width: '100%', height: 220, borderRadius: 8 },
  sub: { marginTop: 12, marginBottom: 6, fontWeight: 'bold' },
  commentBox: { flexDirection: 'row', marginBottom: 6 },
  commentUser: { fontWeight: 'bold', marginRight: 4 },
  commentText: {},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
});
