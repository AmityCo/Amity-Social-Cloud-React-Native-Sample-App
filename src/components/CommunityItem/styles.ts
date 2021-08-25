import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
    borderRadius: 5,
  },
  subtitle: { flexDirection: 'row', width: '100%' },
  subtitleRow: { flexDirection: 'row', marginEnd: 10, justifyContent: 'center' },
  text: { marginBottom: 10 },
  footer: { justifyContent: 'space-between' },
  footerLeft: { flexDirection: 'row' },
  footerRight: { flexDirection: 'row', paddingEnd: 10 },
});

export default styles;
