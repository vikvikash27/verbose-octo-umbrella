import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as ReactNative from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import { COLORS, SIZES, globalStyles } from '../styles';

const SignupScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useCustomerAuth();

  const handleSignup = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setIsLoading(true);
    try {
      await signup(name, email, password, phone);
      Alert.alert(
        'Success',
        'Account created successfully! Please log in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Signup Failed', error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]}>
      <ReactNative.Text style={globalStyles.title}>Create Account</ReactNative.Text>
      <ReactNative.Text style={styles.subtitle}>Start your journey with EasyOrganic</ReactNative.Text>
      <TextInput
        style={[globalStyles.input, styles.input]}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[globalStyles.input, styles.input]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
       <TextInput
        style={[globalStyles.input, styles.input]}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={[globalStyles.input, styles.input]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[globalStyles.button, styles.button, isLoading && { backgroundColor: COLORS.gray }]}
        onPress={handleSignup}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <ReactNative.Text style={globalStyles.buttonText}>Sign Up</ReactNative.Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <ReactNative.Text style={styles.linkText}>
          Already have an account? <ReactNative.Text style={{ color: COLORS.primary }}>Sign In</ReactNative.Text>
        </ReactNative.Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: SIZES.xlarge,
  },
  subtitle: {
    color: COLORS.gray,
    marginBottom: SIZES.xlarge,
  },
  input: {
    marginVertical: SIZES.small,
  },
  button: {
    marginTop: SIZES.medium,
    marginBottom: SIZES.large,
  },
  linkText: {
    textAlign: 'center',
    color: COLORS.gray,
  },
});

export default SignupScreen;