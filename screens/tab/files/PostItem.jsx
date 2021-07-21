import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Moment from "moment";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { observeUser, observeFile, getPost } from "@amityco/ts-sdk";
import { useEffect } from "react";

const PostItem = ({ post }) => {
  const [user, setUser] = useState({});
  const [file, setFile] = useState({});
  const [childPost, setChildPost] = useState({});
  const [postImage, setPostImage] = useState({});

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

  useEffect(
    () =>
      childPost
        ? observeFile(childPost?.data?.fileId, setPostImage)
        : undefined,
    [childPost]
  );

  const postCreateAt = Moment(post.createdAt).format("MMM d, HH:mm");

  return (
    <View style={styles.feedItem}>
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
        </View>
        <Text style={styles.post}>{post.data.text}</Text>
        {post.children.length > 0 ? (
          <Image
            source={{ uri: postImage?.fileUrl }}
            style={{ width: 100, height: 100 }}
            resizeMode="stretch"
          />
        ) : null}

        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
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
              color="#838899"
            />
            <Text style={{ marginStart: 10 }}>Like</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-end",
              padding: 10,
            }}
          >
            <FontAwesome5 name="heart" size={20} color="#838899" />
            <Text style={{ marginStart: 10 }}>Love</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostItem;

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
    flexDirection: "row",
    marginVertical: 8,
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
    marginTop: 16,
    fontSize: 14,
    color: "black",
  },
});
