/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { queryUsers } from '@amityco/ts-sdk';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderProps } from '@react-navigation/stack';
import { FlatList, StyleSheet, View, Animated } from 'react-native';
import React, { VFC, useState, useLayoutEffect, useEffect } from 'react';
import { Surface, Appbar, HelperText, Button, Searchbar } from 'react-native-paper';

import { Header, EmptyComponent, UserItem } from 'components';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import useDebounce from 'hooks/useDebounce';
import handleError from 'utils/handleError';

import { UserSortBy, UserFilter } from 'types';

import FilterDialog from './FilterDialog';

const SEARCHBAR_HEIGHT = 60;

const UserListScreen: VFC = () => {
  const [error, setError] = useState('');
  const [isEditId, setIsEditId] = useState('');
  // const searchBarHeight = new Animated.Value(0);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<ASC.User[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [filter] = useState<UserFilter>(UserFilter.ALL);
  const [sortBy, setSortBy] = useState<UserSortBy>(UserSortBy.LAST_CREATED);

  const { client } = useAuth();
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useDebounce('', 1000);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, previous, navigation: nav }: StackHeaderProps) => (
        <Header
          scene={scene}
          navigation={nav}
          previous={previous}
          right={<Appbar.Action icon="filter" onPress={() => setShowDialog(true)} />}
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDisplayName(searchText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  useEffect(() => {
    setUsers([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayName]);

  useEffect(() => {
    onQueryUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, displayName]);

  const onQueryUsers = async () => {
    if (!client.userId) {
      setError('UserId is not reachable!');
    }

    if (loading) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const query = {
        sortBy,
        filter,
        displayName,
        isDeleted: false,
        targetType: 'user',
        paging: { limit: 10 },
        targetId: client.userId!,
      };

      const result = await queryUsers(query);

      setUsers(result);
    } catch (e) {
      const errorText = handleError(e);

      setError(errorText);
    } finally {
      setLoading(false);
    }
  };

  // const onListScroll = (event: number) => {
  //   if (event <= 60 && event > 0) {
  //     setSearchBarHeight(SEARCHBAR_HEIGHT - event);
  //   }
  //   console.log(event);
  //   // const headerHeight = HeaderHeight();
  //   // if (event > headerHeight) {
  //   //   SetHide(true);
  //   //   props.navigation.setParams({
  //   //     hide: true
  //   //   });
  //   //   SetPrevious(event);
  //   // } else if (event < 0.1) {
  //   //   SetHide(false);
  //   //   props.navigation.setParams({
  //   //     hide: false
  //   //   });
  //   //   SetPrevious(event);
  //   // }
  // };

  const data =
    users?.map(user => ({
      ...user,
      onPress: () => {
        // navigation.navigate('User', { ...user, onRefresh: onQueryUsers });
      },
    })) ?? [];

  return (
    <Surface style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchText}
        value={searchText}
        style={{ height: SEARCHBAR_HEIGHT }}
      />

      {error !== '' ? (
        <View>
          <HelperText type="error" style={styles.errorText}>
            {error}
          </HelperText>
          <Button onPress={onQueryUsers}>{t('retry')}</Button>
        </View>
      ) : (
        <Animated.FlatList
          data={data}
          keyExtractor={user => user.userId}
          // onScroll={e => onListScroll(e.nativeEvent.contentOffset.y)}
          // onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: searchBarHeight } } }], {
          //   useNativeDriver: false,
          // })}
          renderItem={({ item }) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <UserItem {...item} onEditUser={setIsEditId} />
          )}
          ListEmptyComponent={<EmptyComponent loading={loading} errorText={t('no_result')} />}
        />
      )}

      {/* <UpdateUser
        onClose={() => {
          setIsEditId('');
          setShowAddPost(false);
        }}
        // displayName' | 'description
        isEditId={isEditId}
        onAddPost={onQueryPost}
        visible={showAddPost || isEditId !== ''}
      /> */}

      <FilterDialog
        sortBy={sortBy}
        // filter={filter}
        setSortBy={setSortBy}
        showDialog={showDialog}
        // setFilter={setFilter}
        setShowDialog={setShowDialog}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: { fontSize: 18, alignSelf: 'center', marginTop: 25, marginBottom: 15 },
});

export default UserListScreen;
