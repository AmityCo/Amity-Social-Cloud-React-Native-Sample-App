import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoArea: { marginBottom: 20, alignItems: 'center' },
  input: { width: '75%', marginBottom: 15 },
  btn: { width: 200, alignSelf: 'center' },
  darkModeToggleArea: {
    marginTop: 25,
  },
});

export default styles;
