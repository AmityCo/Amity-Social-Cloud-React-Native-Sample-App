import React, { useState, useEffect } from "react";
import Moment from "moment";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  observeUser,
  observeFile,
  addReaction,
  removeReaction,
  deleteComment,
} from "@amityco/ts-sdk";

const CommentItem = ({ comment }) => {
  const [user, setUser] = useState({});
  const [file, setFile] = useState({});
  const [myReaction, setMyReaction] = useState([]);
  const [likeColor, setLikeColor] = useState("");

  useEffect(() => comment && observeUser(comment.userId, setUser), [comment]);
  useEffect(
    () => (user ? observeFile(user.avatarFileId, setFile) : undefined),
    [user]
  );

  useEffect(() => {
    if (comment.myReactions == null) {
      setMyReaction([]);
    } else {
      setMyReaction(comment.myReactions);
    }
  }, [comment]);

  useEffect(() => {
    updateColor();
  }, [myReaction]);

  useEffect(() => console.log(comment), [comment]);

  const updateColor = () => {
    if (myReaction.includes("like")) {
      setLikeColor("#5890FF");
    } else {
      setLikeColor("#838899");
    }
  };

  const reactTheComment = async () => {
    try {
      var index = myReaction.indexOf("like");
      if (index != -1) {
        myReaction.splice(index, 1);
        await removeReaction("comment", comment.commentId, "like");
      } else {
        myReaction.push("like");
        await addReaction("comment", comment.commentId, "like");
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

  const deleteTheComment = () => {
    try {
      deleteComment(comment.commentId);
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

  const commentCreateAt = Moment(comment.createdAt).format("MMM d, HH:mm");

  return (
    <View style={styles.commentItem}>
      <View style={styles.commentItemHeader}>
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
              <Text style={styles.timestamp}>{commentCreateAt}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteTheComment()}>
              <Ionicons
                name="ellipsis-vertical-sharp"
                size={20}
                color="#C4C6CE"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.comment}>{comment.data.text}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            reactTheComment();
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
        <TouchableOpacity onPress={() => console.log("reply")}>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-end",
              padding: 10,
            }}
          >
            <Text style={{ marginStart: 10, color: "#0091EA" }}>Reply</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentItem;

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
  comment: {
    marginHorizontal: 16,
  },
  commentItem: {
    backgroundColor: "#FFF",
    padding: 8,
    flexDirection: "column",
    borderRadius: 15,
    marginBottom: 4,
  },
  commentItemHeader: {
    backgroundColor: "#FFF",
    flexDirection: "row",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 18,
    marginRight: 16,
    backgroundColor: "#C4C6CE",
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
  comment: {
    marginVertical: 8,
    fontSize: 14,
    color: "black",
  },
  textOption: {
    marginBottom: 10,
    fontSize: 20,
    color: "#0091EA",
  },
});
