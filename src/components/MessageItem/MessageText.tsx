import { View } from 'react-native';
import React, { VFC, memo } from 'react';
import { Text } from 'react-native-paper';

const MessageText: VFC<{ message: Amity.Message }> = ({ message }) => {
  return (
    <View>
      <Text>{message?.data?.text ?? ''}</Text>
    </View>
  );
};

export default memo(MessageText);
