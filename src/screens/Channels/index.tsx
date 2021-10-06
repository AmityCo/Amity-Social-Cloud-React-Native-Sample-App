import { FlatList } from 'react-native';
import { useDebounce } from 'use-debounce';
import { useNavigation } from '@react-navigation/native';
import { Surface, Searchbar as SearchBar } from 'react-native-paper';
import { queryChannels, createQuery, runQuery, sortByLastCreated } from '@amityco/ts-sdk';
import React, { VFC, useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';

import { Header, ChannelItem, EmptyComponent, Loading } from 'components';

import getErrorMessage from 'utils/getErrorMessage';

import { DrawerStackHeaderProps, LoadingState } from 'types';

import styles from './styles';

const QUERY_LIMIT = 10;

const ChannelsScreens: VFC = () => {
  const [isDeleted] = React.useState<Amity.Channel['isDeleted']>(false);
  const [membership] = useState<'member' | 'notMember' | 'all'>('all');
  const [loading, setLoading] = useState<LoadingState>(LoadingState.NOT_LOADING);
  const [sortBy] = React.useState<'firstCreated' | 'lastCreated' | 'displayName'>('lastCreated');

  const [channels, setChannels] = useState<Record<string, Amity.Channel>>({});

  const [{ error, nextPage }, setMetadata] = useState<Amity.QueryMetadata & Amity.Pages>({
    nextPage: null,
    prevPage: null,
  });

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

      runQuery(
        createQuery(queryChannels, queryData),
        ({ data, loading: loading_, ...metadata }) => {
          if (reset) setChannels({});
          if (data) {
            setChannels(prevChannels => ({ ...prevChannels, ...data }));

            // @ts-ignore
            setMetadata(metadata);
          }

          if (!loading_) {
            setLoading(LoadingState.NOT_LOADING);
          }
        },
      );
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
    const unsubscribe = navigation?.dangerouslyGetParent()?.addListener('tabPress', () => {
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

  const errorText = getErrorMessage(error);
  const data = Object.values(channels)
    .filter(post => (!isDeleted ? !post.isDeleted : true))
    .sort(sortByLastCreated);

  return (
    <Surface style={styles.container}>
      <SearchBar
        placeholder="Search"
        onChangeText={setSearchText}
        value={searchText}
        style={styles.searchBar}
      />

      <FlatList
        data={data}
        ref={flatListRef}
        onRefresh={onRefresh}
        onEndReached={handleLoadMore}
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
      />
    </Surface>
  );
};

export default ChannelsScreens;
