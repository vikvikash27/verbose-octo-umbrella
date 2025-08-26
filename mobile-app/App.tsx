import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { CustomerAuthProvider } from './src/contexts/CustomerAuthContext';
import { CartProvider } from './src/contexts/CartContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as ReactNative from 'react-native';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <CustomerAuthProvider>
          <CartProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </CartProvider>
        </CustomerAuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
});