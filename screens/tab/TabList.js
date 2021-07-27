import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Header } from "react-native-elements";

import FeedScreen from "./Post";
import CommunitiesScreen from "./Communities";

const Tab = createBottomTabNavigator();

function ChatScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Header
        backgroundColor="#26cb7c"
        centerComponent={{ text: "Chat", style: { color: "#fff" } }}
      />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Chat!</Text>
      </View>
    </View>
  );
}

function TabList() {
  getTabBarVisibility = (route) => {
    const routeName = route.state
      ? route.state.routes[route.state.index].name
      : "";

    if (routeName === "CommentScreen") {
      return false;
    }

    return true;
  };

  return (
    <Tab.Navigator>
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Communities" component={CommunitiesScreen} />
    </Tab.Navigator>
  );
}

export default TabList;
