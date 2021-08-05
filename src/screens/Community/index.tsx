/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getCommunity } from '@amityco/ts-sdk';
import { StyleSheet, Alert } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import React, { VFC, useState, useLayoutEffect, useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Header, CommunityItem } from 'components';

import { t } from 'i18n';
import handleError from 'utils/handleError';

import { CommunityItemProps } from 'types';

import Feed from './Feed';

const Community: VFC = () => {
  const [loading, setLoading] = useState(false);
  const [community, setCommunity] = useState<ASC.Community>();

  const route = useRoute();
  const navigation = useNavigation();
  const {
    colors: { surface: surfaceColor },
  } = useTheme();

  const { communityId, displayName, onRefresh } = route.params as CommunityItemProps;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: displayName || 'Commuity',
      header: ({ scene, previous, navigation: nav }: StackHeaderProps) => (
        <Header scene={scene} navigation={nav} previous={previous} />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayName]);

  useEffect(() => {
    getCurrentCommunity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId]);

  const getCurrentCommunity = async () => {
    setLoading(true);
    try {
      const currentCommunity = await getCommunity(communityId);

      if (currentCommunity.isDeleted) {
        navigation.goBack();
      } else {
        setCommunity(currentCommunity);
      }
    } catch (error) {
      const errorText = handleError(error);
      Alert.alert(
        'Oooops!',
        errorText,
        [
          {
            text: t('close'),
            onPress: async () => {
              navigation.goBack();
            },
          },
        ],
        { cancelable: false },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: surfaceColor }}
    >
      {loading ? (
        <ActivityIndicator style={styles.loading} />
      ) : (
        <CommunityItem
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...(community as CommunityItemProps)}
          onEditCommunity={() => {
            // setIsEditId(postId);
          }}
          onRefresh={() => {
            getCurrentCommunity();

            onRefresh();
          }}
        />
      )}

      <Feed communityId={communityId} />
    </KeyboardAwareScrollView>
  );
};

export const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { marginTop: 25 },
});

export default Community;
