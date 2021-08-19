/* eslint-disable consistent-return */
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { VFC, useState, useEffect, useRef } from 'react';
import {
  createComment,
  updateComment,
  getComment,
  observeUser,
  createQuery,
  runQuery,
} from '@amityco/ts-sdk';
import {
  StyleSheet,
  Alert,
  View,
  ActivityIndicator,
  TextInput as TextInputType,
  Pressable,
  Keyboard,
} from 'react-native';

import { t } from 'i18n';
import handleError from 'utils/handleError';

import { createCommentType } from 'types';

import TextInput from '../TextInput';

type CommentsType = Pick<Amity.Post, 'postId'> & {
  onRefresh: () => void;
  isEdit: string;
  onCancel: () => void;
  isReply: string;
  parentUserId?: string;
};

const AddComment: VFC<CommentsType> = ({
  postId,
  onRefresh,
  isEdit,
  onCancel,
  isReply,
  parentUserId,
}) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<Amity.User>();
  const textInputRef = useRef<TextInputType>(null);

  useEffect(() => {
    if (isReply !== '' && parentUserId) {
      return observeUser(parentUserId, ({ data: updatedUser }) => {
        setUser(updatedUser);
      });
    }

    setUser(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReply]);

  useEffect(() => {
    if (isEdit !== '') {
      getCurrentComment(isEdit);
    } else if (isReply !== '') {
      getCurrentComment(isReply);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isReply]);

  const getCurrentComment = async (id: string) => {
    try {
      const post = await getComment(id);

      if (isEdit !== '') {
        setText(post.data.text);
      }

      textInputRef?.current?.focus();
    } catch (error) {
      const errorText = handleError(error);
      Alert.alert('Oooops!', errorText, [{ text: t('close') }], { cancelable: false });
    }
  };

  const onComment = async () => {
    setLoading(true);

    try {
      if (isEdit !== '') {
        const updateCommentRequest = {
          data: { text },
        };

        const query = createQuery(updateComment, isEdit, updateCommentRequest);
        runQuery(query);
      } else {
        const createCommentRequest: Parameters<typeof createComment>[0] = {
          data: { text },
          postId,
        };

        if (isReply !== '') {
          createCommentRequest.parentId = isReply;
        }

        const query = createQuery(createComment, createCommentRequest);
        runQuery(query);
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

  const isEditOrReplay = isEdit !== '' || isReply !== '';

  return (
    <View style={styles.container}>
      {isEditOrReplay && (
        <Pressable style={styles.onEditOrReply} onPress={onCancelEdit}>
          <Button mode="text" icon="close-circle-outline" compact uppercase={false}>
            {isEdit !== ''
              ? t('comments.edit_comment')
              : `${t('comments.reply_to')} ${user?.displayName ?? parentUserId}`}
          </Button>
        </Pressable>
      )}
      <View style={styles.inputArea}>
        <TextInput
          mode="flat"
          value={text}
          ref={textInputRef}
          autoCorrect={false}
          autoCapitalize="none"
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
  container: { paddingVertical: 5 },
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
