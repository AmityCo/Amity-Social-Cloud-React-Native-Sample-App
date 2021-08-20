import { createFile } from '@amityco/ts-sdk';
import * as ImagePicker from 'expo-image-picker';
import React, { VFC, useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { Button, Text, ProgressBar, useTheme } from 'react-native-paper';
// import FormData from 'react-native/Libraries/Network/FormData';

import { t } from 'i18n';
import { uriToBlob } from 'utils';
import getErrorMessage from 'utils/getErrorMessage';

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

        const fileData = {
          ...blob,
          uri: result.uri,
          name: result.uri.split('/').pop(),
          type: `image/${result.uri.split('.').pop()}`,
        };

        const data = new FormData();
        data.append('file', fileData);

        data.getAll = data.getParts;

        const response = await createFile(data, onProgress);

        onAddImage({ ...response[0] });

        Alert.alert('file successfully uploaded!');
      }
    } catch (error) {
      const errorText = getErrorMessage(error);

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
          <Text>{t('posts.attach_image')}</Text>
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

export default AddPostImage;
