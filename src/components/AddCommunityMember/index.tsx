import React, { useState, useEffect, VFC, useCallback } from 'react';
import { Text, Surface, Button } from 'react-native-paper';
import { Alert, View, Modal, ScrollView } from 'react-native';
import { addCommunityUser, createQuery, runQuery } from '@amityco/ts-sdk';

import { t } from 'i18n';
import { alertError } from 'utils/alerts';

import TextInput from '../TextInput';

import styles from './styles';

export type AddCommunityMemberType = {
  onClose: () => void;
  onAddMember: () => void;
  communityId: Amity.Community['communityId'];
};

const AddCommunityMember: VFC<AddCommunityMemberType> = ({ onClose, onAddMember, communityId }) => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserId('');
  }, []);

  const onSubmit = async () => {
    if (userId === '') {
      Alert.alert('Please input User ID!');
      return;
    }

    setLoading(true);

    const query = createQuery(addCommunityUser, communityId, [userId]);

    runQuery(query, ({ data: communityData, error, loading: loading_ }) => {
      setLoading(!!loading_);

      if (communityData) {
        onAddMember();
      } else if (error) {
        alertError(error, () => {
          onClose();
        });
      }
    });

    onClose();
  };

  return (
    <Modal transparent visible onDismiss={onClose} animationType="slide" onRequestClose={onClose}>
      <Surface style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.centeredView}>
          <View style={styles.content}>
            <TextInput
              value={userId}
              spellCheck={false}
              autoCapitalize="none"
              autoCompleteType="off"
              onChangeText={setUserId}
              style={styles.communityInput}
              containerStyle={styles.communityInputContainer}
              placeholder={t('community.add_member_user_id_placeholder')}
            />
          </View>

          <View style={styles.btnArea}>
            <Button
              style={styles.btn}
              onPress={onSubmit}
              disabled={loading}
              mode="contained"
              loading={loading}
            >
              {t('add')}
            </Button>

            <Button style={styles.btn} onPress={onClose} mode="contained">
              <Text>{t('cancel')}</Text>
            </Button>
          </View>
        </ScrollView>
      </Surface>
    </Modal>
  );
};

export default AddCommunityMember;
