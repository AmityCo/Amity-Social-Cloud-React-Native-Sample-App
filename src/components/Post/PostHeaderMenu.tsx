import React, { VFC, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Menu, useTheme, Divider } from 'react-native-paper';
import { Pressable, StyleSheet } from 'react-native';

import { t } from 'i18n';

type PostHeaderMenuProps = {
  size: number;
  onEdit: () => void;
  onDelete: () => void;
  onFlag?: () => void;
  onUnflag?: () => void;
  hasFlag: boolean;
  onToggleMenu: () => void;
  visible: boolean;
};

const PostHeaderMenu: VFC<PostHeaderMenuProps> = ({
  size,
  onEdit,
  onDelete,
  onFlag,
  onUnflag,
  hasFlag,
  onToggleMenu,
  visible,
}) => {
  const {
    colors: { text: textColor },
  } = useTheme();

  return (
    <Menu
      visible={visible}
      onDismiss={onToggleMenu}
      anchor={
        <Pressable style={styles.ellipsis} onPress={onToggleMenu}>
          <Ionicons name="ellipsis-vertical-sharp" size={size} color={textColor} />
        </Pressable>
      }
    >
      <Menu.Item onPress={onEdit} title={t('edit')} />
      <Divider />
      <Menu.Item onPress={onDelete} title={t('delete')} />
      {onFlag && hasFlag && <Menu.Item onPress={onUnflag} title={t('unflag')} />}
      {onUnflag && !hasFlag && <Menu.Item onPress={onFlag} title={t('flag')} />}
    </Menu>
  );
};

const styles = StyleSheet.create({
  ellipsis: { marginHorizontal: 10 },
});

export default PostHeaderMenu;
