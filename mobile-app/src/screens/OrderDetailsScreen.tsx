import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import * as ReactNative from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Order } from '../types';
import { API_URL } from '../api/config';
import { COLORS, SIZES, globalStyles } from '../styles';

const OrderDetailsScreen = ({ route }: any) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${API_URL}/api/orders/${encodeURIComponent(orderId)}`);
        if (!response.ok) {
          throw new Error('Order not found');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />;
  }
  
  if (error || !order) {
    return <View style={styles.center}><ReactNative.Text style={{color: COLORS.danger}}>{error || 'Order not found'}</ReactNative.Text></View>;
  }

  return (
    <SafeAreaView style={globalStyles.container}>
        <View style={styles.header}>
            <ReactNative.Text style={globalStyles.title}>Order {order.id}</ReactNative.Text>
        </View>
      <ScrollView contentContainerStyle={globalStyles.contentContainer}>
        <View style={globalStyles.card}>
          <ReactNative.Text style={styles.sectionTitle}>Order Summary</ReactNative.Text>
          <ReactNative.Text>Date: {new Date(order.orderTimestamp).toLocaleString()}</ReactNative.Text>
          <ReactNative.Text>Total: ₹{order.total.toFixed(2)}</ReactNative.Text>
          <ReactNative.Text>Status: {order.status}</ReactNative.Text>
        </View>
        <View style={globalStyles.card}>
          <ReactNative.Text style={styles.sectionTitle}>Items</ReactNative.Text>
          {order.items.map(item => (
            <View key={item.productId} style={styles.itemRow}>
              <ReactNative.Text>{item.quantity} x {item.productName}</ReactNative.Text>
              <ReactNative.Text>₹{(item.price * item.quantity).toFixed(2)}</ReactNative.Text>
            </View>
          ))}
        </View>
        <View style={globalStyles.card}>
          <ReactNative.Text style={styles.sectionTitle}>Delivery Address</ReactNative.Text>
          <ReactNative.Text>{order.address?.fullName}</ReactNative.Text>
          <ReactNative.Text>{order.address?.street}</ReactNative.Text>
          <ReactNative.Text>{order.address?.city}, {order.address?.state} {order.address?.zip}</ReactNative.Text>
          <ReactNative.Text>{order.address?.phone}</ReactNative.Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = ReactNative.StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        padding: SIZES.medium,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    sectionTitle: {
        fontSize: SIZES.large,
        fontWeight: '600',
        marginBottom: SIZES.small,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SIZES.base,
    }
});

export default OrderDetailsScreen;