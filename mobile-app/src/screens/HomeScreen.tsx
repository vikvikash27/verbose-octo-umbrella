import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ReactNative from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product } from '../types';
import { API_URL } from '../api/config';
import { COLORS, SIZES, globalStyles } from '../styles';

const HomeScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
    >
      <ReactNative.Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <ReactNative.Text style={styles.productName} numberOfLines={2}>{item.name}</ReactNative.Text>
        <ReactNative.Text style={styles.productPrice}>₹{item.price.toFixed(2)}</ReactNative.Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ReactNative.Text style={{ color: COLORS.danger }}>Error: {error}</ReactNative.Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <ReactNative.Text style={globalStyles.title}>Our Products</ReactNative.Text>
      </View>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = ReactNative.StyleSheet.create({
  header: {
    paddingHorizontal: SIZES.medium,
    paddingTop: SIZES.medium,
    paddingBottom: SIZES.small,
  },
  listContainer: {
    paddingHorizontal: SIZES.base,
  },
  productCard: {
    flex: 1,
    margin: SIZES.base,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    ...globalStyles.shadow,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 150,
  },
  productInfo: {
    padding: SIZES.small,
  },
  productName: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.black,
  },
  productPrice: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SIZES.base,
  },
});

export default HomeScreen;