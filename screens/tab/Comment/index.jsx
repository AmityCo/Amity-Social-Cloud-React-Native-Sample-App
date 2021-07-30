import React, { useState, useEffect } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  TextInput,
  View,
} from "react-native";

import { Button } from "react-native-elements";

import { queryComments, createComment } from "@amityco/ts-sdk";
import { GiftedChat } from "react-native-gifted-chat";

import CommentItem from "./CommentItem";

function CommentScreen({ postId, visible, onClose }) {
  const [commentData, setCommentData] = useState([]);
  const [messageComment, setComment] = useState("");

  useEffect(() => {
    if (visible) {
      onQueryComment();
    }
  }, [visible]);

  const onQueryComment = async () => {
    try {
      const query = {
        postId: postId,
        isDeleted: false,
      };
      const queryComment = await queryComments(query);
      console.log(queryComment);
      setCommentData(queryComment);
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

  const onComment = async (commentMessage) => {
    try {
      const createCommentRequest = {
        data: { text: commentMessage },
        referenceType: "post",
        referenceId: postId,
      };
      setComment();
      const createCommentResponse = await createComment(createCommentRequest);
      console.log(createCommentResponse);
      onQueryComment();
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
        <FlatList
          style={{
            flex: 1,
            paddingHorizontal: 10,
            marginTop: 10,
          }}
          data={commentData}
          renderItem={({ item }) => (
            <CommentItem
              comment={item}
              removeComment={() => onQueryComment()}
            />
          )}
          keyExtractor={(item) => item.commentId}
        ></FlatList>
        {/* <GiftedChat
          messages={messageComment}
          bottomOffset={83}
          onSend={(comment) => onComment(comment)}
          renderMessage={() => {}}
        /> */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TextInput
            style={styles.newInput}
            value={messageComment}
            placeholder="Type some comment..."
            onChangeText={(val) => setComment(val)}
          />
          <Button
            onPress={() => onComment(messageComment)}
            title="COMMENT"
            buttonStyle={{ justifyContent: "center" }}
          />
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 20,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  textHeader: {
    alignSelf: "center",
    marginVertical: 10,
    color: "grey",
  },
  newInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    padding: 10,
    height: 40,
  },
});

export default CommentScreen;
