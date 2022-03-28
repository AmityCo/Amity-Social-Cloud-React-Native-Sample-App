import { FlatList } from 'react-native';
import { useDebounce } from 'use-debounce';
import { useNavigation } from '@react-navigation/native';
import { Surface, Searchbar as SearchBar } from 'react-native-paper';
import { queryChannels, createQuery, runQuery, sortByLastCreated } from '@amityco/ts-sdk';
import React, { VFC, useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';

import { Header, ChannelItem, EmptyComponent, Loading } from 'components';

import { DrawerStackHeaderProps, LoadingState } from 'types';

import getErrorMessage from 'utils/getErrorMessage';

import styles from './styles';

const QUERY_LIMIT = 10;

const ChannelsScreens: VFC = () => {
  const [isDeleted] = useState<Amity.Channel['isDeleted']>(false);
  const [membership] = useState<'member' | 'notMember' | 'all'>('all');
  const [loading, setLoading] = useState<LoadingState>(LoadingState.NOT_LOADING);
  const [sortBy] = useState<'firstCreated' | 'lastCreated' | 'displayName'>('lastCreated');

  const [channels, setChannels] = useState<Amity.Channel[]>([]);

  const [options, setOptions] = useState<Amity.SnapshotOptions & Amity.Pages<Amity.Page>>();
  const { nextPage, error } = options ?? {};

  const [searchText, setSearchText] = useState('');
  const [debouncedDisplayName] = useDebounce(searchText, 1000);

  const flatListRef = useRef<FlatList<Amity.Channel>>(null);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, previous, navigation: nav }: DrawerStackHeaderProps) => (
        <Header scene={scene} previous={previous} navigation={nav} />
      ),
    });
  }, [navigation]);

  const onQueryChannels = useCallback(
    async ({ reset = false, page = { limit: QUERY_LIMIT } }) => {
      const queryData = {
        page,
        sortBy,
        membership,
        displayName: debouncedDisplayName,
      };

      runQuery(createQuery(queryChannels, queryData), ({ data, ...metadata }) => {
        if (data) {
          setChannels(prevChannels => (reset ? data : [...prevChannels, ...data]));

          setOptions(metadata);
        }

        if (!metadata.loading) {
          setLoading(LoadingState.NOT_LOADING);
        }
      });
    },
    [debouncedDisplayName, membership, sortBy],
  );

  const onRefresh = useCallback(() => {
    setLoading(LoadingState.IS_REFRESHING);
    onQueryChannels({ reset: true });
  }, [onQueryChannels]);

  useEffect(() => {
    onQueryChannels({ reset: true });
  }, [onQueryChannels]);

  useEffect(() => {
    const unsubscribe = navigation?.getParent()?.addListener('tabPress', () => {
      onRefresh();
      flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    });

    return unsubscribe;
  }, [navigation, onRefresh]);

  const handleLoadMore = () => {
    if (nextPage) {
      setLoading(LoadingState.IS_LOADING_MORE);
      onQueryChannels({ page: nextPage });
    }
  };

  const onPressChannelItem = useCallback(
    channel => {
      navigation.navigate('Chat', { channel });
    },
    [navigation],
  );

  const data = channels.filter(post => (!isDeleted ? !post.isDeleted : true));

  const errorText = getErrorMessage(error);

  return (
    <Surface style={styles.container}>
      <SearchBar
        value={searchText}
        placeholder="Search"
        autoComplete={false}
        style={styles.searchBar}
        onChangeText={setSearchText}
      />

      <FlatList
        ref={flatListRef}
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.channelId}
        refreshing={loading === LoadingState.IS_REFRESHING}
        ListFooterComponent={loading === LoadingState.IS_LOADING_MORE ? <Loading /> : undefined}
        renderItem={({ item }) => (
          <Surface style={styles.channelItem}>
            <ChannelItem channel={item} onPress={() => onPressChannelItem(item)} />
          </Surface>
        )}
        ListEmptyComponent={
          loading === LoadingState.NOT_LOADING ? (
            <EmptyComponent errorText={error ? errorText : undefined} />
          ) : null
        }
        onRefresh={onRefresh}
        onEndReached={handleLoadMore}
      />
    </Surface>
  );
};

export default ChannelsScreens;
