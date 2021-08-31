import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postItem: {
    flex: 1,
    margin: 12,
    borderRadius: 5,
  },
  errorText: { fontSize: 18, alignSelf: 'center', marginTop: 25, marginBottom: 15 },
});

export const filterDialogStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  radioArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: { marginBottom: 25 },
  includeDeletedArea: {
    marginTop: 10,
    marginBottom: 10,
  },
  errorText: { fontSize: 18, alignSelf: 'center', marginTop: 25, marginBottom: 15 },
});

export default styles;
