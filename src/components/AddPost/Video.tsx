import React, { FC } from 'react';
import { Pressable, Text } from 'react-native';

import { fileStyles } from './styles';

type PostVideoType = {
  file: Amity.File;
  onOpen?: () => void;
};

const PostFile: FC<PostVideoType> = ({ file, onOpen }) => {
  return (
    <Pressable style={fileStyles.view} onPress={onOpen}>
      <Text style={fileStyles.text} numberOfLines={3}>
        {file.attributes.name}
      </Text>
    </Pressable>
  );
};

export default PostFile;
