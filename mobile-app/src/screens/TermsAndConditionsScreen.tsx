import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import * as ReactNative from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, globalStyles } from '../styles';

const TermsAndConditionsScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ReactNative.Text style={styles.backButtonText}>{'<'}</ReactNative.Text>
        </TouchableOpacity>
        <ReactNative.Text style={globalStyles.title}>Terms & Conditions</ReactNative.Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <ReactNative.Text style={styles.sectionTitle}>1. Introduction</ReactNative.Text>
        <ReactNative.Text style={styles.paragraph}>
          Welcome to EasyOrganic. These are the terms and conditions governing your access to and use of the website EasyOrganic and its related sub-domains, sites, services and tools. By using the Site, you hereby accept these terms and conditions and represent that you agree to comply with these terms and conditions.
        </ReactNative.Text>
        <ReactNative.Text style={styles.sectionTitle}>2. User Account</ReactNative.Text>
        <ReactNative.Text style={styles.paragraph}>
          To access certain services on the Site, you will be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
        </ReactNative.Text>
        <ReactNative.Text style={styles.sectionTitle}>3. Product Information</ReactNative.Text>
        <ReactNative.Text style={styles.paragraph}>
          We strive to provide accurate product and pricing information. However, pricing or typographical errors may occur. In the event that a product is listed at an incorrect price or with incorrect information due to an error, we shall have the right, at our sole discretion, to refuse or cancel any orders placed for that product.
        </ReactNative.Text>
        <ReactNative.Text style={styles.sectionTitle}>4. Governing Law</ReactNative.Text>
        <ReactNative.Text style={styles.paragraph}>
          These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Hyderabad, India.
        </ReactNative.Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = ReactNative.StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginRight: SIZES.medium,
    padding: SIZES.base,
  },
  backButtonText: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  content: {
    padding: SIZES.medium,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    marginTop: SIZES.medium,
    marginBottom: SIZES.small,
  },
  paragraph: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    lineHeight: SIZES.large,
  },
});

export default TermsAndConditionsScreen;