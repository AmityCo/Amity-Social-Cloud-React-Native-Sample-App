import React, { FC } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { Menu, useTheme } from 'react-native-paper';

import { t } from 'i18n';

import styles from './styles';

type HeaderMenuProps = {
  size: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onFlag?: () => void;
  onUnflag?: () => void;
  hasFlag?: boolean;
  onToggleMenu: () => void;
  visible: boolean;
};

const HeaderMenu: FC<HeaderMenuProps> = ({
  size,
  onEdit,
  onDelete,
  onFlag,
  onUnflag,
  hasFlag,
  onToggleMenu,
  visible,
  children,
}) => {
  const {
    colors: { text: textColor },
  } = useTheme();

  if (!onEdit && !onDelete && !onFlag && !onUnflag) {
    return null;
  }

  return (
    <View style={styles.container}>
      {children}
      <Menu
        visible={visible}
        anchor={
          <Pressable style={styles.ellipsis} onPress={onToggleMenu}>
            <Ionicons name="ellipsis-vertical-sharp" size={size} color={textColor} />
          </Pressable>
        }
        onDismiss={onToggleMenu}
      >
        {onEdit && <Menu.Item title={t('edit')} onPress={onEdit} />}
        {onDelete && <Menu.Item title={t('delete')} onPress={onDelete} />}
        {onFlag && hasFlag && <Menu.Item title={t('unflag')} onPress={onUnflag} />}
        {onUnflag && !hasFlag && <Menu.Item title={t('flag')} onPress={onFlag} />}
      </Menu>
    </View>
  );
};

export default HeaderMenu;
