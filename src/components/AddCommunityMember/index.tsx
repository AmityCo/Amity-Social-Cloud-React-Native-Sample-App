import React, { useState, useEffect, VFC, useCallback } from 'react';
import { Text, Surface, Button } from 'react-native-paper';
import { Alert, View, Modal, ScrollView } from 'react-native';
import { addCommunityMembers, createQuery, runQuery } from '@amityco/ts-sdk';

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

    const query = createQuery(addCommunityMembers, communityId, [userId]);

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
    <Modal transparent visible animationType="slide" onDismiss={onClose} onRequestClose={onClose}>
      <Surface style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.centeredView}>
          <View style={styles.content}>
            <TextInput
              value={userId}
              numberOfLines={1}
              spellCheck={false}
              autoCapitalize="none"
              autoComplete={false}
              style={styles.communityInput}
              containerStyle={styles.communityInputContainer}
              placeholder={t('community.add_member_user_id_placeholder')}
              onChangeText={setUserId}
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
              {t('add')}
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

export default AddCommunityMember;
