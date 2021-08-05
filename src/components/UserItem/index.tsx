import Moment from 'moment';
import { observeFile } from '@amityco/ts-sdk';
import { Image, StyleSheet } from 'react-native';
import React, { VFC, useState, useEffect } from 'react';
import { Surface, Card, Paragraph } from 'react-native-paper';

import { UserProps } from 'types';

import HeaderMenu from '../HeaderMenu';

type UserItemProps = UserProps & { onRefresh?: () => void; onEditUser: (userId: string) => void };

const UserItem: VFC<UserItemProps> = ({
  userId,
  onPress,
  displayName,
  createdAt,
  description,
  avatarFileId,
  onEditUser,
}) => {
  const [file, setFile] = useState<ASC.File>();
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (avatarFileId) {
      observeFile(avatarFileId, setFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEdit = () => {
    setOpenMenu(false);

    onEditUser(userId);
  };

  const postCreateAt = Moment(createdAt).format('HH:mm, MMM d');

  return (
    <Surface style={styles.container}>
      <Card onPress={onPress}>
        <Card.Title
          right={({ size }) => (
            <HeaderMenu
              size={size}
              onEdit={onEdit}
              visible={openMenu}
              onToggleMenu={() => setOpenMenu(prev => !prev)}
            />
          )}
          left={
            file?.fileUrl
              ? () => <Image source={{ uri: file?.fileUrl }} style={styles.avatar} />
              : undefined
          }
          title={displayName}
          subtitle={postCreateAt}
        />
        <Card.Content>
          <Paragraph style={styles.text}>{description}</Paragraph>
        </Card.Content>
      </Card>
    </Surface>
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
