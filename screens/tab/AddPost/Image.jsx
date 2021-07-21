import React from "react";
import { Pressable, ImageBackground, StyleSheet } from "react-native";

const PostFile = ({ file, onOpen }) => {
  return (
    <Pressable style={styles.view} onPress={onOpen}>
      <ImageBackground
        source={{ uri: file.uri }}
        imageStyle={styles.img}
        style={styles.bg}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  view: {
    width: 75,
    height: 75,
  },
  bg: {
    width: 75,
    height: 75,
    // borderWidth: 1,
    borderRadius: 5,
    // borderColor: "gray",
    // padding: 5,
    marginBottom: 5,
    justifyContent: "center",
    marginHorizontal: 5,
  },
  img: { borderRadius: 6 },
});

export default PostFile;
