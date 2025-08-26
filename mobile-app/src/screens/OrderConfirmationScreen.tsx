import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import * as ReactNative from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, globalStyles } from '../styles';

const OrderConfirmationScreen = ({ route, navigation }: any) => {
  const { orderId } = route.params;

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]}>
      <View style={styles.iconContainer}>
        <ReactNative.Text style={styles.icon}>✅</ReactNative.Text>
      </View>
      <ReactNative.Text style={styles.title}>Thank You!</ReactNative.Text>
      <ReactNative.Text style={styles.message}>Your order has been placed successfully.</ReactNative.Text>
      <ReactNative.Text style={styles.orderId}>Order ID: {orderId}</ReactNative.Text>
      <TouchableOpacity 
        style={[globalStyles.button, styles.button]}
        onPress={() => navigation.popToTop()}
      >
        <ReactNative.Text style={globalStyles.buttonText}>Continue Shopping</ReactNative.Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = ReactNative.StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.medium,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.xlarge,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.small,
  },
  message: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  orderId: {
      fontSize: SIZES.font,
      color: COLORS.gray,
      textAlign: 'center',
      marginBottom: SIZES.xlarge,
  },
  button: {
      width: '100%'
  }
});

export default OrderConfirmationScreen;