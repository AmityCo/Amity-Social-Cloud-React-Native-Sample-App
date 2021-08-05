/* eslint-disable react/jsx-props-no-spreading */
import { queryCommunities } from '@amityco/ts-sdk';
import { FlatList, StyleSheet, View } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import React, { VFC, useState, useEffect, useLayoutEffect } from 'react';
import { Surface, Portal, FAB, useTheme, HelperText, Button } from 'react-native-paper';

import { Header, CommunityItem, EmptyComponent } from 'components';

import { t } from 'i18n';
import handleError from 'utils/handleError';

const CommunitiesScreen: VFC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [communities, setCommunities] = useState<ASC.Community[]>([]);

  const theme = useTheme();
  // const isFocused = useIsFocused();
  const navigation = useNavigation();
  const safeArea = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, previous, navigation: nav }: StackHeaderProps) => (
        <Header scene={scene} previous={previous} navigation={nav} />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);

    onQueryCommunities();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    onQueryCommunities();
  };

  const onQueryCommunities = async () => {
    setError('');

    try {
      const result = await queryCommunities();

      setCommunities(result);
    } catch (e) {
      const errorText = handleError(e);

      setError(errorText);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const data =
    communities.length > 0
      ? communities.map(community => ({
          ...community,
          onPress: () => {
            navigation.navigate('Community', { ...community, onRefresh: onQueryCommunities });
          },
        }))
      : [];

  return (
    <Surface style={styles.container}>
      <FlatList
        data={data}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.communityId}
        renderItem={({ item }) => (
          <Surface style={styles.communityItem}>
            <CommunityItem {...item} onRefresh={onQueryCommunities} />
          </Surface>
        )}
        ListEmptyComponent={
          <EmptyComponent
            loading={loading}
            onRetry={onRefresh}
            errorText={error !== '' ? error : t('no_result')}
          />
        }
      />
      <Portal>
        <FAB
          visible={false}
          icon="email-plus-outline"
          style={{
            position: 'absolute',
            bottom: safeArea.bottom + 65,
            right: 16,
          }}
          color="white"
          theme={{
            colors: {
              accent: theme.colors.primary,
            },
          }}
          // onPress={() => {}}
        />
      </Portal>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  communityItem: {
    flex: 1,
    margin: 12,
    borderRadius: 5,
  },
});

export default CommunitiesScreen;
