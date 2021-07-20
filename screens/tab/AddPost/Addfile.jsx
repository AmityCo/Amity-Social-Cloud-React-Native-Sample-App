import React, { useState } from "react";
import { createFile } from "@amityco/ts-sdk";
import * as ImagePicker from "expo-image-picker";
import { View, Text, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Pressable, Alert, ActivityIndicator } from "react-native";

const AddPostFiles = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const selectFile = async () => {
    setIsUploading(true);
    try {
      // const result = await DocumentPicker.getDocumentAsync();
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: false,
        multiple: false,
      });

      if (result.type === "success") {
        const fileData = {
          // ...result,
          name: result.name,
          size: result.size,
          type: "application/pdf",
          uri: result.uri,
          // uri: (Platform.OS = "android" ? "file://" : "") + result.uri,
          // type: "application/pdf",
          // uri: result.uri,
        };

        const data = new FormData();
        data.append("file", fileData);

        console.log(2, fileData, data);
        const response = await createFile(data);

        setFiles([...files, response[0]]);

        Alert.alert("file successfully uploaded!");
      }
    } catch (error) {
      Alert.alert("error in uploading file!");
      //   console.error(error, error.name, error.message, error.toString());
      if (error.response) {
        // Request made and server responded
        console.log("error1", error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log("error2", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error3", error.message);
      }
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <View style={styles.addFileArea}>
      <Pressable
        style={styles.addFileBtn}
        onPress={selectFile}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.attachFileBtnText}>Attach File</Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  addFileArea: { marginBottom: 10, height: 30, justifyContent: "space-evenly" },
  addFileBtn: { alignItems: "center" },
  addFileBtnText: { color: "#0091EA" },
});

export default AddPostFiles;
