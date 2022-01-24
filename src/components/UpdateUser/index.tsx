import { Alert, View, Modal, ScrollView } from 'react-native';
import React, { useState, useEffect, VFC, useCallback } from 'react';
import { getUser, updateUser, runQuery, createQuery } from '@amityco/ts-sdk';
import { Text, Surface, Button, ActivityIndicator } from 'react-native-paper';

import { t } from 'i18n';
import { alertError } from 'utils/alerts';

import TextInput from '../TextInput';

import styles from './styles';

export type UpdateUserType = {
  isEditId: string;
  onClose: () => void;
};

const UpdateUser: VFC<UpdateUserType> = ({ onClose, isEditId }) => {
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setDisplayName('');
    setDescription('');
  }, []);

  const getCurrentUser = useCallback(async () => {
    const query = createQuery(getUser, isEditId);

    runQuery(query, ({ data, error }) => {
      if (data) {
        setDisplayName(data.displayName ?? '');
        setDescription(data.description ?? '');
      } else if (error) {
        alertError(error, () => {
          onClose();
        });
      }
    });
  }, [isEditId, onClose]);

  useEffect(() => {
    if (isEditId !== '') {
      getCurrentUser();
    }
  }, [getCurrentUser, isEditId]);

  const onSubmit = async () => {
    if (displayName === '') {
      Alert.alert('Please input a display name!');
      return;
    }

    setLoading(true);

    const data = { displayName, description };

    runQuery(
      createQuery(updateUser, isEditId, data),
      ({ data: userData, error, loading: loading_ }) => {
        setLoading(!!loading_);

        if (userData) {
          onClose();
        } else if (error) {
          alertError(error, () => {
            onClose();
          });
        }
      },
    );
  };

  return (
    <Modal transparent visible animationType="slide" onDismiss={onClose} onRequestClose={onClose}>
      <Surface style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.centeredView}>
          <View style={styles.content}>
            <TextInput
              value={displayName}
              style={styles.userInput}
              containerStyle={styles.userInputContainer}
              placeholder={t('users.add_user_display_name_placeholder')}
              onChangeText={setDisplayName}
            />
            <TextInput
              value={description}
              style={styles.userInput}
              containerStyle={styles.userInputContainer}
              placeholder={t('users.add_user_description_placeholder')}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.btnArea}>
            <Button style={styles.btn} disabled={loading} mode="contained" onPress={onSubmit}>
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Text>{t(isEditId === '' ? 'add' : 'update')}</Text>
              )}
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

export default UpdateUser;
