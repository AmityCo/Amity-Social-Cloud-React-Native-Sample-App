/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect, VFC } from 'react';
import { Text, Surface, Button } from 'react-native-paper';
import { Alert, View, StyleSheet, Modal, ScrollView } from 'react-native';
import { getCommunity, createCommunity, updateCommunity, deleteCommunity } from '@amityco/ts-sdk';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import handleError from 'utils/handleError';

import { AddCommunityType } from 'types';

import TextInput from '../TextInput';

const AddCommunity: VFC<AddCommunityType> = ({ visible, onClose, onAddCommunity, isEditId }) => {
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');

  const { client } = useAuth();

  useEffect(() => {
    if (!visible) {
      setDisplayName('');
      setDescription('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (isEditId !== '' && visible) {
      getCurrentCommunity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditId]);

  const getCurrentCommunity = async () => {
    try {
      const community = await getCommunity(isEditId);

      setDisplayName(community.displayName ?? '');
      setDescription(community.description ?? '');
    } catch (error) {
      const errorText = handleError(error);
      Alert.alert(
        'Oooops!',
        errorText,
        [
          {
            text: t('close'),
            onPress: async () => {
              onClose();
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  const onSubmit = async () => {
    if (!client.userId) {
      Alert.alert('UserId is not reachable!');
    }

    if (displayName === '') {
      Alert.alert('Please input display name!');
      return;
    }

    try {
      setLoading(true);

      if (isEditId !== '') {
        const data = { displayName, description };

        await updateCommunity(isEditId, data);
      } else {
        const data = { displayName };

        await createCommunity(data);

        onAddCommunity!();
      }

      onClose();
    } catch (error) {
      const errorText = handleError(error);

      Alert.alert(errorText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      onDismiss={onClose}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Surface style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.centeredView}>
          <View style={styles.content}>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              style={styles.communityInput}
              containerStyle={styles.communityInputContainer}
              placeholder={t('users.add_user_display_name_placeholder')}
            />
            <TextInput
              value={description}
              style={styles.communityInput}
              onChangeText={setDescription}
              containerStyle={styles.communityInputContainer}
              placeholder={t('users.add_user_description_placeholder')}
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
              {t(isEditId === '' ? 'add' : 'update')}
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

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // flexGrow: 1,
  },

  content: {
    width: '100%',
    alignItems: 'center',
  },

  communityInputContainer: {
    width: '90%',
    height: 160,
    textAlignVertical: 'top',
    padding: 10,
    marginBottom: 20,
  },

  communityInput: {
    flex: 1,
    // height: 150,
    textAlignVertical: 'top',
    fontSize: 18,
  },

  filesContainer: {
    width: '100%',
    marginBottom: 15,
  },

  filesArea: {
    justifyContent: 'flex-start',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '90%',
    // backgroundColor: "black",
  },

  btnArea: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  btn: {
    width: 120,
  },
});

export default AddCommunity;
