import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";

const PostFile = ({ file, onOpen }) => {
  // attributes:
  //   extension: "zip"
  //   mimeType: "application/zip"
  //   name: "icomoon1.zip"
  //   size: 11320
  // createdAt: "2021-07-19T15:17:08.602Z"
  // fileId: "50638358e6884fb383492bb1dd2eb42d"
  // fileUrl: "https://api.amity.co/api/v3/files/50638358e6884fb383492bb1dd2eb42d/download"
  // type: "file"
  // updatedAt: "2021-07-19T15:17:08.602Z"

  return (
    <Pressable style={styles.view} onPress={onOpen}>
      <Text style={styles.text} numberOfLines={3}>
        {file.attributes.name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  view: {
    width: 75,
    height: 75,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "gray",
    padding: 5,
    marginBottom: 5,
    justifyContent: "center",
    marginHorizontal: 5,
  },
  text: { textAlign: "center" },
});

export default PostFile;
