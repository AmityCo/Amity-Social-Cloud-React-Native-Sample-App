import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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

  userInputContainer: {
    width: '90%',
    height: 160,
    textAlignVertical: 'top',
    padding: 10,
    marginBottom: 20,
  },

  userInput: {
    flex: 1,
    // height: 150,
    textAlignVertical: 'top',
    fontSize: 18,
  },

  filesContainer: {
    width: '100%',
    marginBottom: 15,
  },

  filesArea: {
    justifyContent: 'flex-start',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '90%',
    // backgroundColor: "black",
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
