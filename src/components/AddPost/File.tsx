import React, { VFC } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

type PostFileType = {
  file: Amity.File;
  onOpen?: () => void;
};

const PostFile: VFC<PostFileType> = ({ file, onOpen }) => {
  return (
    <Pressable style={styles.view} onPress={onOpen}>
      <Text style={styles.text} numberOfLines={3}>
        {file.attributes.name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  view: {
    width: 75,
    height: 75,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
    padding: 5,
    marginBottom: 5,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  text: { textAlign: 'center' },
});

export default PostFile;
