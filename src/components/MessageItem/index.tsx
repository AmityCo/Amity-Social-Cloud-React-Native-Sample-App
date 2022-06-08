import dayjs from 'dayjs';
import { View, Pressable, Animated } from 'react-native';
import { Text, useTheme, Avatar } from 'react-native-paper';
import { observeUser, observeFile, observeMessage } from '@amityco/ts-sdk';
import React, { VFC, useState, useEffect, useMemo, useCallback } from 'react';

import overlay from 'utils/overlay';
import { isSameUser as isSameUserUtil, isSameDay as isSameDayUtil } from 'utils/message';

import MessageText from './MessageText';
import MessageImage from './MessageImage';

import { messageStyles } from './styles';

const MessageItem: VFC<{
  message: Amity.Message;
  previousMessage: Amity.Message;
  currentUserId: Amity.User['userId'];
}> = ({ message: messageProp, previousMessage, currentUserId }) => {
  const [user, setUser] = useState<Amity.User>();
  const [avatar, setAvatar] = useState<Amity.File>();
  const [messageData, setMessageData] = useState<Amity.Message>();

  const {
    colors,
    fonts: {
      regular: { fontFamily: regularFont },
    },
    dark,
  } = useTheme();

  const { messageId, userId, type } = messageProp;

  useEffect(() => {
    return observeUser(userId, ({ data }) => {
      setUser(data);
    });
  }, [userId]);

  useEffect(() => {
    return observeMessage(messageId, ({ data }) => {
      setMessageData(data);
    });
  }, [messageId]);

  useEffect(() => {
    if (user?.avatarFileId) {
      return observeFile(user.avatarFileId, ({ data }) => {
        setAvatar(data);
      });
    }

    return undefined;
  }, [user]);

  const isSameDay = useMemo(
    () => isSameDayUtil(messageProp, previousMessage),
    [messageProp, previousMessage],
  );
  const isSameUser = useMemo(
    () => isSameUserUtil(messageProp, previousMessage),
    [messageProp, previousMessage],
  );
  const isSameThread = useMemo(() => isSameUser && isSameDay, [isSameDay, isSameUser]);

  const MessageAvatar = useCallback(() => {
    if (isSameThread) {
      return null;
    }

    return avatar?.fileUrl ? (
      <Avatar.Image source={{ uri: avatar?.fileUrl }} style={messageStyles.avatar} size={40} />
    ) : (
      <Avatar.Text
        size={40}
        style={messageStyles.avatar}
        label={user?.displayName?.slice(0, 2).toUpperCase() ?? ''}
      />
    );
  }, [avatar, isSameThread, user]);

  const MessageHeader = useCallback(() => {
    return isSameThread ? null : (
      <View style={messageStyles.headerView}>
        <Text
          style={[messageStyles.standardFont, messageStyles.headerItem, messageStyles.username]}
        >
          {user?.displayName}
        </Text>
      </View>
    );
  }, [isSameThread, user]);

  const Day = useCallback(() => {
    return isSameDay ? null : (
      <View style={messageStyles.timeContainerStyle}>
        <Text style={messageStyles.timeTextStyle}>
          {dayjs(messageProp.createdAt).format('YYYY MMMM DD')}
        </Text>
      </View>
    );
  }, [isSameDay, messageProp]);

  const container = useMemo(() => ({ marginTop: isSameUser ? 2 : 20 }), [isSameUser]);
  const containerStyle = useMemo(
    () => [messageStyles.container, currentUserId === userId && messageStyles.containerRight],
    [currentUserId, userId],
  );
  const messageHeaderStyle = useMemo(
    () => [
      messageStyles.messageHeader,
      currentUserId === userId && messageStyles.messageHeaderRight,
    ],
    [currentUserId, userId],
  );
  const pressableStyle = useMemo(
    () => [
      messageStyles.bubbleWrapper,
      currentUserId === userId && messageStyles.bubbleWrapperRight,
      currentUserId === userId && { backgroundColor: colors.primary },
      currentUserId !== userId && { backgroundColor: colors.accent },
    ],
    [colors.accent, colors.primary, currentUserId, userId],
  );
  const leftArrowStyle = useMemo(
    () => [
      messageStyles.leftArrow,
      currentUserId === userId && messageStyles.rightArrow,
      currentUserId === userId && { backgroundColor: colors.primary },
      currentUserId !== userId && { backgroundColor: colors.accent },
    ],
    [colors.accent, colors.primary, currentUserId, userId],
  );
  const leftArrowOverlapStyle = useMemo(
    () => [
      messageStyles.leftArrowOverlap,
      currentUserId === userId && messageStyles.rightArrowOverlap,
      {
        backgroundColor: dark ? overlay(4, colors.surface) : colors.surface,
      },
    ],
    [colors.surface, currentUserId, dark, userId],
  );

  return (
    <View style={container}>
      <Day />
      <View style={containerStyle}>
        <View style={messageHeaderStyle}>
          <MessageAvatar />
          <MessageHeader />
        </View>
        <View style={messageStyles.bubbleContainer}>
          <Pressable style={pressableStyle}>
            {messageData && type === 'text' && (
              <MessageText
                message={messageData}
                textStyle={{ color: colors.text, fontFamily: regularFont }}
              />
            )}
            {messageData && type === 'image' && <MessageImage message={messageData} />}

            <View style={leftArrowStyle} />
            <Animated.View style={leftArrowOverlapStyle} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default MessageItem;
