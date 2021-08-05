import React, { VFC } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Portal, FAB, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FABGroup: VFC = () => {
  const theme = useTheme();
  const isFocused = useIsFocused();
  const safeArea = useSafeAreaInsets();

  return (
    <Portal>
      <FAB.Group
        open={false}
        visible={isFocused}
        icon="plus"
        color="white"
        theme={{
          colors: {
            accent: theme.colors.primary,
          },
        }}
        style={{
          paddingRight: 5,
          position: 'absolute',
          paddingBottom: safeArea.bottom + 55,
        }}
        actions={[
          {
            icon: 'plus',
            onPress: () => {
              //
            },
          },
          {
            icon: 'star',
            label: 'Star',
            onPress: () => {
              //
            },
          },
          {
            icon: 'email',
            label: 'Email',
            onPress: () => {
              //
            },
          },
          {
            icon: 'bell',
            label: 'Remind',
            onPress: () => {
              //
            },
            small: false,
          },
        ]}
        onStateChange={() => {
          //
        }}
        // onPress={() => {
        //   if (open) {
        //     // do something if the speed dial is open
        //   }
        // }}
      />
    </Portal>
  );
};

export default FABGroup;
