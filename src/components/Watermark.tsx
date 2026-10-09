import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { STUDENT, VARIANT, examStamp } from '@constants/student';
import { COLORS } from '@constants/theme';

export default function Watermark() {
  const isTop = VARIANT.watermarkAtTop;

  return (
    <View
      pointerEvents="none"
      style={[styles.container, isTop ? styles.topContainer : styles.bottomContainer]}
    >
      <View style={styles.badge}>
        <Text style={styles.text}>
          TH2 · {STUDENT.mssv} · {STUDENT.hoTen} · #{examStamp()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
    paddingHorizontal: 8,
  },
  topContainer: {
    top: 8,
  },
  bottomContainer: {
    bottom: 8,
  },
  badge: {
    backgroundColor: '#DBEAFE', // Nền xanh nhạt
    borderWidth: 1,
    borderColor: '#93C5FD', // Viền xanh
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    color: '#1E3A8A', // Chữ xanh đậm rõ nét
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});
