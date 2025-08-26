import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, StatusBar } from 'react-native';
import * as ReactNative from 'react-native';

import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import { useCart } from '../contexts/CartContext';
import { COLORS, SIZES } from '../styles';

// Import Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';
import AccountScreen from '../screens/AccountScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import TermsAndConditionsScreen from '../screens/TermsAndConditionsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';

// Mock Icon component
const Icon = ({ name }: { name: string }) => <View />;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- WELCOME SCREEN COMPONENT ---
const WelcomeScreen = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000); // Navigate after 3 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.welcomeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.welcomeBg} />
      <View style={styles.imagePlaceholder}>
        <ReactNative.Text style={styles.placeholderText}>EasyOrganic Honey Products Image</ReactNative.Text>
      </View>
      <ReactNative.Text style={styles.welcomeTitle}>EazyOrganic</ReactNative.Text>
      <ReactNative.Text style={styles.welcomeSubtitle}>Farm to Kitchen</ReactNative.Text>
    </View>
  );
};


const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
  </Stack.Navigator>
);

const CartStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
    <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
  </Stack.Navigator>
);

const AccountStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
    <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
  </Stack.Navigator>
);

const MainTabs = () => {
  const { cartCount } = useCart();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
          if (route.name === 'HomeTab') iconName = 'home';
          else if (route.name === 'CartTab') iconName = 'shopping-cart';
          else if (route.name === 'AccountTab') iconName = 'user';
          return <Icon name={iconName} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{ title: 'Cart', tabBarBadge: cartCount > 0 ? cartCount : undefined }}
      />
      <Tab.Screen name="AccountTab" component={AccountStack} options={{ title: 'Account' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { customer, loading } = useCustomerAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {customer ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = ReactNative.StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.welcomeBg,
    padding: SIZES.large,
  },
  imagePlaceholder: {
    width: SIZES.width * 0.7,
    height: SIZES.width * 0.7,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.xlarge,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: COLORS.gray,
    textAlign: 'center',
    padding: SIZES.small,
  },
  welcomeTitle: {
    fontSize: SIZES.xlarge * 1.5,
    fontWeight: 'bold',
    color: COLORS.titleGreen,
  },
  welcomeSubtitle: {
    fontSize: SIZES.large,
    color: COLORS.gray,
    marginTop: SIZES.base,
  },
});


export default AppNavigator;