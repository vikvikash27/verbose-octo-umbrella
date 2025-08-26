import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import * as ReactNative from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../contexts/CartContext';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import { Address } from '../types';
import { API_URL } from '../api/config';
import { COLORS, SIZES, globalStyles } from '../styles';
import LocationMapView from '../components/LocationMapView';

const CheckoutScreen = ({ navigation }: any) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { customer, getToken } = useCustomerAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<Omit<Address, 'location'>>({
    fullName: customer?.name || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    phone: customer?.phone || '',
  });
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);
  
  const handleInputChange = (field: keyof typeof address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    const token = await getToken();
    if (!customer || !token) {
      Alert.alert('Not Logged In', 'You must be logged in to place an order.');
      return;
    }
    if (!address.fullName || !address.street || !address.city || !address.state || !address.zip || !address.phone) {
      Alert.alert('Missing Information', 'Please fill in all address fields.');
      return;
    }
    if (!location) {
      Alert.alert('Missing Location', 'Please set your location on the map.');
      return;
    }

    setIsLoading(true);
    
    const orderPayload = {
      items: cartItems.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: cartTotal,
      address: { ...address, location },
      paymentMethod: 'COD', // Defaulting to COD for mobile
    };

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to place order.');
      }

      const newOrderData = await response.json();
      clearCart();
      navigation.navigate('OrderConfirmation', { orderId: newOrderData.order.id });
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView>
        <View style={styles.header}>
          <ReactNative.Text style={globalStyles.title}>Checkout</ReactNative.Text>
        </View>
        <View style={styles.content}>
          <ReactNative.Text style={styles.sectionTitle}>Delivery Address</ReactNative.Text>
          <TextInput placeholder="Full Name" value={address.fullName} onChangeText={val => handleInputChange('fullName', val)} style={globalStyles.input} />
          <TextInput placeholder="Street Address" value={address.street} onChangeText={val => handleInputChange('street', val)} style={[globalStyles.input, styles.inputSpacing]} />
          <TextInput placeholder="City" value={address.city} onChangeText={val => handleInputChange('city', val)} style={[globalStyles.input, styles.inputSpacing]} />
          <TextInput placeholder="State" value={address.state} onChangeText={val => handleInputChange('state', val)} style={[globalStyles.input, styles.inputSpacing]} />
          <TextInput placeholder="ZIP Code" value={address.zip} onChangeText={val => handleInputChange('zip', val)} style={[globalStyles.input, styles.inputSpacing]} />
          <TextInput placeholder="Phone Number" value={address.phone} onChangeText={val => handleInputChange('phone', val)} style={[globalStyles.input, styles.inputSpacing]} keyboardType="phone-pad" />
          
          <ReactNative.Text style={[styles.sectionTitle, styles.inputSpacing]}>Pin Location on Map</ReactNative.Text>
          <LocationMapView onLocationChange={setLocation} />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[globalStyles.button, isLoading && { backgroundColor: COLORS.gray }]}
          onPress={handlePlaceOrder}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <ReactNative.Text style={globalStyles.buttonText}>Place Order (₹{cartTotal.toFixed(2)})</ReactNative.Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = ReactNative.StyleSheet.create({
  header: {
    padding: SIZES.medium,
  },
  content: {
    paddingHorizontal: SIZES.medium,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    marginBottom: SIZES.small,
  },
  inputSpacing: {
    marginTop: SIZES.small,
  },
  footer: {
    padding: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: COLORS.white,
  },
});

export default CheckoutScreen;