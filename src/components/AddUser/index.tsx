import { getUser, updateUser } from '@amityco/ts-sdk';
import React, { useState, useEffect, VFC } from 'react';
import { Alert, View, StyleSheet, Modal, ScrollView } from 'react-native';
import { Text, Surface, Button, ActivityIndicator } from 'react-native-paper';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import getErrorMessage from 'utils/getErrorMessage';

import { AddUserType } from 'types';

import TextInput from '../TextInput';

const AddUser: VFC<AddUserType> = ({ visible, onClose, isEditId }) => {
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
      getCurrentUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditId]);

  const getCurrentUser = async () => {
    try {
      const user = await getUser(isEditId);

      setDisplayName(user.displayName ?? '');
      setDescription(user.description ?? '');
    } catch (error) {
      const errorText = getErrorMessage(error);
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
      Alert.alert('Please input a display name!');
      return;
    }

    try {
      setLoading(true);

      const data = { displayName, description };

      await updateUser(isEditId, data);

      onClose();
    } catch (error) {
      const errorText = getErrorMessage(error);

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
              style={styles.userInput}
              onChangeText={setDisplayName}
              containerStyle={styles.userInputContainer}
              placeholder={t('users.add_user_display_name_placeholder')}
            />
            <TextInput
              value={description}
              style={styles.userInput}
              onChangeText={setDescription}
              containerStyle={styles.userInputContainer}
              placeholder={t('users.add_user_description_placeholder')}
            />
          </View>

          <View style={styles.btnArea}>
            <Button style={styles.btn} onPress={onSubmit} disabled={loading} mode="contained">
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Text>{t(isEditId === '' ? 'add' : 'update')}</Text>
              )}
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

  userInputContainer: {
    width: '90%',
    height: 160,
    textAlignVertical: 'top',
    padding: 10,
    marginBottom: 20,
  },

  userInput: {
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

export default AddUser;
