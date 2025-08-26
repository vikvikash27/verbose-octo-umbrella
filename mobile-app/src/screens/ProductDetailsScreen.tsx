import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ReactNative from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product } from '../types';
import { API_URL } from '../api/config';
import { COLORS, SIZES, globalStyles } from '../styles';
import { useCart } from '../contexts/CartContext';

const ProductDetailsScreen = ({ route, navigation }: any) => {
  const { productId } = route.params;
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/${productId}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ReactNative.Text style={{ color: COLORS.danger }}>{error || 'Product could not be loaded.'}</ReactNative.Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView>
        <ReactNative.Image source={{ uri: product.imageUrl }} style={styles.image} />
        <View style={styles.detailsContainer}>
          <ReactNative.Text style={styles.category}>{product.category}</ReactNative.Text>
          <ReactNative.Text style={styles.name}>{product.name}</ReactNative.Text>
          <ReactNative.Text style={styles.price}>₹{product.price.toFixed(2)}</ReactNative.Text>
          <ReactNative.Text style={styles.description}>{product.description || 'No description available.'}</ReactNative.Text>
        </View>
      </ScrollView>
       <View style={styles.footer}>
        <TouchableOpacity
          style={[globalStyles.button, product.stock === 0 && styles.disabledButton]}
          onPress={() => addToCart(product)}
          disabled={product.stock === 0}
        >
          <ReactNative.Text style={globalStyles.buttonText}>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</ReactNative.Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = ReactNative.StyleSheet.create({
  image: {
    width: SIZES.width,
    height: SIZES.width,
  },
  detailsContainer: {
    padding: SIZES.medium,
  },
  category: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginBottom: SIZES.base,
  },
  name: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.small,
  },
  price: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.medium,
  },
  description: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    lineHeight: SIZES.large,
  },
  footer: {
    padding: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: COLORS.white,
  },
  disabledButton: {
      backgroundColor: COLORS.gray
  }
});

export default ProductDetailsScreen;