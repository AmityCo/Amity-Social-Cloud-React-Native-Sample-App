import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { Divider } from "react-native-elements";

import PostOptionItem from "./PostOptionItem";

import { deletePost } from "@amityco/ts-sdk";

const PostOption = ({ postId, visible, onClose }) => {
  const createPostSheet = useRef();

  const onSubmitOption = async (optionId) => {
    switch (optionId) {
      case "1": {
      }
      case "3": {
        try {
          console.log("Delete This Post Id", postId);
          const v = await deletePost(postId);
          console.log(v);
          onClose();
        } catch (error) {
          if (error.response) {
            console.log("error response", error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            console.log("error request", error.request);
          } else {
            console.log("error message", error.message);
          }
        }
      }
    }
  };

  useEffect(() => {
    createPostSheet?.current?.setModalVisible(visible);
  }, [visible]);

  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={visible}
      onClose={onClose}
      onRequestClose={onClose}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.centeredView}
      >
        <Text style={styles.textHeader}>What would you like to do?</Text>
        <Divider orientation="vertical" />
        <FlatList
          style={{ color: "red" }}
          data={postOptionItems}
          renderItem={({ item }) => (
            <PostOptionItem
              optionItem={item}
              onPressOption={(id) => onSubmitOption(id)}
            />
          )}
          keyExtractor={(item) => item.id}
        ></FlatList>
        <TouchableOpacity onPress={() => onClose()}>
          <Text style={styles.textOption}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flexGrow: 1,
    backgroundColor: "white",
    marginTop: 100,
    alignContent: "flex-end",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  textHeader: {
    alignSelf: "center",
    marginVertical: 10,
    color: "grey",
  },
  textOption: {
    alignSelf: "center",
    marginVertical: 10,
    fontSize: 20,
    color: "#0091EA",
  },
});

const postOptionItems = [
  {
    id: "1",
    name: "Comment",
  },
  {
    id: "2",
    name: "Edit",
  },
  {
    id: "3",
    name: "Delete",
  },
  {
    id: "4",
    name: "View Post",
  },
  {
    id: "5",
    name: "Flag Post",
  },
  {
    id: "6",
    name: "UnFlag Post",
  },
  {
    id: "7",
    name: "View Community Membership",
  },
  {
    id: "8",
    name: "Copy Post Id",
  },
];

export default PostOption;
