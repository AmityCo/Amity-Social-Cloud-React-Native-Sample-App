import React, { VFC } from 'react';
import { Pressable, ImageBackground, StyleSheet } from 'react-native';

type PostFileType = {
  file: Amity.File;
  onOpen?: () => void;
};

const PostImage: VFC<PostFileType> = ({ file, onOpen }) => {
  return (
    <Pressable style={styles.view} onPress={onOpen}>
      <ImageBackground source={{ uri: file.fileUrl }} imageStyle={styles.img} style={styles.bg} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  view: {
    width: 75,
    height: 75,
  },
  bg: {
    width: 75,
    height: 75,
    borderRadius: 5,
    marginBottom: 5,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  img: { borderRadius: 6 },
});

export default PostImage;
