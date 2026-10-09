import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useCartStore, type CartItem } from '@stores/cartStore';
import { COLORS } from '@constants/theme';
import { ROOM_LABEL, STUDENT } from '@constants/student';
import Watermark from '@components/Watermark';

export default function CartScreen() {
  const items = useCartStore((state) => state.items);
  const changeQty = useCartStore((state) => state.changeQty);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const shipFee = useCartStore((state) => state.shipFee);
  const distanceKm = useCartStore((state) => state.distanceKm);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const grandTotal = totalAmount + (shipFee || 0);

  const handleClearCart = () => {
    Alert.alert(
      'Xác nhận',
      `Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng? (${STUDENT.mssv})`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa hết', style: 'destructive', onPress: clearCart },
      ],
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemCard}>
      <Image
        source={{ uri: item.product.image }}
        style={styles.itemImage}
        resizeMode="contain"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.product.title}
        </Text>
        <Text style={styles.itemPrice}>
          {item.product.price.toLocaleString('vi-VN')} đ
        </Text>

        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => changeQty(item.product.id, -1)}
            activeOpacity={0.7}
          >
            <Text style={styles.qtyButtonText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.qtyText}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => changeQty(item.product.id, 1)}
            activeOpacity={0.7}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeItem(item.product.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.removeButtonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Giỏ hàng KTXGo</Text>
          <Text style={styles.headerSubtitle}>
            {totalQuantity} món đang chọn
          </Text>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Giỏ hàng của bạn đang trống</Text>
            <Text style={styles.emptyText}>
              Hãy chọn những món ăn, thức uống yêu thích từ Cửa hàng!
            </Text>
          </View>
        ) : (
          <View style={styles.mainContent}>
            <FlashList
              data={items}
              renderItem={renderCartItem}
              keyExtractor={(item) => `cart-${STUDENT.mssv}-${item.product.id}`}
              estimatedItemSize={110}
              contentContainerStyle={styles.listContent}
            />

            {/* Summary Box */}
            <View style={styles.summaryCard}>
              <View style={styles.deliveryRow}>
                <Text style={styles.deliveryLabel}>Địa điểm giao:</Text>
                <Text style={styles.deliveryValue}>Giao đến {ROOM_LABEL}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tiền hàng:</Text>
                <Text style={styles.summaryValue}>
                  {totalAmount.toLocaleString('vi-VN')} đ
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
                {shipFee !== null ? (
                  <Text style={styles.shipFeeValue}>
                    +{shipFee.toLocaleString('vi-VN')} đ
                    {distanceKm !== null
                      ? ` (${distanceKm.toFixed(1)}km)`
                      : ''}
                  </Text>
                ) : (
                  <Text style={styles.unestimatedShipFee}>
                    Chưa ước tính phí — mở tab Tôi
                  </Text>
                )}
              </View>

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
                <Text style={styles.totalValue}>
                  {grandTotal.toLocaleString('vi-VN')} đ
                </Text>
              </View>

              <TouchableOpacity
                style={styles.clearCartButton}
                onPress={handleClearCart}
                activeOpacity={0.8}
              >
                <Text style={styles.clearCartButtonText}>Xóa toàn bộ giỏ</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
    paddingHorizontal: 14,
  },
  header: {
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  mainContent: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  qtyText: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  removeButton: {
    marginLeft: 'auto',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.error,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 36,
  },
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  deliveryLabel: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  deliveryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  shipFeeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  unestimatedShipFee: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  clearCartButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearCartButtonText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});
