import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { paddingVertical: 5 },
  onEditOrReply: { paddingStart: 5, flexDirection: 'row' },
  inputArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    flex: 1,
    borderRadius: 5,
    marginStart: 5,
  },
  textInputContainer: { flex: 1, padding: 2, borderRadius: 5, height: 50 },
  btn: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
