import { Surface, HelperText, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { KeyboardAvoidingView, Platform, View, FlatList } from 'react-native';
import React, { VFC, useState, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import {
  runQuery,
  createQuery,
  queryMessages,
  observeMessages,
  sortByChannelSegment,
} from '@amityco/ts-sdk';

import { Header, MessageItem, Loading } from 'components';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import getErrorMessage from 'utils/getErrorMessage';

import { DrawerStackHeaderProps, LoadingState } from 'types';

import styles from './styles';

const QUERY_LIMIT = 10;

const ChatScreen: VFC = () => {
  const flatListRef = useRef(null);
  const [messages, setMessages] = useState<Amity.Message[]>([]);
  const [loading, setLoading] = useState<LoadingState>(LoadingState.NOT_LOADING);

  const [options, setOptions] = useState<Amity.RunQueryOptions<typeof queryMessages>>();
  const { prevPage, error } = options ?? {};

  const route = useRoute();
  const { client } = useAuth();
  const navigation = useNavigation();

  const {
    channel: { displayName, channelId },
  } = route.params as { channel: Amity.Channel };

  const userId = client.userId ?? '';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: displayName ?? channelId,
      header: ({ scene, previous, navigation: nav }: DrawerStackHeaderProps) => (
        <Header scene={scene} navigation={nav} previous={previous} />
      ),
    });
  }, [channelId, displayName, navigation]);

  // useEffect(
  //   () =>
  //     observeMessages(channelId, {
  //       onEvent: (action, message) => {
  //         console.log({ action, message });
  //         // if (action === 'onCreate' && !!message.data) {
  //         //   setMessages(prevState => [message.data]);

  //         //   // flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
  //         // } else if (action === 'onDelete')
  //         //   setMessages(prevState => prevState.filter(c => c.messageId !== message.messageId));
  //         // },
  //       },
  //     }),
  //   [channelId],
  // );

  const onQueryMessages = useCallback(
    async ({ reset = false, page = { limit: QUERY_LIMIT } }) => {
      const queryData = {
        page,
        channelId,
      };

      runQuery(createQuery(queryMessages, queryData), ({ data, ...metadata }) => {
        if (data) {
          setMessages(prevMessage => (reset ? data : [...prevMessage, ...data]));
        }

        setOptions(metadata);

        if (!metadata.loading) {
          setLoading(LoadingState.NOT_LOADING);
        }
      });
    },
    [channelId],
  );

  useEffect(() => {
    onQueryMessages({ reset: true });
  }, [onQueryMessages]);

  const handleLoadMore = () => {
    if (prevPage) {
      setLoading(LoadingState.IS_LOADING_MORE);
      onQueryMessages({ page: prevPage });
    }
  };

  const data = messages.sort(sortByChannelSegment).reverse();

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <MessageItem message={item} previousMessage={data[index + 1]} currentUserId={userId} />
      );
    },
    [data, userId],
  );

  const renderFooter = () => {
    if (loading === LoadingState.NOT_LOADING || !prevPage) {
      return null;
    }

    return (
      <View style={styles.loading}>
        <Loading />
      </View>
    );
  };

  const keyExtractor = (item: Amity.Message) => item.messageId.toString();

  const errorText = getErrorMessage(error);

  return (
    <Surface style={styles.container}>
      <KeyboardAvoidingView
        style={styles.mainContainer}
        behavior="padding"
        enabled={Platform.OS === 'ios'}
      >
        {error ? (
          <HelperText type="error" style={styles.errorText}>
            {errorText}
          </HelperText>
        ) : (
          <FlatList
            ref={flatListRef}
            inverted
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              loading === LoadingState.NOT_LOADING ? (
                <Text style={styles.emptyMessage}>{t('chat.emptyMessage')}</Text>
              ) : null
            }
            onEndReachedThreshold={0.3}
            onEndReached={handleLoadMore}
          />
        )}
      </KeyboardAvoidingView>
    </Surface>
  );
};

export default ChatScreen;
