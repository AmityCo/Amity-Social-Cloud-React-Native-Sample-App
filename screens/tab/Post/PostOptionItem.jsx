import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Divider } from "react-native-elements";

function PostOptionItem({ optionItem, onPressOption }) {
  return (
    <View style={styles.optionContent}>
      <TouchableOpacity onPress={() => onPressOption(optionItem.id)}>
        <Text style={styles.textOption}>{optionItem.name}</Text>
      </TouchableOpacity>
      <Divider orientation="vertical" />
    </View>
  );
}

const styles = StyleSheet.create({
  optionContent: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
  },
  textOption: {
    marginBottom: 10,
    fontSize: 20,
    color: "#0091EA",
  },
});

export default PostOptionItem;
