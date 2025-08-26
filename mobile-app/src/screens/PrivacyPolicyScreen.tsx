import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import * as ReactNative from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, globalStyles } from '../styles';

const PrivacyPolicyScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ReactNative.Text style={styles.backButtonText}>{'<'}</ReactNative.Text>
        </TouchableOpacity>
        <ReactNative.Text style={globalStyles.title}>Privacy Policy</ReactNative.Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <ReactNative.Text style={styles.sectionTitle}>1. Information We Collect</ReactNative.Text>
        <ReactNative.Text style={styles.paragraph}>
          We collect information you provide directly to us, such as when you create an account, place an order, or contact customer service. This may include your name, email address, shipping address, phone number, and payment information.
        </ReactNative.Text>
        <ReactNative.Text style={styles.sectionTitle}>2. How We Use Your Information</ReactNative.Text>
        <ReactNative.Text style={styles.paragraph}>
          We use the information we collect to process your orders, communicate with you, personalize your shopping experience, and improve our services. We do not sell or share your personal information with third parties for their marketing purposes without your explicit consent.
        </ReactNative.Text>
        <ReactNative.Text style={styles.sectionTitle}>3. Data Security</ReactNative.Text>
        <ReactNative.Text style={styles.paragraph}>
          We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.
        </ReactNative.Text>
        <ReactNative.Text style={styles.sectionTitle}>4. Your Rights</ReactNative.Text>
        <ReactNative.Text style={styles.paragraph}>
          You have the right to access, correct, or delete your personal information. You can do this by logging into your account or by contacting our customer support team.
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

export default PrivacyPolicyScreen;