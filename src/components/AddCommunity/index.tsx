import React, { useState, useEffect, VFC, useCallback } from 'react';
import { Text, Surface, Button } from 'react-native-paper';
import { Alert, View, Modal, ScrollView } from 'react-native';
import {
  getCommunity,
  createCommunity,
  updateCommunity,
  createQuery,
  runQuery,
} from '@amityco/ts-sdk';

import { t } from 'i18n';
import { alertError } from 'utils/alerts';

import TextInput from '../TextInput';

import styles from './styles';

export type AddCommunityType = {
  isEditId: string;
  onClose: () => void;
  onAddCommunity?: () => void;
};

const AddCommunity: VFC<AddCommunityType> = ({ onClose, onAddCommunity, isEditId }) => {
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setDisplayName('');
    setDescription('');
  }, []);

  const getCurrentCommunity = useCallback(async () => {
    const query = createQuery(getCommunity, isEditId);

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
      getCurrentCommunity();
    }
  }, [getCurrentCommunity, isEditId]);

  const onSubmit = async () => {
    if (displayName === '') {
      Alert.alert('Please input display name!');
      return;
    }

    setLoading(true);

    const data = { displayName, description };

    if (isEditId !== '') {
      const query = createQuery(updateCommunity, isEditId, data);

      runQuery(query, ({ error }) => {
        if (error) {
          alertError(error);
        }
      });
    } else {
      const query = createQuery(createCommunity, data);

      runQuery(query, ({ data: communityData, error, loading: loading_ }) => {
        setLoading(!!loading_);

        if (communityData) {
          if (onAddCommunity) {
            onAddCommunity();
          }
        } else if (error) {
          alertError(error, () => {
            onClose();
          });
        }
      });
    }

    onClose();
  };

  return (
    <Modal transparent visible animationType="slide" onDismiss={onClose} onRequestClose={onClose}>
      <Surface style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.centeredView}>
          <View style={styles.content}>
            <TextInput
              value={displayName}
              style={styles.communityInput}
              containerStyle={styles.communityInputContainer}
              placeholder={t('users.add_user_display_name_placeholder')}
              onChangeText={setDisplayName}
            />
            <TextInput
              value={description}
              style={styles.communityInput}
              containerStyle={styles.communityInputContainer}
              placeholder={t('users.add_user_description_placeholder')}
              onChangeText={setDescription}
            />
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

export default AddCommunity;
