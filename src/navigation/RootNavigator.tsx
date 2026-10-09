import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from '@navigation/AuthStack';
import MainTabs from '@navigation/MainTabs';
import { useAuthStore } from '@stores/authStore';

export default function RootNavigator() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}