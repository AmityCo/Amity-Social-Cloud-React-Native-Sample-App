import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Moment from "moment";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  observeUser,
  observeFile,
  getPost,
  addReaction,
  removeReaction,
} from "@amityco/ts-sdk";
import { useEffect } from "react";
import { render } from "react-dom";

const PostItemReaction = {
  like: "like",
  love: "love",
};

const PostItems = ({ post, showPostItemOption }) => {
  const [user, setUser] = useState({});
  const [file, setFile] = useState({});
  const [childPost, setChildPost] = useState({});
  const [postImage, setPostImage] = useState({});
  const [myReaction, setMyReaction] = useState([]);
  const [likeColor, setLikeColor] = useState("");
  const [loveColor, setLoveColor] = useState("");

  useEffect(() => post && observeUser(post.postedUserId, setUser), [post]);

  useEffect(
    () => (user ? observeFile(user.avatarFileId, setFile) : undefined),
    [user]
  );

  useEffect(() => {
    async function fetchChildredPost() {
      if (post.children && post.children.length > 0) {
        const childrenPost = await getPost(post.children);
        setChildPost(childrenPost);
      }
    }
    fetchChildredPost();
  }, [post]);

  useEffect(() => {
    setMyReaction(post.myReactions);
  }, [post]);

  useEffect(() => {
    updateColor();
  }, [myReaction]);

  const updateColor = () => {
    if (myReaction.includes(PostItemReaction.like)) {
      setLikeColor("#5890FF");
    } else {
      setLikeColor("#838899");
    }

    if (myReaction.includes(PostItemReaction.love)) {
      setLoveColor("#F25268");
    } else {
      setLoveColor("#838899");
    }
  };

  useEffect(
    () =>
      childPost
        ? observeFile(childPost?.data?.fileId, setPostImage)
        : undefined,
    [childPost]
  );

  const reactThePost = (reaction) => {
    try {
      var index = myReaction.indexOf(reaction);
      if (index != -1) {
        myReaction.splice(index, 1);
        removeReaction("post", post.postId, reaction);
      } else {
        myReaction.push(reaction);
        addReaction("post", post.postId, reaction);
      }

      setMyReaction(myReaction);
      updateColor();
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

  const postCreateAt = Moment(post.createdAt).format("MMM d, HH:mm");

  return (
    <View style={styles.feedItem}>
      <View style={styles.feedItemHeader}>
        <Image source={{ uri: file?.fileUrl }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={styles.name}>{user.displayName}</Text>
              <Text style={styles.timestamp}>{postCreateAt}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                showPostItemOption(post.postId);
              }}
            >
              <Ionicons
                name="ellipsis-vertical-sharp"
                size={20}
                color="#C4C6CE"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text style={styles.post}>{post.data.text}</Text>
      {post.children.length > 0 ? (
        <Image
          source={{ uri: postImage?.fileUrl }}
          style={{
            marginHorizontal: 16,
            marginVertical: 8,
            width: 100,
            height: 100,
          }}
          resizeMode="stretch"
        />
      ) : null}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            reactThePost(PostItemReaction.like);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              padding: 10,
            }}
          >
            <MaterialCommunityIcons
              name="thumb-up-outline"
              size={20}
              color={likeColor}
            />
            <Text style={{ marginStart: 10 }}>Like</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            reactThePost(PostItemReaction.love);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-end",
              padding: 10,
            }}
          >
            <FontAwesome5 name="heart" size={20} color={loveColor} />
            <Text style={{ marginStart: 10 }}>Love</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostItems;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBECF4",
  },
  header: {
    paddingTop: 64,
    paddingBottom: 16,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EBECF4",
    shadowColor: "#454D65",
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  feed: {
    marginHorizontal: 16,
  },
  feedItem: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 8,
    flexDirection: "column",
    marginVertical: 8,
  },
  feedItemHeader: {
    backgroundColor: "#FFF",
    flexDirection: "row",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 18,
    marginRight: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#454D65",
  },
  timestamp: {
    fontSize: 11,
    color: "#C4C6CE",
    marginTop: 4,
  },
  post: {
    marginVertical: 8,
    marginHorizontal: 16,
    fontSize: 14,
    color: "black",
  },
});
