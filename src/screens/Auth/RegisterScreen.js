import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useUser } from '../../store/userContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await register(email, password);
      Alert.alert('Thành công', 'Đăng ký thành công, bạn đã được đăng nhập.');
    } catch (e) {
      Alert.alert('Lỗi đăng ký', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>

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

      <Button title="Tạo tài khoản" onPress={handleRegister} />

      <View style={{ height: 8 }} />
      <Button title="Đã có tài khoản? Đăng nhập" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4, marginBottom: 12 },
});
