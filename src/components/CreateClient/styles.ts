import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '70%',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  content: {
    width: '100%',
    alignItems: 'center',
  },

  postInputContainer: {
    width: '90%',
    textAlignVertical: 'top',
    padding: 10,
    marginBottom: 20,
  },

  postInput: {
    flex: 1,
    textAlignVertical: 'top',
    fontSize: 18,
  },

  loadingArea: {
    flex: 1,
  },

  btnArea: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  btn: {
    width: 120,
  },
});

export default styles;
