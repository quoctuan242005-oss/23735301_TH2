import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { COLORS } from '@constants/theme';
import { VARIANT } from '@constants/student';
import type { Product } from '@stores/cartStore';

interface ProductCardProps {
  product: Product;
  onPress: (id: number) => void;
  onAddToCart: (product: Product) => void;
}

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export default function ProductCard({
  product,
  onPress,
  onAddToCart,
}: ProductCardProps) {
  const handleAdd = () => {
    try {
      const hapticType =
        VARIANT.hapticOnAdd === 'impact' ? 'impactMedium' : 'selection';
      ReactNativeHapticFeedback.trigger(hapticType, hapticOptions);
    } catch {
      // ignore on environments without vibration support
    }
    onAddToCart(product);
  };

  const formattedPrice = `${product.price.toLocaleString('vi-VN')} đ`;

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress(product.id)}
        style={styles.cardContent}
      >
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {product.category}
        </Text>
        <Text style={styles.price}>{formattedPrice}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAdd}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+ Thêm vào giỏ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    padding: 10,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 120,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    minHeight: 36,
  },
  category: {
    marginTop: 4,
    fontSize: 11,
    color: COLORS.textLight,
  },
  price: {
    marginTop: 6,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '700',
  },
});
