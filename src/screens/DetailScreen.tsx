import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { getProductById } from '@services/productApi';
import { useCartStore } from '@stores/cartStore';
import { COLORS } from '@constants/theme';
import { STUDENT, VARIANT } from '@constants/student';
import Watermark from '@components/Watermark';
import type { ShopStackParamList } from '@navigation/ShopStack';

type DetailRouteProp = RouteProp<ShopStackParamList, 'Detail'>;

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export default function DetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation();

  const idParam = route.params?.id;
  const productId = Number(idParam);

  const addItem = useCartStore((state) => state.addItem);

  const {
    data: product,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId),
    enabled: Number.isInteger(productId) && productId > 0,
  });

  const handleAddToCart = () => {
    if (!product) return;

    try {
      const hapticType =
        VARIANT.hapticOnAdd === 'impact' ? 'impactMedium' : 'selection';
      ReactNativeHapticFeedback.trigger(hapticType, hapticOptions);
    } catch {
      // ignore
    }

    addItem(product);
    Alert.alert(
      'KTXGo',
      `Đã thêm ${product.title.slice(0, 20)}... vào giỏ! (${STUDENT.mssv})`,
    );
  };

  if (!Number.isInteger(productId) || productId <= 0) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>ID món không hợp lệ.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
        <Watermark />
      </SafeAreaView>
    );
  }

  if (isPending) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.statusMessage}>Đang tải chi tiết món...</Text>
        <Watermark />
      </SafeAreaView>
    );
  }

  if (isError || !product) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Không thể tải chi tiết món ({STUDENT.mssv})
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            void refetch();
          }}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
        <Watermark />
      </SafeAreaView>
    );
  }

  const formattedPrice = `${product.price.toLocaleString('vi-VN')} đ`;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.category}>{product.category.toUpperCase()}</Text>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>{formattedPrice}</Text>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
            <Text style={styles.description}>{product.description}</Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToCart}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>+ Thêm vào giỏ hàng</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backLink}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backLinkText}>← Tiếp tục mua sắm</Text>
            </TouchableOpacity>
          </View>
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
  imageContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 220,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textLight,
    letterSpacing: 1,
  },
  title: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 24,
  },
  price: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textLight,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.surface,
    fontSize: 15,
    fontWeight: '700',
  },
  backLink: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  backLinkText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  statusMessage: {
    marginTop: 10,
    color: COLORS.textLight,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.error,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.surface,
    fontWeight: '700',
  },
  backButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButtonText: {
    color: COLORS.textLight,
    fontWeight: '600',
  },
});