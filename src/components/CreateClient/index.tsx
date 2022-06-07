import Constants from 'expo-constants';
import { View, Modal, Pressable } from 'react-native';
import React, { useEffect, useState, VFC, useCallback } from 'react';
import { Surface, Button } from 'react-native-paper';

import { t } from 'i18n';
import usePreferences from 'hooks/usePreferences';

import TextInput from '../TextInput';

import styles from './styles';

type CreateClientType = {
  onClose: () => void;
};

const CreateClient: VFC<CreateClientType> = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const { setClientCredentials } = usePreferences();
  const [loadCreateClient, setLoadCreateClient] = useState(false);
  const [apiKey, setApiKey] = useState(Constants.manifest?.extra?.apiKey || '');
  const [apiRegion, setSetApiRegion] = useState(Constants.manifest?.extra?.apiRegion || 'sg');

  const onSubmit = useCallback(async () => {
    setClientCredentials(apiKey, apiRegion);

    onClose();
  }, [apiKey, apiRegion, onClose, setClientCredentials]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadCreateClient) {
        setLoading(false);
      } else {
        onSubmit();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [loadCreateClient, onSubmit]);

  return loading ? (
    <Pressable
      style={styles.loadingArea}
      onPress={() => {
        setLoadCreateClient(true);
      }}
    />
  ) : (
    <Modal transparent visible animationType="slide" onDismiss={onClose} onRequestClose={onClose}>
      <Surface style={styles.container}>
        <React.Fragment>
          <View style={styles.content}>
            <TextInput
              value={apiKey}
              autoCorrect={false}
              style={styles.postInput}
              containerStyle={styles.postInputContainer}
              placeholder={t('auth.apiKey')}
              onChangeText={setApiKey}
            />

            <TextInput
              value={apiRegion}
              autoCorrect={false}
              style={styles.postInput}
              containerStyle={styles.postInputContainer}
              placeholder={t('auth.apiRegion')}
              onChangeText={setSetApiRegion}
            />
          </View>

          <View style={styles.btnArea}>
            <Button style={styles.btn} mode="contained" onPress={onSubmit}>
              {t('update')}
            </Button>
          </View>
        </React.Fragment>
      </Surface>
    </Modal>
  );
};

export default CreateClient;
