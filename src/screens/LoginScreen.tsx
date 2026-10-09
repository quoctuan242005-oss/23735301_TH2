import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@constants/theme';
import { STUDENT, VARIANT } from '@constants/student';
import { useAuthStore } from '@stores/authStore';
import Watermark from '@components/Watermark';

export default function LoginScreen() {
  const isEmail = VARIANT.authField === 'email';
  const [inputValue, setInputValue] = useState('');
  const login = useAuthStore((state) => state.login);

  const placeholderText = isEmail
    ? `Nhập email (${STUDENT.mssv}@sv.iuh.edu.vn)`
    : `Nhập số điện thoại (${STUDENT.mssv})`;

  const handleLogin = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      Alert.alert(
        'Thông báo',
        isEmail
          ? 'Vui lòng nhập địa chỉ email của bạn.'
          : 'Vui lòng nhập số điện thoại của bạn.',
      );
      return;
    }

    if (isEmail) {
      if (!trimmed.includes('@') || !trimmed.includes('.')) {
        Alert.alert('Thông báo', 'Địa chỉ email không đúng định dạng.');
        return;
      }
    } else {
      if (!/^[0-9]{8,12}$/.test(trimmed)) {
        Alert.alert('Thông báo', 'Số điện thoại phải gồm 8 - 12 chữ số.');
        return;
      }
    }

    login(trimmed);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>KTXGO</Text>
              <Text style={styles.tagline}>Giao đồ ăn & tiện ích tận phòng KTX</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>Đăng nhập</Text>
              <Text style={styles.subtitle}>
                Nhập {isEmail ? 'email' : 'số điện thoại'} sinh viên để tiếp tục.
              </Text>

              <Text style={styles.label}>
                {isEmail ? 'Email sinh viên' : 'Số điện thoại'}
              </Text>

              <TextInput
                style={styles.input}
                placeholder={placeholderText}
                placeholderTextColor={COLORS.textLight}
                keyboardType={isEmail ? 'email-address' : 'phone-pad'}
                autoCapitalize="none"
                autoCorrect={false}
                value={inputValue}
                onChangeText={setInputValue}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Vào cửa hàng</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Watermark />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboard: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    position: 'relative',
  },
  content: {
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    fontSize: 38,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  tagline: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.textLight,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 13,
    color: COLORS.textLight,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
    color: COLORS.text,
    fontSize: 15,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 16,
  },
});