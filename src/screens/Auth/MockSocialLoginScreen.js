import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useUser } from '../../store/userContext';

export default function MockSocialLoginScreen({ route, navigation }) {
  // Lấy tham số 'provider' (google hoặc facebook) từ màn hình trước truyền sang
  const { provider } = route.params; 
  const { loginWithGoogle, loginWithFacebook } = useUser();
  
  const isGoogle = provider === 'google';
  
  // State cho form
  const [email, setEmail] = useState(isGoogle ? 'google_user@gmail.com' : 'fb_user@facebook.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirmLogin = async () => {
    setLoading(true);
    try {
      // Gọi hàm đăng nhập tương ứng từ Context
      if (isGoogle) {
        await loginWithGoogle();
      } else {
        await loginWithFacebook();
      }
      // Đăng nhập xong thì Context sẽ tự update User, 
      // App sẽ tự chuyển về màn hình chính, hoặc ta có thể goBack() nếu cần thiết
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  // Màu sắc chủ đạo
  const themeColor = isGoogle ? '#DB4437' : '#4267B2';
  const providerName = isGoogle ? 'Google' : 'Facebook';

  return (
    <View style={styles.container}>
      {/* Header giả lập */}
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <Text style={styles.headerTitle}>Đăng nhập với {providerName}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.instruction}>
          Đây là màn hình giả lập của {providerName}. Vui lòng nhập thông tin để tiếp tục.
        </Text>

        <Text style={styles.label}>Email hoặc số điện thoại</Text>
        <TextInput 
          style={styles.input} 
          value={email} 
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput 
          style={styles.input} 
          value={password} 
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Nhập gì cũng được"
        />

        <View style={styles.spacer} />

        {loading ? (
          <ActivityIndicator size="large" color={themeColor} />
        ) : (
          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: themeColor }]} 
            onPress={handleConfirmLogin}
          >
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#666' }}>Hủy bỏ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingTop: 50, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20, marginTop: 20 },
  instruction: { marginBottom: 20, color: '#555', textAlign: 'center', fontStyle: 'italic' },
  label: { fontWeight: 'bold', marginTop: 10, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginTop: 5, fontSize: 16 },
  spacer: { height: 20 },
  loginButton: { padding: 15, borderRadius: 5, alignItems: 'center' },
  loginButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { marginTop: 15, alignItems: 'center', padding: 10 },
});