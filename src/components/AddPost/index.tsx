import { View, Modal, ScrollView } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import React, { useState, useEffect, VFC, useCallback } from 'react';
import { createPost, getPost, updatePost, createQuery, runQuery } from '@amityco/ts-sdk';

import { t } from 'i18n';
import { alertError } from 'utils/alerts';
import useCollection from 'hooks/useCollection';

import File from './File';
import Image from './Image';
import AddFile from './AddFile';
import AddImage from './AddImage';
import TextInput from '../TextInput';

import styles from './styles';

export type AddPostType = {
  isEditId: string;
  onClose: () => void;
  targetType: Amity.PostTargetType;
  targetId: string;
};

const AddPost: VFC<AddPostType> = ({ onClose, isEditId, targetType, targetId }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const [images, addImage, , , resetImages] = useCollection<Amity.File>([], (arr, el) =>
    arr.findIndex(({ fileId }) => fileId === el.fileId),
  );

  const [files, addFile, , , resetFiles] = useCollection<Amity.File>([], (arr, el) =>
    arr.findIndex(({ fileId }) => fileId === el.fileId),
  );

  useEffect(() => {
    setText('');
    resetFiles();
    resetImages();
  }, [resetFiles, resetImages]);

  const getCurrentPost = useCallback(async () => {
    const query = createQuery(getPost, isEditId);

    runQuery(query, ({ data, error }) => {
      if (data) {
        setText(data.data.text);
      } else if (error) {
        alertError(error, () => {
          onClose();
        });
      }
    });
  }, [isEditId, onClose]);

  useEffect(() => {
    if (isEditId !== '') {
      getCurrentPost();
    }
  }, [getCurrentPost, isEditId]);

  const onSubmit = async () => {
    setLoading(true);

    if (isEditId !== '') {
      const data = { data: { text } };

      runQuery(
        createQuery(updatePost, isEditId, data),
        ({ data: postData, loading: loading_, error }) => {
          setLoading(!!loading_);

          if (postData) {
            onClose();
          } else if (error) {
            alertError(error, () => {
              onClose();
            });
          }
        },
      );
    } else {
      const data: Parameters<typeof createPost>[0] = {
        data: { text },
        targetType,
        targetId,
      };

      if (images.length) {
        data.attachments = images.map(({ fileId }) => ({ type: 'image', fileId }));
      } else if (files.length) {
        data.attachments = files.map(({ fileId }) => ({ type: 'file', fileId }));
      }

      runQuery(createQuery(createPost, data), ({ data: postData, error, loading: loading_ }) => {
        setLoading(!!loading_);

        if (postData) {
          onClose();
        } else if (error) {
          alertError(error);
        }
      });
    }
  };

  return (
    <Modal transparent visible animationType="slide" onDismiss={onClose} onRequestClose={onClose}>
      <Surface style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.centeredView}>
          <View style={styles.content}>
            <TextInput
              value={text}
              multiline
              style={styles.postInput}
              containerStyle={styles.postInputContainer}
              placeholder={t('posts.add_post_placeholder')}
              onChangeText={setText}
            />

            {isEditId === '' && (
              <View style={styles.filesContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  {images.length === 0 && <AddFile onAddFile={addFile} />}
                  {files.length === 0 && <AddImage onAddImage={addImage} />}
                </View>

                <View style={styles.filesArea}>
                  {images.map(img => (
                    <Image key={`${img.fileId}`} file={img} />
                  ))}
                  {files.map(img => (
                    <File key={`${img.fileId}`} file={img} />
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={styles.btnArea}>
            <Button
              style={styles.btn}
              disabled={loading}
              mode="contained"
              loading={loading}
              onPress={onSubmit}
            >
              {t(isEditId === '' ? 'add' : 'update')}
            </Button>

            <Button style={styles.btn} mode="contained" onPress={onClose}>
              <Text>{t('cancel')}</Text>
            </Button>
          </View>
        </ScrollView>
      </Surface>
    </Modal>
  );
};

export default AddPost;
