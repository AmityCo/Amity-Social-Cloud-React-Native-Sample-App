/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect, VFC } from 'react';
import { Alert, View, StyleSheet, Modal, ScrollView } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { createPost, getPost, updatePost } from '@amityco/ts-sdk';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import handleError from 'utils/handleError';
import useCollection from 'hooks/useCollection';

import { AddFeedType, AddPostDataType, UploadedPostImageType } from 'types';

import Image from './Image';
import AddFile from './AddImage';
import TextInput from '../TextInput';

const AddPost: VFC<AddFeedType> = ({ visible, onClose, isEditId }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const { client } = useAuth();

  const [images, addImage, remImage, toggleImages, resetImages] =
    useCollection<UploadedPostImageType>([], (arr, el) =>
      arr.findIndex(({ fileId }) => fileId === el.fileId),
    );

  useEffect(() => {
    if (!visible) {
      setText('');
      resetImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (isEditId !== '' && visible) {
      getCurrentPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditId]);

  const getCurrentPost = async () => {
    try {
      const post = await getPost(isEditId);

      setText(post.data.text);
    } catch (error) {
      const errorText = handleError(error);
      Alert.alert(
        'Oooops!',
        errorText,
        [
          {
            text: t('close'),
            onPress: async () => {
              onClose();
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  const onSubmit = async () => {
    if (!client.userId) {
      Alert.alert('UserId is not reachable!');
    }

    try {
      setLoading(true);

      if (isEditId !== '') {
        const data = { data: { text } };

        await updatePost(isEditId, data);
      } else {
        const data: AddPostDataType = {
          data: { text },
          targetType: 'user',
          targetId: client.userId!,
        };

        if (images.length) {
          data.data.images = images.map(({ fileId }) => fileId);
        }

        await createPost(data);
      }

      onClose();
    } catch (error) {
      const errorText = handleError(error);

      Alert.alert(errorText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      onDismiss={onClose}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Surface style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.centeredView}>
          <View style={styles.content}>
            <TextInput
              value={text}
              multiline
              onChangeText={setText}
              style={styles.postInput}
              containerStyle={styles.postInputContainer}
              placeholder={t('posts.add_post_placeholder')}
            />

            {isEditId === '' && (
              <View style={styles.filesContainer}>
                <AddFile onAddImage={addImage} />

                <View style={styles.filesArea}>
                  {images.map(img => (
                    <Image file={img} key={`${img.fileId}`} />
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={styles.btnArea}>
            <Button
              style={styles.btn}
              onPress={onSubmit}
              disabled={loading}
              mode="contained"
              loading={loading}
            >
              {t(isEditId === '' ? 'add' : 'update')}
            </Button>

            <Button style={styles.btn} onPress={onClose} mode="contained">
              <Text>{t('cancel')}</Text>
            </Button>
          </View>
        </ScrollView>
      </Surface>
    </Modal>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // flexGrow: 1,
  },

  content: {
    width: '100%',
    alignItems: 'center',
  },

  postInputContainer: {
    width: '90%',
    height: 160,
    textAlignVertical: 'top',
    padding: 10,
    marginBottom: 20,
  },

  postInput: {
    flex: 1,
    // height: 150,
    textAlignVertical: 'top',
    fontSize: 18,
  },

  filesContainer: {
    width: '100%',
    marginBottom: 15,
  },

  filesArea: {
    justifyContent: 'flex-start',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '90%',
    // backgroundColor: "black",
  },

  btnArea: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  btn: {
    width: 120,
  },
});

export default AddPost;
