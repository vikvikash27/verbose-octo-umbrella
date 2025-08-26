import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
  FlatList,
  type ViewToken,
} from "react-native";
import * as ReactNative from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { signInWithPhoneNumber, PhoneAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useCustomerAuth } from "../contexts/CustomerAuthContext";
import { COLORS, SIZES } from "../styles";

// --- SLIDER DATA with IMAGES ---
const SLIDES = [
  {
    key: "1",
    title: "100% Natural Milk",
    imageUrl: "https://picsum.photos/seed/naturalmilk/800/600",
  },
  {
    key: "2",
    title: "Farm to Home",
    imageUrl: "https://picsum.photos/seed/farmdelivery/800/600",
  },
  {
    key: "3",
    title: "Free Milk Test Kit",
    imageUrl: "https://picsum.photos/seed/testkit/800/600",
  },
  {
    key: "4",
    title: "~300 ml Coconut Water",
    imageUrl: "https://picsum.photos/seed/coconutwater/800/600",
  },
  {
    key: "5",
    title: "Order till 12 midnight",
    imageUrl: "https://picsum.photos/seed/midnightorder/800/600",
  },
];

type Slide = (typeof SLIDES)[0];

// Simple component to render the Indian flag using styled Views
const IndianFlag = () => (
  <View style={styles.flagContainer}>
    <View style={styles.flagOrange} />
    <View style={styles.flagWhite}>
      <View style={styles.flagChakra} />
    </View>
    <View style={styles.flagGreen} />
  </View>
);

// Component for the pager dots indicator
const Pager = ({
  count,
  activeIndex,
}: {
  count: number;
  activeIndex: number;
}) => (
  <View style={styles.pagerContainer}>
    {Array.from({ length: count }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.pagerDot,
          index === activeIndex && styles.pagerDotActive,
        ]}
      />
    ))}
  </View>
);

const LoginScreen = ({ navigation }: any) => {
  const { loginWithFirebaseToken } = useCustomerAuth();
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  // --- AUTO-SCROLL LOGIC ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = (activeIndex + 1) % SLIDES.length;
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
      }
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [activeIndex]);

  // --- SLIDER VIEWABILITY CONFIG ---
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
      return;
    }
    setIsLoading(true);
    try {
      const phoneNumber = `+91${phone}`;
      const verifier = recaptchaVerifier.current!;
      const newVerificationId = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      setVerificationId(newVerificationId);
      Alert.alert('OTP Sent', 'An OTP has been sent to your phone.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6 || !verificationId) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP.');
      return;
    }
    setIsLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await auth.signInWithCredential(credential);
      
      const idToken = await userCredential.user.getIdToken();
      await loginWithFirebaseToken(idToken);
      // Navigation will happen automatically via AppNavigator
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER SLIDE ITEM ---
  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      <ReactNative.Image
        source={{ uri: item.imageUrl }}
        style={styles.slideImage}
        resizeMode="cover"
      />
      <ReactNative.Text style={styles.title}>{item.title}</ReactNative.Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
       <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
        title="Prove you're not a robot"
        cancelLabel="Close"
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={ReactNative.Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.topContainer}>
          <FlatList
            ref={flatListRef}
            data={SLIDES}
            renderItem={renderSlide}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.key}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            getItemLayout={(_, index) => ({
              length: SIZES.width,
              offset: SIZES.width * index,
              index,
            })}
          />
          <Pager count={SLIDES.length} activeIndex={activeIndex} />
        </View>

        <View style={styles.bottomContainer}>
          <ReactNative.Text style={styles.getStarted}>{verificationId ? 'Enter OTP' : 'Get started'}</ReactNative.Text>
          
           {!verificationId ? (
            <View style={styles.inputContainer}>
              <IndianFlag />
              <View style={styles.separator} />
              <TextInput
                style={styles.input}
                placeholder="Enter mobile number"
                placeholderTextColor={COLORS.gray}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={10}
              />
            </View>
           ) : (
            <>
              <TextInput
                style={[styles.inputContainer, styles.input, { paddingHorizontal: SIZES.small, textAlign: 'center' }]}
                placeholder="6-Digit OTP"
                placeholderTextColor={COLORS.gray}
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                maxLength={6}
              />
              <TouchableOpacity onPress={() => { setVerificationId(null); setOtp(''); }}>
                  <ReactNative.Text style={styles.changeNumberLink}>Change number?</ReactNative.Text>
              </TouchableOpacity>
            </>
           )}

          <TouchableOpacity
            style={[styles.continueButton, isLoading && { opacity: 0.7 }]}
            onPress={verificationId ? handleVerifyOtp : handleSendOtp}
            disabled={isLoading}
          >
           {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <ReactNative.Text style={styles.continueButtonText}>{verificationId ? 'Verify & Continue' : 'Continue'}</ReactNative.Text>
            )}
          </TouchableOpacity>
          <ReactNative.Text style={styles.tncText}>
            By Signing up you agree to {"\n"}
            <ReactNative.Text style={styles.linkText} onPress={() => navigation.navigate('TermsAndConditions')}>
              Terms & Conditions
            </ReactNative.Text>
            {' and '}
            <ReactNative.Text style={styles.linkText} onPress={() => navigation.navigate('PrivacyPolicy')}>
              Privacy Policy
            </ReactNative.Text>
          </ReactNative.Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = ReactNative.StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: "space-around",
    alignItems: "center",
  },
  topContainer: {
    width: "100%",
    height: SIZES.height * 0.45,
    justifyContent: "center",
  },
  slide: {
    width: SIZES.width,
    alignItems: "center",
    paddingHorizontal: SIZES.large,
  },
  slideImage: {
    width: "100%",
    height: "85%",
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.titleGreen,
    marginTop: SIZES.medium,
    textAlign: "center",
  },
  pagerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SIZES.small,
  },
  pagerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 4,
  },
  pagerDotActive: {
    backgroundColor: COLORS.secondary,
  },
  bottomContainer: {
    width: "100%",
    paddingHorizontal: SIZES.xlarge,
    paddingBottom: SIZES.medium,
  },
  getStarted: {
    fontSize: SIZES.medium,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: SIZES.medium,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: SIZES.base,
    paddingHorizontal: SIZES.small,
    height: 50,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  separator: {
    width: 1,
    height: "60%",
    backgroundColor: "#E5E7EB",
    marginHorizontal: SIZES.small,
  },
  flagContainer: {
    width: 28,
    height: 20,
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  flagOrange: { flex: 1, backgroundColor: "#FF9933" },
  flagWhite: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  flagGreen: { flex: 1, backgroundColor: "#138808" },
  flagChakra: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#000080",
  },
  continueButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.base,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SIZES.medium,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: "bold",
  },
  tncText: {
    textAlign: "center",
    color: COLORS.gray,
    fontSize: SIZES.small,
    marginTop: SIZES.medium,
    lineHeight: 18,
  },
  linkText: {
    fontWeight: "bold",
    color: COLORS.primary,
  },
  changeNumberLink: {
    color: COLORS.primary,
    textAlign: 'right',
    marginTop: SIZES.base,
    marginBottom: SIZES.base,
    fontSize: SIZES.font,
  }
});

export default LoginScreen;