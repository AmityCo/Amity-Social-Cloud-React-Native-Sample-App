import { FlatList } from 'react-native';
import { Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
// import { sortByLastCreated } from '@amityco/ts-sdk';
// import { queryCommunities, createQuery, runQuery, sortByLastCreated } from '@amityco/ts-sdk';
import React, { VFC, useState, useLayoutEffect, useRef, useCallback } from 'react';

import { Header, CommunityItem, FAB, AddCommunity, Loading } from 'components';

import { DrawerStackHeaderProps, LoadingState } from 'types';

import styles from './styles';

// const QUERY_LIMIT = 10;

const CommunitiesScreen: VFC = () => {
  const [isEditId, setIsEditId] = useState('');
  const [showAddCommunity, setShowAddCommunity] = useState(false);
  // const [isDeleted] = React.useState<Amity.Community['isDeleted']>(false);
  // const [membership] = useState<'member' | 'notMember' | 'all'>('member');
  const [loading] = useState<LoadingState>(LoadingState.NOT_LOADING);
  // const [sortBy] = React.useState<'firstCreated' | 'lastCreated' | 'displayName'>('lastCreated');

  // const [communities, setCommunities] = useState<Amity.Community[]>([]);

  // const [{ error, nextPage }, setMetadata] = useState<Amity.SnapshotOptions & Amity.Pages>({
  //   nextPage: null,
  //   prevPage: null,
  //   error: null,
  //   loading: false,
  //   origin: 'local',
  // });

  const flatListRef = useRef<FlatList<Amity.Community>>(null);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, previous, navigation: nav }: DrawerStackHeaderProps) => (
        <Header scene={scene} previous={previous} navigation={nav} />
      ),
    });
  }, [navigation]);

  // const onQueryCommunities = useCallback(
  //   async ({ reset = false, page = { limit: QUERY_LIMIT } }) => {
  //     const queryData = {
  //       page,
  //       sortBy,
  //       isDeleted,
  //       // membership,
  //       displayName: 'rezacom',
  //     };

  //     // runQuery(
  //     //   createQuery(queryCommunities, queryData),
  //     //   // ({ data, loading: loading_, ...metadata }) => {
  //     //   data => {
  //     //     // console.log({ data });
  //     //     // if (data) {
  //     //     //   // @ts-ignore
  //     //     //   setCommunities(prevCommunities => (reset ? data : [...prevCommunities, ...data]));
  //     //     //   // console.log({ data });
  //     //     //   // @ts-ignore
  //     //     //   setMetadata(metadata);
  //     //     // }

  //     //     // if (!loading_) {
  //     //     //   setLoading(LoadingState.NOT_LOADING);
  //     //     // }
  //     //   },
  //     // );
  //   },
  //   [isDeleted, sortBy],
  // );

  // const onRefresh = useCallback(() => {
  //   setLoading(LoadingState.IS_REFRESHING);
  //   onQueryCommunities({ reset: true });
  // }, [onQueryCommunities]);

  // useEffect(() => {
  //   onQueryCommunities({ reset: true });
  // }, [onQueryCommunities]);

  // React.useEffect(() => {
  //   const unsubscribe = navigation?.dangerouslyGetParent()?.addListener('tabPress', () => {
  //     onRefresh();
  //     flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
  //   });

  //   return unsubscribe;
  // }, [navigation, onRefresh]);

  // const handleLoadMore = () => {
  //   if (nextPage) {
  //     setLoading(LoadingState.IS_LOADING_MORE);
  //     onQueryCommunities({ page: nextPage });
  //   }
  // };

  const onCloseAddCommunity = useCallback(() => {
    setIsEditId('');
    setShowAddCommunity(false);
  }, []);

  const onEditCommunity = useCallback(id => {
    setIsEditId(id);
  }, []);

  const onPressCommunityItem = useCallback(
    community => {
      navigation.navigate('Community', { community });
    },
    [navigation],
  );

  // const errorText = getErrorMessage(error);
  // const data = communities
  //   .filter(post => (!isDeleted ? !post.isDeleted : true))
  //   .sort(sortByLastCreated);
  const visibleAddCommunity = showAddCommunity || isEditId !== '';

  return (
    <Surface style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={[]}
        // onRefresh={onRefresh}
        // onEndReached={handleLoadMore}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.communityId}
        extraData={loading === LoadingState.NOT_LOADING}
        refreshing={loading === LoadingState.IS_REFRESHING}
        ListFooterComponent={loading === LoadingState.IS_LOADING_MORE ? <Loading /> : undefined}
        renderItem={({ item }) => (
          <Surface style={styles.communityItem}>
            <CommunityItem
              community={item}
              a="communities"
              onEditCommunity={onEditCommunity}
              onPress={() => onPressCommunityItem(item)}
            />
          </Surface>
        )}
        // ListEmptyComponent={
        //   loading === LoadingState.NOT_LOADING ? (
        //     <EmptyComponent errorText={error ? errorText : undefined} />
        //   ) : null
        // }
      />

      {visibleAddCommunity && (
        <AddCommunity
          isEditId={isEditId}
          // onAddCommunity={onRefresh}
          onClose={onCloseAddCommunity}
        />
      )}

      <FAB
        icon="plus"
        onPress={() => {
          setShowAddCommunity(true);
        }}
      />
    </Surface>
  );
};

export default CommunitiesScreen;
