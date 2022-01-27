import React, { VFC } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Portal, FAB as PaperFAB, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FABProps = {
  icon: string;
  onPress: () => void;
};

const FAB: VFC<FABProps> = ({ icon, onPress }) => {
  const theme = useTheme();
  const isFocused = useIsFocused();
  const safeArea = useSafeAreaInsets();

  return (
    <Portal>
      <PaperFAB
        icon={icon}
        color="white"
        visible={isFocused}
        style={{
          right: 15,
          position: 'absolute',
          bottom: safeArea.bottom + 65,
        }}
        theme={{
          colors: {
            accent: theme.colors.primary,
          },
        }}
        onPress={onPress}
      />
    </Portal>
  );
};

export default FAB;
