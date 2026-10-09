import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ShopStack from '@navigation/ShopStack';
import CartScreen from '@screens/CartScreen';
import MeScreen from '@screens/MeScreen';
import { COLORS } from '@constants/theme';
import { VARIANT } from '@constants/student';
import { useCartStore } from '@stores/cartStore';

export type MainTabParamList = {
  Shop: undefined;
  Cart: undefined;
  Me: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  const items = useCartStore((state) => state.items);
  const cartQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const isCartFirst = VARIANT.tabOrder === 'cartFirst';

  const shopTabScreen = (
    <Tab.Screen
      key="Shop"
      name="Shop"
      component={ShopStack}
      options={{
        title: 'Cửa hàng',
        tabBarLabel: 'Cửa hàng',
      }}
    />
  );

  const cartTabScreen = (
    <Tab.Screen
      key="Cart"
      name="Cart"
      component={CartScreen}
      options={{
        title: 'Giỏ hàng',
        tabBarLabel: 'Giỏ hàng',
        tabBarBadge: cartQuantity > 0 ? cartQuantity : undefined,
        tabBarBadgeStyle: {
          backgroundColor: COLORS.secondary,
          color: '#FFFFFF',
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    />
  );

  const meTabScreen = (
    <Tab.Screen
      key="Me"
      name="Me"
      component={MeScreen}
      options={{
        title: 'Cá nhân',
        tabBarLabel: 'Tôi',
      }}
    />
  );

  return (
    <Tab.Navigator
      initialRouteName={isCartFirst ? 'Cart' : 'Shop'}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      {isCartFirst
        ? [cartTabScreen, shopTabScreen, meTabScreen]
        : [shopTabScreen, cartTabScreen, meTabScreen]}
    </Tab.Navigator>
  );
}