import React, { useState, useEffect } from "react";
import { Modal, ScrollView, StyleSheet, FlatList } from "react-native";
import { Header } from "react-native-elements";

import { queryComments } from "@amityco/ts-sdk";

function CommentScreen({ postId, visible, onClose }) {
  const [commentData, setCommentData] = useState([]);

  useEffect(() => {
    onQueryComment();
  }, [postId]);

  const onQueryComment = async () => {
    try {
      const query = {
        postId: postId,
        isDeleted: false,
        sortBy: "lastCreated",
      };
      const queryComment = await queryComments(query);
      console.log(queryComment);
      //   setCommentData(queryComment);
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
  };

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
        {/* <FlatList
          style={{ color: "red" }}
          data={postOptionItems}
          renderItem={({ item }) => (
            <PostOptionItem
              optionItem={item}
              onPressOption={(id) => onSubmitOption(id)}
            />
          )}
          keyExtractor={(item) => item.id}
        ></FlatList> */}
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flexGrow: 1,
    backgroundColor: "white",
    marginTop: 20,
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

export default CommentScreen;
