import { createFile } from '@amityco/ts-sdk';
import * as ImagePicker from 'expo-image-picker';
import React, { VFC, useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { Button, Text, ProgressBar, useTheme } from 'react-native-paper';

import handleError from 'utils/handleError';

import { UploadedPostImageType } from 'types';

type AddPostImageProps = {
  onAddImage: (image: UploadedPostImageType) => void;
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
        const fileData = {
          uri: result.uri,
          name: result.uri.split('/').pop(),
          type: `image/${result.uri.split('.').pop()}`,
        };
        const data: any = new FormData();
        data.append('file', fileData);

        // TODO
        //         how about your add in a .d.ts file

        // declare class FormData {
        //   getAll: FormData['getParts']
        // }

        // and on the other side, do simply a standard polyfill approach such as:

        // if (!FormData.prototype.getAll)
        //   FormData.prototype.getAll = FormData.prototype.getParts
        data.getAll = data.getParts;

        // TODO handle AbortController
        const response = await createFile(data, onProgress);
        const res: any = response;
        // TODO Element implicitly has an 'any' type because expression of type '0' can't be used to index type 'FilePayload<any>'.
        // Property '0' does not exist on type 'FilePayload<any>'.
        onAddImage({ ...res[0], uri: result.uri });

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
        <Button onPress={selectFile} disabled={progress > 0} mode="outlined" style={styles.btn}>
          <Text>Attach Image</Text>
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 10, alignItems: 'center' },
  btn: { height: 50, justifyContent: 'center', width: 150 },
  progressBar: { width: 100, height: 3, marginTop: 5 },
});

export default AddPostImage;
