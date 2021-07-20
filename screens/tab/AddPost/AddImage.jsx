import React, { useState, useEffect } from "react";
import { createFile } from "@amityco/ts-sdk";
import * as ImagePicker from "expo-image-picker";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Pressable, Alert, ActivityIndicator } from "react-native";

const AddPostImage = ({ onAddImage }) => {
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const selectFile = async () => {
    setIsUploading(true);

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.cancelled) {
        const fileData = {
          name: result.uri.split("/").pop(),
          type: "image/" + result.uri.split(".").pop(),
          uri: result.uri,
        };

        const data = new FormData();
        data.append("file", fileData);

        const response = await createFile(data);

        onAddImage({ ...response[0], uri: result.uri });

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
    <View style={styles.container}>
      <Pressable style={styles.btn} onPress={selectFile} disabled={isUploading}>
        {isUploading ? (
          <ActivityIndicator color="#2196F3" />
        ) : (
          <Text style={styles.btnText}>Attach Image</Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    height: 30,
    alignItems: "center",
  },
  btn: {
    // backgroundColor: "#F194FF",
    // borderRadius: 20,
    // padding: 10,
    // elevation: 2,
    // width: 100,
    // backgroundColor: "#2196F3",
  },
  btnText: { color: "#2196F3" },
});

export default AddPostImage;
