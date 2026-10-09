import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useProductsQuery } from '@services/productApi';
import { useCartStore, type Product } from '@stores/cartStore';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { COLORS } from '@constants/theme';
import { ROOM_LABEL, STUDENT } from '@constants/student';
import ProductCard from '@components/ProductCard';
import Watermark from '@components/Watermark';
import type { ShopStackParamList } from '@navigation/ShopStack';

type NavigationProp = NativeStackNavigationProp<ShopStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText);

  const addItem = useCartStore((state) => state.addItem);

  const {
    data: products = [],
    isPending,
    isError,
    refetch,
    isRefetching,
  } = useProductsQuery();

  const filteredProducts = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return products;
    return products.filter((p) => p.title.toLowerCase().includes(query));
  }, [products, debouncedSearch]);

  const handlePressProduct = (id: number) => {
    navigation.navigate('Detail', { id });
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  if (isPending) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.statusMessage}>Đang tải danh sách món...</Text>
        <Watermark />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Lỗi tải dữ liệu ({STUDENT.mssv})</Text>
        <Text style={styles.statusMessage}>
          Không thể kết nối đến máy chủ. Vui lòng thử lại.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => refetch()}
          activeOpacity={0.8}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
        <Watermark />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header (A) Header KTXGO + chữ Giao tận {ROOM_LABEL} */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLogo}>KTXGO</Text>
            <Text style={styles.roomBadge}>Giao tận {ROOM_LABEL}</Text>
          </View>
        </View>

        {/* Search box (B) */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm món ăn, đồ uống, nhu yếu phẩm..."
            placeholderTextColor={COLORS.textLight}
            value={searchText}
            onChangeText={setSearchText}
            clearButtonMode="while-editing"
            autoCorrect={false}
          />
        </View>

        {/* Section title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Danh mục món</Text>
          <Text style={styles.itemCount}>
            {filteredProducts.length} mặt hàng
          </Text>
        </View>

        {/* FlashList 2 columns (C) */}
        <FlashList
          data={filteredProducts}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={handlePressProduct}
              onAddToCart={handleAddToCart}
            />
          )}
          keyExtractor={(item) => `${STUDENT.mssv}-${item.id}`}
          numColumns={2}
          estimatedItemSize={240}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                void refetch();
              }}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Không tìm thấy món phù hợp</Text>
              <Text style={styles.emptySubtitle}>
                Thử tìm với tên món hoặc từ khóa khác
              </Text>
            </View>
          }
        />

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
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerLogo: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  roomBadge: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: 2,
  },
  searchContainer: {
    marginTop: 6,
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  itemCount: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  listContent: {
    paddingBottom: 40,
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
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.error,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 18,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.textLight,
  },
});