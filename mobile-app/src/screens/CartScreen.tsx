import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import * as ReactNative from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../contexts/CartContext';
import { COLORS, SIZES, globalStyles } from '../styles';
import { CartItem } from '../types';

const CartScreen = ({ navigation }: any) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={[styles.cartItem, globalStyles.shadow]}>
      <ReactNative.Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <ReactNative.Text style={styles.itemName} numberOfLines={1}>{item.name}</ReactNative.Text>
        <ReactNative.Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</ReactNative.Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} style={styles.quantityButton}>
          <ReactNative.Text style={styles.quantityButtonText}>-</ReactNative.Text>
        </TouchableOpacity>
        <ReactNative.Text style={styles.quantityText}>{item.quantity}</ReactNative.Text>
        <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} style={styles.quantityButton}>
          <ReactNative.Text style={styles.quantityButtonText}>+</ReactNative.Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
        <ReactNative.Text style={styles.removeButtonText}>X</ReactNative.Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <ReactNative.Text style={globalStyles.title}>My Cart</ReactNative.Text>
      </View>
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ReactNative.Text style={styles.emptyText}>Your cart is empty.</ReactNative.Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: SIZES.medium }}
          />
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <ReactNative.Text style={styles.totalText}>Total:</ReactNative.Text>
              <ReactNative.Text style={styles.totalPrice}>₹{cartTotal.toFixed(2)}</ReactNative.Text>
            </View>
            <TouchableOpacity 
              style={globalStyles.button}
              onPress={() => navigation.navigate('Checkout')}
            >
              <ReactNative.Text style={globalStyles.buttonText}>Proceed to Checkout</ReactNative.Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = ReactNative.StyleSheet.create({
  header: {
    padding: SIZES.medium,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.small,
    marginBottom: SIZES.medium,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: SIZES.base,
  },
  itemDetails: {
    flex: 1,
    marginLeft: SIZES.small,
  },
  itemName: {
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: COLORS.lightGray,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  quantityText: {
    marginHorizontal: SIZES.small,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  removeButton: {
      marginLeft: SIZES.medium,
  },
  removeButtonText: {
      color: COLORS.danger,
      fontSize: SIZES.large,
      fontWeight: 'bold'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: SIZES.large,
    color: COLORS.gray,
  },
  footer: {
    padding: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: COLORS.white,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  totalText: {
    fontSize: SIZES.large,
    color: COLORS.gray,
  },
  totalPrice: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
});

export default CartScreen;