import React from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/authStore';
import { useCampusLocation } from '@hooks/useCampusLocation';
import { COLORS } from '@constants/theme';
import {
  BASE_SHIP_FEE,
  ROOM_LABEL,
  STUDENT,
  VARIANT,
  examStamp,
} from '@constants/student';
import Watermark from '@components/Watermark';

export default function MeScreen() {
  const token = useAuthStore((state) => state.token);
  const identifier = useAuthStore((state) => state.identifier);
  const logout = useAuthStore((state) => state.logout);

  const {
    status,
    loading,
    distanceKm,
    shippingFee,
    errorMessage,
    requestCampusLocation,
    openSettings,
  } = useCampusLocation();

  const stamp = examStamp();
  const truncatedToken = token
    ? `${token.slice(0, 14)}...${token.slice(-6)}`
    : 'N/A';

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      `Bạn có chắc chắn muốn đăng xuất khỏi KTXGo? (${STUDENT.mssv})`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đăng xuất', style: 'destructive', onPress: logout },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.pageTitle}>Tài khoản sinh viên</Text>

          {/* Student Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {STUDENT.hoTen.charAt(0)}
              </Text>
            </View>
            <Text style={styles.studentName}>{STUDENT.hoTen}</Text>
            <Text style={styles.studentMssv}>MSSV: {STUDENT.mssv}</Text>
            <Text style={styles.studentStamp}>Mã Stamp: #{stamp}</Text>
            <Text style={styles.studentRoom}>Phòng nhận hàng: {ROOM_LABEL}</Text>

            <View style={styles.tokenBox}>
              <Text style={styles.tokenLabel}>Token phiên:</Text>
              <Text style={styles.tokenValue}>{truncatedToken}</Text>
              {identifier ? (
                <Text style={styles.identifierValue}>({identifier})</Text>
              ) : null}
            </View>
          </View>

          {/* Location & Shipping Estimation Card */}
          <Text style={styles.sectionHeader}>Ước tính phí ship GPS</Text>
          <View style={styles.locationCard}>
            <Text style={styles.locationIntro}>
              Định vị GPS để tính khoảng cách đến cổng KTX & áp dụng công thức giao
              hàng (Công thức {VARIANT.shipFormula}, phí nền {BASE_SHIP_FEE.toLocaleString('vi-VN')} đ).
            </Text>

            {loading ? (
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={styles.loader}
              />
            ) : (
              <TouchableOpacity
                style={styles.locationButton}
                onPress={requestCampusLocation}
                activeOpacity={0.8}
              >
                <Text style={styles.locationButtonText}>
                  {distanceKm !== null
                    ? 'Cập nhật lại vị trí GPS'
                    : 'Lấy vị trí ước tính ship'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Permission feedback */}
            {status === 'denied' && (
              <View style={styles.alertBox}>
                <Text style={styles.deniedText}>
                  {errorMessage ||
                    'Quyền vị trí bị từ chối. Vui lòng nhấn nút trên để xin lại quyền.'}
                </Text>
              </View>
            )}

            {status === 'blocked' && (
              <View style={styles.alertBox}>
                <Text style={styles.blockedText}>
                  {errorMessage ||
                    'Quyền vị trí đã bị khóa trong hệ thống. Vui lòng mở cài đặt ứng dụng để cấp quyền.'}
                </Text>
                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={openSettings}
                  activeOpacity={0.8}
                >
                  <Text style={styles.settingsButtonText}>Mở Cài đặt</Text>
                </TouchableOpacity>
              </View>
            )}

            {distanceKm !== null && shippingFee !== null && (
              <View style={styles.resultBox}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Khoảng cách đến KTX:</Text>
                  <Text style={styles.resultValueKm}>
                    {distanceKm.toFixed(2)} km
                  </Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>
                    Phí ship (CT {VARIANT.shipFormula}):
                  </Text>
                  <Text style={styles.resultValueFee}>
                    {shippingFee.toLocaleString('vi-VN')} đ
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </ScrollView>

        <Watermark />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 60,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 14,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: COLORS.surface,
    fontSize: 26,
    fontWeight: '800',
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  studentMssv: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  studentStamp: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: 2,
  },
  studentRoom: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 4,
  },
  tokenBox: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  tokenLabel: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  tokenValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  identifierValue: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 4,
  },
  locationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  locationIntro: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  locationButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  locationButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  loader: {
    marginVertical: 12,
  },
  alertBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deniedText: {
    color: COLORS.error,
    fontSize: 12,
    lineHeight: 17,
  },
  blockedText: {
    color: COLORS.error,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  settingsButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: COLORS.surface,
    fontSize: 13,
    fontWeight: '700',
  },
  resultBox: {
    marginTop: 14,
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  resultLabel: {
    fontSize: 13,
    color: COLORS.text,
  },
  resultValueKm: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  resultValueFee: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: COLORS.error,
    fontSize: 15,
    fontWeight: '700',
  },
});
