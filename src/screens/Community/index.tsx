import { ActivityIndicator, Surface } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getCommunity, createQuery, runQuery } from '@amityco/ts-sdk';
import React, { VFC, useState, useLayoutEffect, useEffect, useCallback } from 'react';

import { Header, CommunityItem, AddPost, FAB, Feed } from 'components';

import { alertError } from 'utils/alerts';

import { DrawerStackHeaderProps } from 'types';

import styles from './styles';

const Community: VFC = () => {
  // const [isEditId, setIsEditId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [community, setCommunity] = useState<Amity.Community>();

  const route = useRoute();
  const navigation = useNavigation();
  const {
    community: { communityId, displayName },
  } = route.params as { community: Amity.Community };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: displayName || 'Commuity',
      header: ({ scene, previous, navigation: nav }: DrawerStackHeaderProps) => (
        <Header scene={scene} navigation={nav} previous={previous} />
      ),
    });
  }, [displayName, navigation]);

  const getCurrentCommunity = useCallback(async () => {
    setLoading(true);

    const query = createQuery(getCommunity, communityId);

    runQuery(query, ({ data, error, loading: loading_ }) => {
      if (data) {
        if (data.isDeleted) {
          navigation.goBack();
        } else {
          setCommunity(data);
        }
      } else if (error) {
        alertError(error, () => {
          navigation.goBack();
        });
      }

      setLoading(!!loading_);
    });
  }, [communityId, navigation]);

  useEffect(() => {
    getCurrentCommunity();
  }, [communityId, getCurrentCommunity]);

  const onCloseAddPost = useCallback(() => {
    setShowAddPost(false);
  }, []);

  const onEditCommunity = useCallback(() => {
    // setIsEditId(id);
  }, []);

  return (
    <Surface style={styles.container}>
      {loading || !community?.communityId ? (
        <ActivityIndicator style={styles.loading} />
      ) : (
        <CommunityItem community={community} onEditCommunity={onEditCommunity} />
      )}

      <Feed targetId={communityId} targetType="community" />

      {showAddPost && (
        <AddPost
          isEditId=""
          targetType="community"
          targetId={communityId}
          onClose={onCloseAddPost}
        />
      )}

      <FAB
        icon="plus"
        onPress={() => {
          setShowAddPost(true);
        }}
      />
    </Surface>
  );
};

export default Community;
