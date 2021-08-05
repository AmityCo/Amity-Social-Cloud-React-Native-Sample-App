/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useRef, useEffect, VFC } from 'react';
import { Alert, View, StyleSheet, Modal, ScrollView } from 'react-native';
import { Text, Surface, Button, ActivityIndicator } from 'react-native-paper';
import { createPost, getPost, updatePost } from '@amityco/ts-sdk';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import handleError from 'utils/handleError';
import useCollection from 'hooks/useCollection';

import { AddPostType, AddPostDataType, UploadedPostImageType, UpdatePostDataType } from 'types';

import Image from './Image';
import AddFile from './AddImage';
import TextInput from '../TextInput';

type AddPostProps = AddPostType & { isEditId: string };

const UpdateUser: VFC<AddPostProps> = ({ visible, onClose, onAddPost, isEditId }) => {
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
      getCuurrentPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditId]);

  const getCuurrentPost = async () => {
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

    if (text === '') {
      Alert.alert('Please input a text!');
      return;
    }

    try {
      setLoading(true);

      if (isEditId !== '') {
        const data: UpdatePostDataType = { data: { text } };

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
      onAddPost();
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
              placeholder="Type anything in your mind."
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
            <Button style={styles.btn} onPress={onSubmit} disabled={loading} mode="contained">
              {loading ? <ActivityIndicator /> : <Text>Submit</Text>}
            </Button>

            <Button style={styles.btn} onPress={onClose} mode="contained">
              <Text>Close</Text>
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

export default UpdateUser;
