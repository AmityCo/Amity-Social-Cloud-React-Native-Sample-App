import React from "react";
import { Text, View } from "react-native";

const componentName = ({ comment }) => {
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
                console.log(post.postId);
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
    </View>
  );
};

export default componentName;
