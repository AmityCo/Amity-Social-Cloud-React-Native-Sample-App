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
          { icon: 'plus', onPress: () => console.log('Pressed add') },
          {
            icon: 'star',
            label: 'Star',
            onPress: () => console.log('Pressed star'),
          },
          {
            icon: 'email',
            label: 'Email',
            onPress: () => console.log('Pressed email'),
          },
          {
            icon: 'bell',
            label: 'Remind',
            onPress: () => console.log('Pressed notifications'),
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
