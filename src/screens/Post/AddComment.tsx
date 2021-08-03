import { Button, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { VFC, useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Alert,
  View,
  ActivityIndicator,
  TextInput as TextInputType,
  Pressable,
  Keyboard,
} from 'react-native';
import { createComment, updateComment, getComment } from '@amityco/ts-sdk';

import { TextInput } from 'components';

import { t } from 'i18n';
import handleError from 'utils/handleError';

type CommentsType = Pick<ASC.Post, 'postId'> & {
  onRefresh: () => void;
  isEditCommentId: string;
  onCancel: () => void;
};

const AddComment: VFC<CommentsType> = ({ postId, onRefresh, isEditCommentId, onCancel }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const textInputRef = useRef<TextInputType>(null);

  useEffect(() => {
    if (isEditCommentId !== '') {
      getCuurrentComment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditCommentId]);

  const getCuurrentComment = async () => {
    try {
      const post = await getComment(isEditCommentId);

      textInputRef?.current?.focus();
      setText(post.data.text);
    } catch (error) {
      const errorText = handleError(error);
      Alert.alert('Oooops!', errorText, [{ text: t('close') }], { cancelable: false });
    }
  };

  const onComment = async () => {
    setLoading(true);

    try {
      if (isEditCommentId !== '') {
        const updateCommentRequest = {
          data: { text },
        };

        await updateComment(isEditCommentId, updateCommentRequest);
      } else {
        const createCommentRequest = {
          data: { text },
          referenceId: postId,
          referenceType: 'post' as ASC.CommentReferenceType,
        };

        await createComment(createCommentRequest);
      }

      setText('');
      onRefresh();
    } catch (error) {
      const errorText = handleError(error);

      Alert.alert(errorText);
    } finally {
      setLoading(false);
    }
  };

  const onCancelEdit = () => {
    onCancel();
    setText('');
    Keyboard.dismiss();
  };

  return (
    <View>
      {isEditCommentId !== '' && (
        <Pressable style={styles.onEditOrReply} onPress={onCancelEdit}>
          <MaterialCommunityIcons size={20} name="close-circle-outline" />
          <Text>Edit Comment</Text>
        </Pressable>
      )}
      <View style={styles.inputArea}>
        <TextInput
          mode="flat"
          value={text}
          ref={textInputRef}
          onChangeText={setText}
          style={styles.textInput}
          outlineColor="transparent"
          underlineColor="transparent"
          containerStyle={styles.textInputContainer}
          placeholder={t('comments.add_comment_placeholder')}
        />
        <Button onPress={onComment} disabled={loading} style={styles.btn}>
          {loading ? (
            <ActivityIndicator size={30} />
          ) : (
            <MaterialCommunityIcons size={30} name="send" />
          )}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  onEditOrReply: { paddingStart: 5, flexDirection: 'row' },
  inputArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    flex: 1,
    borderRadius: 5,
    marginStart: 5,
  },
  textInputContainer: { flex: 1, padding: 2, borderRadius: 5, height: 50 },
  btn: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddComment;
