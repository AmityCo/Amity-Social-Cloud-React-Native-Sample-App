import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: { alignSelf: 'center', marginTop: 25 },
  loadMore: { height: 25 },
  mainContainer: { flex: 1, flexGrow: 1 },
  emptyMessage: { alignSelf: 'center', marginTop: 50 },
  loading: {
    paddingVertical: 20,
  },
});

export default styles;
