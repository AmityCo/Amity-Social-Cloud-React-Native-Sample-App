import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // flexGrow: 1,
  },

  content: {
    width: '100%',
    alignItems: 'center',
  },

  communityInputContainer: {
    width: '90%',
    height: 70,
    textAlignVertical: 'top',
    padding: 10,
    marginBottom: 20,
  },

  communityInput: {
    flex: 1,
    // height: 150,
    textAlignVertical: 'top',
    fontSize: 18,
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
