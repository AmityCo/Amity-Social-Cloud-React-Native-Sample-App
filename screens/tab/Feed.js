import React, { useState } from "react";
import { Header } from "react-native-elements";
import { View, Text, Alert } from "react-native";

import AddPost from "./AddPost";

function FeedScreen() {
  const [showAddPost, setShowAddPost] = useState(false);

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
      <Text>FeedScreen!</Text>

      <AddPost
        onAddPost={() => {
          setShowAddPost(false);
          setTimeout(() => {
            console.log(123);
            Alert.alert("successfull!");
          }, 1000);
        }}
        visible={showAddPost}
        onClose={() => setShowAddPost(false)}
      />
    </View>
  );
}

export default FeedScreen;
