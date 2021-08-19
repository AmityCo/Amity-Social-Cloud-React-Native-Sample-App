import MimeTypes from 'mime-types';
import React, { VFC, useState } from 'react';
import { createFile } from '@amityco/ts-sdk';
import * as DocumentPicker from 'expo-document-picker';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, ProgressBar, useTheme } from 'react-native-paper';

import { t } from 'i18n';
import handleError from 'utils/handleError';

import { UploadedPostFileType } from 'types';

type AddPostFileProps = {
  onAddFile: (image: UploadedPostFileType) => void;
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
        const fileData = {
          name: result.name,
          size: result.size,
          uri: result.uri,
          type: MimeTypes.lookup(result.name || result.uri),
        };

        const data: any = new FormData();

        data.append('file', fileData);
        data.getAll = data.getParts;

        const response = await createFile(data, onProgress);

        const res: any = response;

        onAddFile({ ...res[0], uri: result.uri });

        Alert.alert('file successfully uploaded!');
      }
    } catch (error) {
      const errorText = handleError(error);

      Alert.alert(errorText);
    } finally {
      onProgress(0);
    }
  };

  return (
    <View style={styles.container}>
      {progress > 0 ? (
        <ProgressBar progress={progress / 100} style={styles.progressBar} color={primaryColor} />
      ) : (
        <Button
          onPress={selectFile}
          disabled={progress > 0}
          mode="outlined"
          style={styles.btn}
          compact
        >
          <Text>{t('posts.attach_file')}</Text>
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 10, alignItems: 'center' },
  btn: { justifyContent: 'center' },
  progressBar: { width: 100, height: 3, marginTop: 5 },
});

export default AddPostFile;
