/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Moment from 'moment';
import { Card, Paragraph } from 'react-native-paper';
import { Image, StyleSheet, Alert } from 'react-native';
import React, { VFC, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { observeFile, getUser, observeUser } from '@amityco/ts-sdk';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import getErrorMessage from 'utils/getErrorMessage';

import { UserItemProps } from 'types';

import HeaderMenu from '../HeaderMenu';

const UserItem: VFC<{ user: Amity.User } & UserItemProps> = ({
  user: userProp,
  onPress,
  onEditUser,
}) => {
  const [user, setUser] = useState<Amity.User>();
  const [file, setFile] = useState<Amity.File>();
  const [openMenu, setOpenMenu] = useState(false);

  const { userId, displayName, createdAt, description, avatarFileId } = userProp;

  const { client } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (avatarFileId) {
      return observeFile(avatarFileId, fileObj => setFile(fileObj.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const getCurrentUser = async () => {
    try {
      const currentUser = await getUser(userId);

      setUser(currentUser);
    } catch (error) {
      const errorText = getErrorMessage(error);
      Alert.alert(
        'Oooops!',
        errorText,
        [
          {
            text: t('close'),
            onPress: async () => {
              if (!onPress) {
                navigation.goBack();
              }
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  useEffect(
    () => {
      return observeUser(userId, ({ data: updatedUser }) => {
        setUser(updatedUser);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onEdit = () => {
    setOpenMenu(false);

    onEditUser!(userId);
  };

  const postCreateAt = Moment(user?.createdAt ?? createdAt).format('HH:mm, MMM d');

  const isUser = client.userId === userId;
  const canEdit = isUser && onEditUser ? onEdit : undefined;

  return (
    <Card onPress={onPress}>
      <Card.Title
        right={({ size }) => (
          <HeaderMenu
            size={size}
            onEdit={canEdit}
            visible={openMenu}
            onToggleMenu={() => setOpenMenu(prev => !prev)}
          />
        )}
        left={
          file?.fileUrl
            ? () => <Image source={{ uri: file?.fileUrl }} style={styles.avatar} />
            : undefined
        }
        title={user?.displayName ?? displayName}
        subtitle={postCreateAt}
      />
      <Card.Content>
        <Paragraph style={styles.text}>{user?.description ?? description}</Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
    borderRadius: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 18,
    marginRight: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
  },
  ellipsis: { marginHorizontal: 10 },
  text: { marginBottom: 10 },
  footer: { justifyContent: 'space-between' },
  footerLeft: { flexDirection: 'row' },
  footerRight: { flexDirection: 'row', paddingEnd: 10 },
});

export default UserItem;
