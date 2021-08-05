import { getUser } from '@amityco/ts-sdk';
import { StyleSheet, Alert } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import React, { VFC, useLayoutEffect, useState, useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Header, UserItem, AddUser } from 'components';

import { t } from 'i18n';
import handleError from 'utils/handleError';

import { UserProps, UserItemProps } from 'types';

import Feed from './Feed';

const PostScreen: VFC = () => {
  const [user, setUser] = useState<ASC.User>();
  const [isEditId, setIsEditId] = useState('');

  const route = useRoute();
  const navigation = useNavigation();
  const {
    colors: { surface: surfaceColor },
  } = useTheme();

  const { userId, onRefresh } = route.params as UserProps;

  useEffect(() => {
    getCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const getCurrentUser = async () => {
    try {
      const currentUser = await getUser(userId);

      setUser(currentUser);
    } catch (error) {
      const errorText = handleError(error);
      Alert.alert(
        'Oooops!',
        errorText,
        [
          {
            text: t('close'),
            onPress: async () => {
              navigation.goBack();
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: user?.displayName ? user?.displayName : 'User',
      header: ({ scene, previous, navigation: nav }: StackHeaderProps) => (
        <Header scene={scene} navigation={nav} previous={previous} />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.displayName]);

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: surfaceColor }}
    >
      {!user?.userId ? (
        <ActivityIndicator style={styles.loading} />
      ) : (
        <>
          <UserItem
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...(user as UserItemProps)}
            onEditUser={() => {
              setIsEditId(userId);
            }}
            onRefresh={() => {
              getCurrentUser();

              onRefresh();
            }}
          />

          <Feed userId={userId} />

          <AddUser
            onClose={() => {
              setIsEditId('');
            }}
            isEditId={isEditId}
            onAddUser={() => {
              onRefresh();
              getCurrentUser();
            }}
            visible={isEditId !== ''}
          />
        </>
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  loading: { marginTop: 20 },
});

export default PostScreen;
