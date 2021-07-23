import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { leaveCommunity, joinCommunity } from "@amityco/ts-sdk";
// import Moment from "moment";
// import {
//   Ionicons,
//   FontAwesome5,
//   MaterialCommunityIcons,
// } from "@expo/vector-icons";

// import { observeUser, observeFile, getPost } from "@amityco/ts-sdk";
// import { useEffect } from "react";

const CommunityItem = ({ community, onUpdate, onViewCommunity }) => {
  const [loading, setLoading] = useState(false);
  // const [user, setUser] = useState({});
  // const [file, setFile] = useState({});
  // const [childPost, setChildPost] = useState({});
  // const [postImage, setPostImage] = useState({});

  // useEffect(() => post && observeUser(post.postedUserId, setUser), [post]);

  // useEffect(
  //   () => (user ? observeFile(user.avatarFileId, setFile) : undefined),
  //   [user]
  // );

  // useEffect(() => {
  //   async function fetchChildredPost() {
  //     if (post.children && post.children.length > 0) {
  //       const childrenPost = await getPost(post.children);
  //       setChildPost(childrenPost);
  //     }
  //   }
  //   fetchChildredPost();
  // }, [post]);

  // useEffect(
  //   () =>
  //     childPost
  //       ? observeFile(childPost?.data?.fileId, setPostImage)
  //       : undefined,
  //   [childPost]
  // );

  const createdAt = community.createdAt; // Moment(community.createdAt).format("MMM d, HH:mm");

  const onLeaveCommunity = async () => {
    setLoading(true);
    try {
      const result = await leaveCommunity(community.communityId);

      onUpdate();
      // setCommunities((cms) => [...cms, ...result]);
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
    } finally {
      setLoading(false);
    }
  };

  const onJoinCommunity = async () => {
    setLoading(true);
    try {
      const result = await joinCommunity(community.communityId);

      onUpdate();
      // setCommunities((cms) => [...cms, ...result]);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.feedItem}>
      {/* <Image source={{ uri: file?.fileUrl }} style={styles.avatar} /> */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={styles.name}>{community.displayName}</Text>
            <Text style={styles.userId}>{community.userId}</Text>
            {/* <Text style={styles.timestamp}>{postCreateAt}</Text> */}
          </View>
        </View>
        <Text style={styles.post}>Community Id: {community.communityId}</Text>
        <Text style={styles.post}>Channel Id: {community.channelId}</Text>
        <Text style={styles.post}>
          Is Public: {community.isPublic ? "Yes" : "No"}
        </Text>
        <Text style={styles.post}>Members Count: {community.membersCount}</Text>
        <Text style={styles.post}>Posts Count: {community.postsCount}</Text>
        <Text style={styles.post}>Created At: {createdAt}</Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 15,
          }}
        >
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              padding: 10,
            }}
            disabled={loading}
            onPress={community.isJoined ? onLeaveCommunity : onJoinCommunity}
          >
            {/* <MaterialCommunityIcons
              name="thumb-up-outline"
              size={20}
              color="#838899"
            /> */}
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={{ marginStart: 10 }}>
                {community.isJoined ? "Leave" : "Join"}
              </Text>
            )}
          </Pressable>
          <Pressable
            style={{
              flexDirection: "row",
              alignSelf: "flex-end",
              padding: 10,
            }}
            onPress={() => onViewCommunity(community)}
          >
            <Text style={{ marginStart: 10 }}>View Details</Text>
          </Pressable>
          {/* <FontAwesome5 name="heart" size={20} color="#838899" /> */}
        </View>
      </View>
    </View>
  );
};

export default CommunityItem;

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
  userId: {
    fontSize: 14,
    color: "#C4C6CE",
    marginTop: 4,
  },
  post: {
    marginTop: 16,
    fontSize: 14,
    color: "black",
  },
});
