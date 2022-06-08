import React, { VFC, memo } from 'react';
import { View, TextStyle } from 'react-native';
import ParsedText from 'react-native-parsed-text';

const MessageText: VFC<{ message: Amity.Message; textStyle: TextStyle }> = ({
  message,
  textStyle,
}) => {
  return (
    <View>
      <ParsedText childrenProps={textStyle}>{message?.data?.text ?? ''}</ParsedText>
    </View>
  );
};

export default memo(MessageText);
