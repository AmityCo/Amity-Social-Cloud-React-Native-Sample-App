import * as ImagePicker from 'expo-image-picker';
import { View, Platform, Alert } from 'react-native';
import React, { VFC, useState, useEffect } from 'react';
import { createFile, runQuery, createQuery } from '@amityco/ts-sdk';
import { Button, Text, ProgressBar, useTheme } from 'react-native-paper';

import { t } from 'i18n';
import { uriToBlob } from 'utils';
import { alertError } from 'utils/alerts';

import { addFileStyles } from './styles';

type AddPostImageProps = {
  onAddImage: (image: Amity.File) => void;
};

const AddPostImage: VFC<AddPostImageProps> = ({ onAddImage }) => {
  const [progress, onProgress] = useState(0);

  const {
    colors: { primary: primaryColor },
  } = useTheme();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const selectFile = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.cancelled) {
        const blob = await uriToBlob(result.uri);

        const fileObject = {
          ...blob,
          uri: result.uri,
          name: result.uri.split('/').pop(),
          type: `image/${result.uri.split('.').pop()}`,
        };

        const data = new FormData();
        data.append('file', fileObject);

        runQuery(createQuery(createFile, data, onProgress), ({ data: fileData, error }) => {
          onProgress(0);

          if (fileData) {
            onAddImage(fileData);

            Alert.alert('file successfully uploaded!');
          } else if (error) {
            alertError(error);
          }
        });
      }
    } catch (error) {
      alertError(error);
    } finally {
      onProgress(0);
    }
  };

  return (
    <View style={addFileStyles.container}>
      {progress > 0 ? (
        <ProgressBar
          progress={progress / 100}
          style={addFileStyles.progressBar}
          color={primaryColor}
        />
      ) : (
        <Button
          disabled={progress > 0}
          mode="outlined"
          style={addFileStyles.btn}
          compact
          onPress={selectFile}
        >
          <Text>{t('posts.attach_image')}</Text>
        </Button>
      )}
    </View>
  );
};

export default AddPostImage;
