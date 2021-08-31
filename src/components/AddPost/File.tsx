import React, { VFC } from 'react';
import { Pressable, Text } from 'react-native';

import { fileStyles } from './styles';

type PostFileType = {
  file: Amity.File;
  onOpen?: () => void;
};

const PostFile: VFC<PostFileType> = ({ file, onOpen }) => {
  return (
    <Pressable style={fileStyles.view} onPress={onOpen}>
      <Text style={fileStyles.text} numberOfLines={3}>
        {file.attributes.name}
      </Text>
    </Pressable>
  );
};

export default PostFile;
