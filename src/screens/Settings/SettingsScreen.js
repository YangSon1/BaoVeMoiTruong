import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Button, Alert, StyleSheet } from 'react-native';
import { useUser } from '../../store/userContext';

export default function SettingsScreen() {
  const { user, profile, setAllowLocation, removeAccount } = useUser();
  const [allowLocation, setAllowLocationLocal] = useState(false);

  useEffect(() => {
    if (profile && typeof profile.allowLocation === 'boolean') {
      setAllowLocationLocal(profile.allowLocation);
    }
  }, [profile]);

  const toggleLocation = async (value) => {
    setAllowLocationLocal(value);
    await setAllowLocation(value);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Xóa tài khoản',
      'Bạn có chắc muốn xóa tài khoản và toàn bộ dữ liệu?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await removeAccount();
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Chưa đăng nhập.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quyền riêng tư & bảo mật</Text>

      <View style={styles.row}>
        <Text>Cho phép sử dụng vị trí GPS</Text>
        <Switch value={allowLocation} onValueChange={toggleLocation} />
      </View>

      <Text style={styles.note}>
        Ứng dụng sẽ không chia sẻ vị trí hoặc dữ liệu cá nhân khi bạn chưa bật cho phép.
      </Text>

      <View style={{ height: 24 }} />
      <Button title="Xóa tài khoản & dữ liệu" color="red" onPress={handleDeleteAccount} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  note: { fontSize: 12, color: '#555', marginTop: 4 },
});
