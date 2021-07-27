import React, { FC } from 'react';
import { Ionicons } from '@expo/vector-icons';

const TabBarIcon: FC<{
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}> = props => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
};

export default TabBarIcon;
