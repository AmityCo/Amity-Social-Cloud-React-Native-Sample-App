/* eslint-disable react/jsx-props-no-spreading */
import { queryCommunities } from '@amityco/ts-sdk';
import { FlatList, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderProps } from '@react-navigation/stack';
import React, { VFC, useState, useEffect, useLayoutEffect } from 'react';

import { Header, CommunityItem, EmptyComponent, FAB, AddCommunity } from 'components';

import { t } from 'i18n';
import handleError from 'utils/handleError';

const CommunitiesScreen: VFC = () => {
  const [error, setError] = useState('');
  const [isEditId, setIsEditId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddCommunity, setShowAddCommunity] = useState(false);
  const [communities, setCommunities] = useState<ASC.Community[]>([]);

  const navigation = useNavigation();

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
          <EmptyComponent loading={loading} onRetry={onRefresh} errorText={error} />
        }
      />

      <AddCommunity
        onClose={() => {
          setIsEditId('');
          setShowAddCommunity(false);
        }}
        isEditId={isEditId}
        onAddCommunity={onQueryCommunities}
        visible={showAddCommunity || isEditId !== ''}
      />

      <FAB
        icon="plus"
        onPress={() => {
          setShowAddCommunity(true);
        }}
      />
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
