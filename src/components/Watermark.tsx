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
      <Text style={styles.text}>
        TH2 · {STUDENT.mssv} · {STUDENT.hoTen} · #{examStamp()}
      </Text>
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
    top: 6,
  },
  bottomContainer: {
    bottom: 6,
  },
  text: {
    color: COLORS.textLight,
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.85,
    textAlign: 'center',
  },
});
