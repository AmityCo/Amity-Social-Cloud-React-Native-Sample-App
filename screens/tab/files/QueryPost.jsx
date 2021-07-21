import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";

import { queryPosts } from "@amityco/ts-sdk";
import { client } from "../../LoginPage";

import PostItem from "./PostItem";

const FeedPosts = () => {
  const [postData, setPostData] = useState([]);

  useEffect(() => {
    onQueryPost();
  }, []);

  const onQueryPost = async () => {
    try {
      const query = {
        targetId: client.userId,
        targetType: "user",
        sortBy: "lastCreated",
        feedType: "published",
      };
      const queryPostFromApi = await queryPosts(query);
      // console.log(queryPostFromApi)
      setPostData(...postData, queryPostFromApi);
    } catch (error) {
      //  console.error(error, error.name, error.message, error.toString());
      if (error.response) {
        // Request made and server responded
        console.log("error response", error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log("error request", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("error message", error.message);
      }
    }
  };

  return (
    <FlatList
      style={styles.feed}
      data={postData}
      renderItem={({ item }) => <PostItem post={item} />}
      keyExtractor={(item) => item.postId}
      showsVerticalScrollIndicator={false}
    ></FlatList>
  );
};

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
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 16,
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
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
    color: "#838899",
  },
  postImage: {
    width: undefined,
    height: 150,
    borderRadius: 5,
    marginVertical: 16,
  },
});

posts = [
  {
    id: "1",
    name: "Joe McKay",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    timestamp: 1569109273726,
    avatar: "",
    image: "",
  },
  {
    id: "2",
    name: "Karyn Kim",
    text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    timestamp: 1569109273726,
    avatar: "",
    image: "",
  },
  {
    id: "3",
    name: "Emerson Parsons",
    text: "Amet mattis vulputate enim nulla aliquet porttitor lacus luctus. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant.",
    timestamp: 1569109273726,
    avatar: "",
    image: "",
  },
  {
    id: "4",
    name: "Kathie Malone",
    text: "At varius vel pharetra vel turpis nunc eget lorem. Lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor. Adipiscing tristique risus nec feugiat in fermentum.",
    timestamp: 1569109273726,
    avatar: "",
    image: "",
  },
];

export default FeedPosts;
