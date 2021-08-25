import React, { VFC } from 'react';
import { Pressable, ImageBackground } from 'react-native';

import { imageStyles } from './styles';

type PostFileType = {
  file: Amity.File;
  onOpen?: () => void;
};

const PostImage: VFC<PostFileType> = ({ file, onOpen }) => {
  return (
    <Pressable style={imageStyles.view} onPress={onOpen}>
      <ImageBackground
        source={{ uri: file.fileUrl }}
        imageStyle={imageStyles.img}
        style={imageStyles.bg}
      />
    </Pressable>
  );
};

export default PostImage;
