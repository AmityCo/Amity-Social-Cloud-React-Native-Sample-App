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

  postInputContainer: {
    width: '90%',
    height: 160,
    textAlignVertical: 'top',
    padding: 10,
    marginBottom: 20,
  },

  postInput: {
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

export const imageStyles = StyleSheet.create({
  view: {
    width: 75,
    height: 75,
  },
  bg: {
    width: 75,
    height: 75,
    borderRadius: 5,
    marginBottom: 5,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  img: { borderRadius: 6 },
});

export const fileStyles = StyleSheet.create({
  view: {
    width: 75,
    height: 75,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
    padding: 5,
    marginBottom: 5,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  text: { textAlign: 'center' },
});

export const addFileStyles = StyleSheet.create({
  container: { marginBottom: 10, alignItems: 'center' },
  btn: { justifyContent: 'center' },
  progressBar: { width: 100, height: 3, marginTop: 5 },
});

export default styles;
