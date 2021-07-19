import { StyleSheet, StatusBar, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

export const ApplicationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    alignItems: "flex-start",
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#777",
    paddingStart: 15,
    paddingEnd: 8,
    paddingTop: 4,
    paddingBottom: 4,
    margin: 8,
    width: windowWidth / 1.8,
  },
  btnContainerStyle: {
    marginTop: 15,
    backgroundColor: "#0091EA",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  btnTextStyle: {
    color: "#FFFFFF",
    fontSize: 14,
    textTransform: "uppercase",
    textAlign: "center",
  },
  checkboxContainer: {
    marginTop: 10,
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
    color: "#a9a9a9",
  },
  postInput: {
    width: windowWidth / 1.1,
    height: 100,
    textAlignVertical: "top",
    fontSize: 18,
    backgroundColor: "#F1F1F1",
    padding: 10,
    marginVertical: 10,
  },
});
