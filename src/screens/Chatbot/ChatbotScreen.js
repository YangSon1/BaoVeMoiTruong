// src/screens/Chatbot/ChatbotScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import * as Speech from 'expo-speech';
import { getChatbotReply, getRandomEnvTip } from '../../services/chatbotService';
import { useUser } from '../../store/userContext';

export default function ChatbotScreen() {
  const { user } = useUser();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      from: 'bot',
      text: 'Chào bạn! Mình là chatbot môi trường. Hãy hỏi mình về phân loại rác, AQI, luật bảo vệ môi trường hoặc gõ "gợi ý" để nhận hành động xanh hôm nay nhé.',
      time: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [speakEnabled, setSpeakEnabled] = useState(false);

  const addMessage = (from, text) => {
  const msg = {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    from,
    text,
    time: new Date().toISOString(),
  };
  setMessages(prev => [msg, ...prev]); // thêm lên đầu để FlatList inverted

  // Nếu là bot và đã bật đọc giọng nói
  if (from === 'bot' && speakEnabled && text) {
    // Dừng giọng đọc cũ (nếu đang đọc)
    Speech.stop();

    Speech.speak(text, {
      language: 'vi-VN',   // ⭐ yêu cầu đọc tiếng Việt
      pitch: 1.0,          // độ cao giọng (1.0 là bình thường)
      rate: 1.0,           // tốc độ nói (0.8–1.0 là dễ nghe)
    });
  }
};

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    addMessage('user', trimmed);
    const reply = getChatbotReply(trimmed);
    addMessage('bot', reply);
    setInput('');
  };

  const handleTip = () => {
    const tip = getRandomEnvTip();
    addMessage('bot', `Gợi ý hành động xanh hôm nay: ${tip}`);
  };

  const renderItem = ({ item }) => {
    const isUser = item.from === 'user';
    return (
      <View
        style={[
          styles.msgContainer,
          isUser ? styles.msgUser : styles.msgBot,
        ]}
      >
        <Text style={styles.msgFrom}>{isUser ? (user?.email || 'Bạn') : 'Chatbot'}</Text>
        <Text style={styles.msgText}>{item.text}</Text>
        {/* Nếu muốn, có thể hiển thị thời gian nhỏ nhỏ */}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Chatbot môi trường</Text>

        <View style={styles.row}>
          <Text>Đọc câu trả lời bằng giọng nói</Text>
          <Switch value={speakEnabled} onValueChange={setSpeakEnabled} />
        </View>

        <Button title="Gợi ý hành động xanh hôm nay" onPress={handleTip} />

        <FlatList
          style={{ flex: 1, marginTop: 8 }}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          inverted // tin nhắn mới ở dưới cùng
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Nhập câu hỏi về môi trường, rác thải, luật..."
            value={input}
            onChangeText={setInput}
            multiline
          />
          <Button title="Gửi" onPress={handleSend} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  msgContainer: {
    marginVertical: 4,
    padding: 8,
    borderRadius: 8,
    maxWidth: '85%',
  },
  msgUser: {
    backgroundColor: '#e3f2fd',
    alignSelf: 'flex-end',
  },
  msgBot: {
    backgroundColor: '#e8f5e9',
    alignSelf: 'flex-start',
  },
  msgFrom: { fontSize: 11, color: '#555', marginBottom: 2 },
  msgText: { fontSize: 14 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
    maxHeight: 80,
  },
});
