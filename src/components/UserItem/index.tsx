import { format } from 'date-fns';
import { Image } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import React, { VFC, useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { observeFile, observeUser } from '@amityco/ts-sdk';

import useAuth from 'hooks/useAuth';
import HeaderMenu from '../HeaderMenu';

import styles from './styles';

export type UserItemProps = {
  onPress?: () => void;
  onEditUser?: (userId: string) => void;
};

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

    return () => {
      //
    };
  }, [avatarFileId]);

  useEffect(() => {
    return observeUser(userId, ({ data: updatedUser, error }) => {
      if (updatedUser) {
        setUser(updatedUser);
      } else if (error) {
        navigation.goBack();
      }
    });
  }, [navigation, userId]);

  const onEdit = useCallback(() => {
    setOpenMenu(false);

    if (onEditUser) {
      onEditUser(userId);
    }
  }, [onEditUser, userId]);

  const userCreateAt = format(new Date(user?.createdAt ?? createdAt), 'HH:mm, MMM d');

  const isUser = client.userId === userId;
  const canEdit = isUser && onEditUser ? onEdit : undefined;

  return (
    <Card onPress={onPress}>
      <Card.Title
        right={({ size }) => (
          <HeaderMenu
            size={size}
            visible={openMenu}
            onEdit={canEdit}
            onToggleMenu={() => setOpenMenu(prev => !prev)}
          />
        )}
        left={
          file?.fileUrl
            ? () => <Image source={{ uri: file?.fileUrl }} style={styles.avatar} />
            : undefined
        }
        title={user?.displayName ?? displayName}
        subtitle={userCreateAt}
      />
      <Card.Content>
        <Paragraph style={styles.text}>{user?.description ?? description}</Paragraph>
      </Card.Content>
    </Card>
  );
};

export default UserItem;
