import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useUser } from '../../store/userContext';

export default function LoginScreen({ navigation }) {
  const { login, loginAsGuest, requestResetPassword } = useUser();
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
});
