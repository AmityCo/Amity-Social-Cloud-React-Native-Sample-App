import React, { FC } from 'react';
import { RouteProp } from '@react-navigation/native';

import DetailedTwitt from 'components/Twitt/DetailedTwitt';

import { StackNavigatorParamlist } from 'types';

type Props = {
  route: RouteProp<StackNavigatorParamlist, 'Details'>;
};

const Details: FC<Props> = ({ route: { params } }) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <DetailedTwitt {...params} />;
};

export default Details;
