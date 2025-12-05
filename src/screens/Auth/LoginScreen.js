import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useUser } from '../../store/userContext';

export default function LoginScreen({ navigation }) {
  const { login, loginAsGuest, requestResetPassword, loginWithGoogle, loginWithFacebook } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (e) {
      Alert.alert('Lỗi đăng nhập', e.message);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Thông báo', 'Vui lòng nhập email để đặt lại mật khẩu');
      return;
    }
    try {
      await requestResetPassword(email);
      Alert.alert('Thành công', 'Giả lập: liên kết đặt lại mật khẩu đã được gửi đến email.');
    } catch (e) {
      Alert.alert('Lỗi', e.message);
    }
  };

 const handleGoogleLogin = () => {
    navigation.navigate('MockSocialLogin', { provider: 'google' });
  };

  const handleFacebookLogin = () => {
    navigation.navigate('MockSocialLogin', { provider: 'facebook' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      <Text>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="nhapemail@example.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text>Mật khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Đăng nhập" onPress={handleLogin} />

      <Text style={styles.orText}>— Hoặc —</Text>
      
      <View style={styles.socialContainer}>
        {/* Nút Google */}
        <TouchableOpacity 
          style={[styles.socialButton, styles.googleButton]} 
          onPress={handleGoogleLogin}
        >
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>

        {/* Nút Facebook */}
        <TouchableOpacity 
          style={[styles.socialButton, styles.facebookButton]} 
          onPress={handleFacebookLogin}
        >
          <Text style={styles.socialText}>Facebook</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.spacer} />
      <Button title="Đăng nhập với tư cách khách" onPress={loginAsGuest} />

      <View style={styles.spacer} />
      <Button title="Quên mật khẩu" onPress={handleResetPassword} />

      <View style={styles.spacer} />
      <Button title="Chưa có tài khoản? Đăng ký" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4, marginBottom: 12 },
  spacer: { height: 8 },
  // Style cho phần Social Login
  orText: { textAlign: 'center', marginVertical: 12, color: '#888' },
  socialContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  socialButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  googleButton: { backgroundColor: '#DB4437' }, // Màu đỏ Google
  facebookButton: { backgroundColor: '#4267B2' }, // Màu xanh Facebook
  socialText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // Style cho link text
  linkButton: { alignItems: 'center', padding: 5 },
  linkText: { color: '#007AFF', textDecorationLine: 'underline' },
});
