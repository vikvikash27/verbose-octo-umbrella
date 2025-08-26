import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import * as ReactNative from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import { COLORS, SIZES, globalStyles } from '../styles';

const AccountScreen = ({ navigation }: any) => {
  const { customer, logout } = useCustomerAuth();

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <ReactNative.Text style={globalStyles.title}>My Account</ReactNative.Text>
      </View>
      <View style={globalStyles.contentContainer}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <ReactNative.Text style={styles.avatarText}>{customer?.name.charAt(0)}</ReactNative.Text>
          </View>
          <ReactNative.Text style={styles.name}>{customer?.name}</ReactNative.Text>
          <ReactNative.Text style={styles.email}>{customer?.email}</ReactNative.Text>
        </View>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('OrderHistory')}>
          <ReactNative.Text style={styles.menuText}>Order History</ReactNative.Text>
          <ReactNative.Text>{'>'}</ReactNative.Text>
        </TouchableOpacity>

        <TouchableOpacity style={[globalStyles.button, styles.logoutButton]} onPress={logout}>
          <ReactNative.Text style={globalStyles.buttonText}>Log Out</ReactNative.Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = ReactNative.StyleSheet.create({
  header: {
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.large,
    alignItems: 'center',
    marginBottom: SIZES.large,
    ...globalStyles.shadow,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  email: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginTop: 4,
  },
  menuItem: {
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  menuText: {
    fontSize: SIZES.medium,
  },
  logoutButton: {
    backgroundColor: COLORS.danger,
    marginTop: SIZES.large,
  },
});

export default AccountScreen;