import MimeTypes from 'mime-types';
import { View, Alert } from 'react-native';
import React, { VFC, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { createFile, runQuery, createQuery } from '@amityco/ts-sdk';
import { Text, Button, ProgressBar, useTheme } from 'react-native-paper';

import { t } from 'i18n';
import { uriToBlob } from 'utils';
import { alertError } from 'utils/alerts';

import { addFileStyles } from './styles';

type AddPostFileProps = {
  onAddFile: (image: Amity.File) => void;
};

const AddPostFile: VFC<AddPostFileProps> = ({ onAddFile }) => {
  const [progress, onProgress] = useState(0);

  const {
    colors: { primary: primaryColor },
  } = useTheme();

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        // type: 'image/*',
        copyToCacheDirectory: false,
        multiple: false,
      });

      if (result.type === 'success') {
        const blob = await uriToBlob(result.uri);

        const fileObject = {
          ...blob,
          name: result.name,
          size: result.size,
          uri: result.uri,
          type: MimeTypes.lookup(result.name || result.uri) || 'text/plain',
        };

        const data = new FormData();

        data.append('file', fileObject);

        runQuery(createQuery(createFile, data, onProgress), ({ data: fileData, error }) => {
          onProgress(0);

          if (fileData) {
            onAddFile(fileData);

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
          <Text>{t('posts.attach_file')}</Text>
        </Button>
      )}
    </View>
  );
};

export default AddPostFile;
