import React, { useRef, useState } from "react";
import { View, Text, Button, KeyboardAvoidingView } from "react-native";
import { Header, Divider } from "react-native-elements";
import ActionSheet from "react-native-actions-sheet";
import { TouchableOpacity, Alert } from "react-native";
import { TextInput } from "react-native";
import { ApplicationStyles } from "../../styles/AppStyles";

import ToggleSwitch from "toggle-switch-react-native";

import { createPost } from "@amityco/ts-sdk";

import { client } from "../LoginPage";

function FeedScreen() {
  const [isPostFile, setIsPostFile] = useState(false);
  const [isCommunityPost, setIsCommunityPost] = useState(false);

  const [postStatus, setPostStatusChange] = useState("");

  const createPostSheet = useRef();

  const onSubmitPost = async (statusText) => {
    try {
      await createPost({
        data: { text: statusText },
        targetType: "user",
        targetId: client.userId,
      });
      createPostSheet.current.setModalVisible(false);
      Alert.alert("successfull!");
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        backgroundColor="#26cb7c"
        centerComponent={{ text: "Feed", style: { color: "#fff" } }}
        rightComponent={{
          icon: "description",
          color: "#fff",
          onPress: () => createPostSheet.current.setModalVisible(),
        }}
      />
      <Text>FeedScreen!</Text>

      <KeyboardAvoidingView>
        <ActionSheet ref={createPostSheet} indicatorColor="#db0707">
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#F8F8F8",
              padding: 15,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <TouchableOpacity style={{ marginEnd: 10, alignItems: "center" }}>
              <Text style={{ color: "#0091EA", fontSize: 18 }}>Cancel</Text>
            </TouchableOpacity>
            <Text
              style={{
                textAlign: "center",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              Create Post
            </Text>
            <TouchableOpacity
              style={{ marginEnd: 10, alignItems: "center" }}
              onPress={() => onSubmitPost(postStatus)}
            >
              <Text style={{ color: "#0091EA", fontSize: 18 }}>Post</Text>
            </TouchableOpacity>
          </View>
          <Divider orientation="horizontal" />

          <View style={{ paddingHorizontal: 15, marginTop: 30 }}>
            <Text style={{ fontSize: 18 }}>What's on your mind?</Text>
            <TextInput
              style={ApplicationStyles.postInput}
              placeholder="Type anything in your mind."
              multiline={true}
              onChangeText={setPostStatusChange}
              value={postStatus}
            />

            <TouchableOpacity style={{ marginTop: 10, alignItems: "center" }}>
              <Text style={{ color: "#0091EA" }}>Attach Image</Text>
            </TouchableOpacity>
            <Text
              style={{
                margin: 8,
                color: "#a9a9a9",
                textAlign: "center",
              }}
            >
              0 image attached
            </Text>
            <View style={{ flexDirection: "row", marginTop: 30 }}>
              <ToggleSwitch
                labelStyle={{ fontSize: 18 }}
                label="File Post"
                onColor="#26cb7c"
                isOn={isPostFile}
                onToggle={(val) => {
                  setIsPostFile(val);
                }}
              />
            </View>
            <View style={{ flexDirection: "row", marginTop: 30 }}>
              <ToggleSwitch
                labelStyle={{ fontSize: 18 }}
                label="Community Post"
                onColor="#26cb7c"
                isOn={isCommunityPost}
                onToggle={(val) => {
                  setIsCommunityPost(val);
                }}
              />
            </View>

            <TextInput
              style={{
                alignItems: "flex-start",
                fontSize: 16,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: "#DDDDDD",
                paddingHorizontal: 15,
                paddingVertical: 8,
                marginVertical: 30,
              }}
              placeholder="Community id"
            />
          </View>
        </ActionSheet>
      </KeyboardAvoidingView>
    </View>
  );
}

export default FeedScreen;
