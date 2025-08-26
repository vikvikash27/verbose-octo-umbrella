import * as ReactNative from 'react-native';

export const COLORS = {
  primary: '#4f46e5',
  secondary: '#10b981',
  titleGreen: '#047857',
  welcomeBg: '#F4F8E1',
  white: '#FFFFFF',
  black: '#0f172a',
  gray: '#64748b',
  lightGray: '#f1f5f9',
  danger: '#ef4444',
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  xlarge: 24,
  width: ReactNative.Dimensions.get('window').width,
  height: ReactNative.Dimensions.get('window').height,
};

export const globalStyles = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  contentContainer: {
    padding: SIZES.medium,
  },
  title: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  subtitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.black,
  },
  text: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  shadow: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    backgroundColor: COLORS.white,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: SIZES.base,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    fontSize: SIZES.font,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: SIZES.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: SIZES.font,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
  }
});