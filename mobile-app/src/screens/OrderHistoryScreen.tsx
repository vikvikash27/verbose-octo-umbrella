import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ReactNative from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import { Order } from '../types';
import { API_URL } from '../api/config';
import { COLORS, SIZES, globalStyles } from '../styles';

const OrderHistoryScreen = ({ navigation }: any) => {
  const { customer, getToken } = useCustomerAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = await getToken();
      if (!customer || !token) {
        setLoading(false);
        return;
      };

      try {
        const response = await fetch(`${API_URL}/api/orders/myorders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data.sort((a: Order, b: Order) => new Date(b.orderTimestamp).getTime() - new Date(a.orderTimestamp).getTime()));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [customer, getToken]);

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity 
      style={[globalStyles.card, styles.orderCard]} 
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
    >
      <View style={styles.cardHeader}>
        <ReactNative.Text style={styles.orderId}>Order {item.id}</ReactNative.Text>
        <ReactNative.Text style={styles.orderDate}>{new Date(item.orderTimestamp).toLocaleDateString()}</ReactNative.Text>
      </View>
      <View style={styles.cardBody}>
        <ReactNative.Text>Total: ₹{item.total.toFixed(2)}</ReactNative.Text>
        <ReactNative.Text>Status: <ReactNative.Text style={{fontWeight: 'bold'}}>{item.status}</ReactNative.Text></ReactNative.Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <ReactNative.Text style={globalStyles.title}>Order History</ReactNative.Text>
      </View>
      {error && <ReactNative.Text style={styles.errorText}>Error: {error}</ReactNative.Text>}
      {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
              <ReactNative.Text>No orders found.</ReactNative.Text>
          </View>
      ) : (
        <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={globalStyles.contentContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = ReactNative.StyleSheet.create({
  header: {
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  orderCard: {
    ...globalStyles.shadow,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  cardBody: {
    paddingTop: SIZES.small,
  },
  orderId: {
    fontWeight: 'bold',
  },
  orderDate: {
    color: COLORS.gray,
  },
  errorText: {
      color: COLORS.danger,
      textAlign: 'center',
      marginTop: SIZES.medium
  },
  emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  }
});

export default OrderHistoryScreen;