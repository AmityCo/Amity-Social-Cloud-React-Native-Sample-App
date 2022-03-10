import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { VFC, useState, useEffect, useRef, useCallback } from 'react';
import {
  createComment,
  updateComment,
  getComment,
  observeUser,
  createQuery,
  runQuery,
} from '@amityco/ts-sdk';
import {
  View,
  ActivityIndicator,
  TextInput as TextInputType,
  Pressable,
  Keyboard,
} from 'react-native';

import { t } from 'i18n';
import { alertError } from 'utils/alerts';

import TextInput from '../TextInput';

import styles from './styles';

type AddCommentType = Pick<Amity.Post, 'postId'> & {
  onRefresh: () => void;
  isEdit: string;
  onCancel: () => void;
  isReply: string;
  parentUserId?: string;
};

const AddComment: VFC<AddCommentType> = ({
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

  const navigation = useNavigation();

  useEffect(() => {
    if (isReply !== '' && parentUserId) {
      return observeUser(parentUserId, ({ data: updatedUser }) => {
        setUser(updatedUser);
      });
    }

    return setUser(undefined);
  }, [isReply, parentUserId]);

  const getCurrentComment = useCallback(
    async (id: string) => {
      runQuery(createQuery(getComment, id), ({ data, error }) => {
        if (data) {
          if (isEdit !== '') {
            setText(data.data.text);
          }

          textInputRef?.current?.focus();
        } else if (error) {
          alertError(error);
        }
      });
    },
    [isEdit],
  );

  useEffect(() => {
    if (isEdit !== '') {
      getCurrentComment(isEdit);
    } else if (isReply !== '') {
      getCurrentComment(isReply);
    }
  }, [getCurrentComment, isEdit, isReply]);

  const onComment = async () => {
    setLoading(true);

    if (isEdit !== '') {
      const updateCommentRequest = {
        data: { text },
      };

      const query = createQuery(updateComment, isEdit, updateCommentRequest);
      runQuery(query, ({ data, loading: loading_, error }) => {
        setLoading(!!loading_);

        if (data) {
          setText('');
          onRefresh();
        } else if (error) {
          alertError(error);
        }
      });
    } else {
      const createCommentRequest: Parameters<typeof createComment>[0] = {
        data: { text },
        referenceId: postId,
        referenceType: 'post',
      };

      if (isReply !== '') {
        createCommentRequest.parentId = isReply;
      }

      const query = createQuery(createComment, createCommentRequest);
      runQuery(query, ({ data, loading: loading_, error }) => {
        setLoading(!!loading_);

        if (data) {
          setText('');
          onRefresh();

          if (isReply !== '') {
            navigation.navigate('Comments', { postId, parentId: isReply });
          }
        } else if (error) {
          alertError(error);
        }
      });
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
          ref={textInputRef}
          mode="flat"
          value={text}
          autoCorrect={false}
          autoCapitalize="none"
          style={styles.textInput}
          outlineColor="transparent"
          underlineColor="transparent"
          containerStyle={styles.textInputContainer}
          placeholder={t('comments.add_comment_placeholder')}
          onChangeText={setText}
        />
        <Button disabled={loading} style={styles.btn} onPress={onComment}>
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

export default AddComment;
