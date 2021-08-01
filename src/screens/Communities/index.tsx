import { queryCommunities } from '@amityco/ts-sdk';
import { FlatList, StyleSheet } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import React, { VFC, useState, useEffect, useLayoutEffect } from 'react';
import { Surface, ActivityIndicator, Portal, FAB, useTheme } from 'react-native-paper';

import { Header } from 'components';

import handleError from 'utils/handleError';

import CommunityItem from './CommunityItem';

const CommunitiesScreen: VFC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // const [community, setCommunity] = useState({});
  const [communities, setCommunities] = useState([]);

  const theme = useTheme();
  const isFocused = useIsFocused();
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
    onQueryCommunities();
  }, []);

  const onQueryCommunities = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await queryCommunities();

      setCommunities(result);
    } catch (e) {
      const errorText = handleError(e);

      setError(errorText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Surface style={styles.container}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 25 }} />
        ) : (
          <FlatList
            // style={styles.feed}
            data={communities}
            renderItem={({ item }) => (
              <CommunityItem
                community={item}
                onUpdate={onQueryCommunities}
                onViewCommunity={() => {
                  navigation.navigate('Community', { community: item, navigation });
                }} // setCommunity}
              />
            )}
            keyExtractor={item => item.communityId}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* {!!community?.communityId && (
        <Community community={community} onClose={() => setCommunity({})} />
      )} */}
      </Surface>
      <Portal>
        <FAB
          visible={isFocused}
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // header: {
  //   paddingTop: 64,
  //   paddingBottom: 16,
  //   backgroundColor: '#FFF',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#EBECF4',
  //   shadowColor: '#454D65',
  //   shadowOffset: { height: 5 },
  //   shadowRadius: 15,
  //   shadowOpacity: 0.2,
  //   zIndex: 10,
  // },
  // headerTitle: {
  //   fontSize: 20,
  //   fontWeight: '500',
  // },
  feed: {
    // margin: 16,
  },
  // feedItem: {
  //   backgroundColor: '#FFF',
  //   borderRadius: 5,
  //   padding: 8,
  //   flexDirection: 'row',
  //   marginVertical: 8,
  // },
  // avatar: {
  //   width: 36,
  //   height: 36,
  //   borderRadius: 18,
  //   marginRight: 16,
  // },
  // name: {
  //   fontSize: 15,
  //   fontWeight: '500',
  //   color: '#454D65',
  // },
  // timestamp: {
  //   fontSize: 11,
  //   color: '#C4C6CE',
  //   marginTop: 4,
  // },
  // post: {
  //   marginTop: 16,
  //   fontSize: 14,
  //   color: '#838899',
  // },
  // postImage: {
  //   width: undefined,
  //   height: 150,
  //   borderRadius: 5,
  //   marginVertical: 16,
  // },
});

export default CommunitiesScreen;
