import React, { useState } from "react";
import { Header } from "react-native-elements";
import { View, Text, Alert } from "react-native";

import AddPost from "../AddPost";

import FeedPosts from "./FeedPost";

import PostOption from "./PostOption";
import CommentScreen from "../Comment";

function FeedScreen() {
  const [showAddPost, setShowAddPost] = useState(false);
  const [showMoreOption, setShowMoreOption] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [postId, setPostId] = useState("");

  const [isRefresh, setUpIsRefresh] = useState(false);

  const refresh = () => {
    setUpIsRefresh(true);
    setUpIsRefresh(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        backgroundColor="#26cb7c"
        centerComponent={{ text: "Feed", style: { color: "#fff" } }}
        rightComponent={{
          icon: "description",
          color: "#fff",
          onPress: () => setShowAddPost(true),
        }}
      />

      <FeedPosts
        showPostOption={(postId) => {
          setShowMoreOption(true);
          setPostId(postId);
          console.log(postId);
        }}
        refresh={isRefresh}
      />

      <AddPost
        onAddPost={() => {
          setShowAddPost(false);
          setTimeout(() => {
            console.log(123);
            Alert.alert("successfull!");
          }, 1000);
          refresh();
        }}
        visible={showAddPost}
        onClose={() => setShowAddPost(false)}
      />

      <PostOption
        postId={postId}
        visible={showMoreOption}
        onClose={() => {
          setShowMoreOption(false);
          refresh();
        }}
        openCommentScreen={() => {
          setShowComment(true);
          setShowMoreOption(false);
        }}
      />

      <CommentScreen
        postId={postId}
        visible={showComment}
        onClose={() => {
          setShowComment(false);
        }}
      />
    </View>
  );
}

export default FeedScreen;
