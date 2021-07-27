import React, { useState } from "react";
import { Header } from "react-native-elements";
import { View, Text, Alert } from "react-native";

import AddPost from "./AddPost";

import FeedPosts from "./Post/FeedPost";

import PostOption from "./Post/PostOption";

function FeedScreen() {
  const [showAddPost, setShowAddPost] = useState(false);
  const [showMoreOption, setShowMoreOption] = useState(false);
  const [optionPostId, setOptionPostId] = useState("");

  const [isRefresh, setUpIsRefresh] = useState(false);

  const refresh = () => {
    setUpIsRefresh(true);
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
          setOptionPostId(postId);
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
        postId={optionPostId}
        visible={showMoreOption}
        onClose={() => {
          setShowMoreOption(false);
          refresh();
        }}
      />
    </View>
  );
}

export default FeedScreen;
