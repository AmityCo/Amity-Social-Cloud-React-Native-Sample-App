import React, { useState, useRef, useEffect } from "react";
import { TextInput } from "react-native";
import { createPost } from "@amityco/ts-sdk";
import { Pressable, Alert } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { client } from "../../LoginPage";

import useCollection from "../../../hooks/useCollection";

import Image from "./Image";
import AddImage from "./AddImage";

const AddPost = ({ visible, onClose, onAddPost }) => {
  const createPostSheet = useRef();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const [images, addImage, remImage, toggleImages, resetImages] = useCollection(
    [],
    (arr, el) => arr.findIndex(({ fileId }) => fileId === el.fileId)
  );

  useEffect(() => {
    if (!visible) {
      setText("");
      resetImages();
    }

    createPostSheet?.current?.setModalVisible(visible);
  }, [visible]);

  const onSubmit = async () => {
    if (text === "") {
      Alert.alert("Please input a text!");
      return;
    }

    try {
      setLoading(true);
      const data = {
        data: { text: text },
        targetType: "user",
        targetId: client.userId,
      };

      if (images.length) {
        data.data.images = images.map(({ fileId }) => fileId);
      }

      const response = await createPost(data);

      onClose();
      onAddPost();
    } catch (error) {
      console.log(error.response);
      Alert.alert("Error adding post!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onClose={onClose}
      onRequestClose={onClose}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.centeredView}
      >
        <View style={styles.content}>
          <TextInput
            value={text}
            multiline={true}
            onChangeText={setText}
            style={styles.postInput}
            placeholder="Type anything in your mind."
          />

          <View style={styles.filesContainer}>
            <AddImage onAddImage={addImage} />

            <View style={styles.filesArea}>
              {images.map((img) => (
                <Image file={img} key={`${img.fileId}`} />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.btnArea}>
          <Pressable style={styles.btn} onPress={onSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.btnText}>Submit</Text>
            )}
          </Pressable>

          <Pressable style={styles.btn} onPress={onClose}>
            <Text style={styles.btnText}>Close</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Modal>
  );
};

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 20,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },

  content: {
    width: "100%",
    alignItems: "center",
  },

  postInput: {
    width: "90%",
    height: 100,
    textAlignVertical: "top",
    fontSize: 18,
    backgroundColor: "#F1F1F1",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },

  filesContainer: {
    width: "100%",
    marginBottom: 15,
  },

  filesArea: {
    justifyContent: "flex-start",
    alignSelf: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "90%",
    // backgroundColor: "black",
  },

  btnArea: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  btn: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
    backgroundColor: "#2196F3",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AddPost;
