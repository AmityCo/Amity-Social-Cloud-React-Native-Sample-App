import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";

import { ApplicationStyles } from "../styles/AppStyles";

const AppButton = ({ text, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={ApplicationStyles.btnContainerStyle}>
        <Text style={ApplicationStyles.btnTextStyle}> {text} </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AppButton;
