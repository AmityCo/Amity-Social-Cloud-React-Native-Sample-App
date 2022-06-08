import zacs from '@nozbe/zacs';
import { format, isSameDay } from 'date-fns';
import { Text, useTheme } from 'react-native-paper';
import { View, Pressable, Animated } from 'react-native';
import { observeUser, observeMessage } from '@amityco/ts-sdk';
import React, { VFC, useState, useEffect, useMemo } from 'react';

import overlay from 'utils/overlay';

import MessageText from './MessageText';
import MessageImage from './MessageImage';
import MessageAvatar from './MessageAvatar';

import { messageStyles } from './styles';

const MessageItem: VFC<{
  message: Amity.Message;
  previousMessage: Amity.Message;
  currentUserId: Amity.User['userId'];
}> = ({ message: messageProp, previousMessage, currentUserId }) => {
  const [user, setUser] = useState<Amity.User>();
  const [messageData, setMessageData] = useState<Amity.Message>();

  const {
    colors,
    fonts: {
      regular: { fontFamily: regularFont },
    },
    dark,
  } = useTheme();

  const { messageId, userId, type, createdAt } = messageProp;

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

  const isSameDayMemo = useMemo(
    () =>
      !!previousMessage?.createdAt &&
      isSameDay(new Date(messageProp.createdAt), new Date(previousMessage.createdAt)),
    [messageProp, previousMessage],
  );
  const isSameUser = useMemo(
    () => !!previousMessage?.userId && previousMessage.userId === messageProp.userId,
    [messageProp, previousMessage],
  );
  // const isSameThread = useMemo(() => isSameUser && isSameDay, [isSameDay, isSameUser]);

  // const MessageAvatar = useCallback(() => {
  //   if (isSameThread) {
  //     return null;
  //   }

  //   return avatar?.fileUrl ? (
  //     <Avatar.Image source={{ uri: avatar?.fileUrl }} style={messageStyles.avatar} size={40} />
  //   ) : (
  //     <Avatar.Text
  //       size={40}
  //       style={messageStyles.avatar}
  //       label={user?.displayName?.slice(0, 2).toUpperCase() ?? ''}
  //     />
  //   );
  // }, [avatar, isSameThread, user]);

  // const MessageHeader = useCallback(() => {
  //   return isSameThread ? null : (
  //     <View style={messageStyles.headerView}>
  //       <Text
  //         style={[messageStyles.standardFont, messageStyles.headerItem, messageStyles.username]}
  //       >
  //         {user?.displayName}
  //       </Text>
  //     </View>
  //   );
  // }, [isSameThread, user]);

  // const Day = useCallback(() => {
  //   return isSameDay ? null : (
  //     <View style={messageStyles.timeContainerStyle}>
  //       <Text style={messageStyles.timeTextStyle}>
  //         {dayjs(messageProp.createdAt).format('YYYY MMMM DD')}
  //       </Text>
  //     </View>
  //   );
  // }, [isSameDay, messageProp]);

  // const container = useMemo(() => ({ marginTop: isSameUser ? 2 : 20 }), [isSameUser]);
  // const containerStyle = useMemo(
  //   () => [messageStyles.container, currentUserId === userId && messageStyles.containerRight],
  //   [currentUserId, userId],
  // );
  // const messageHeaderStyle = useMemo(
  //   () => [
  //     messageStyles.messageHeader,
  //     currentUserId === userId && messageStyles.messageHeaderRight,
  //   ],
  //   [currentUserId, userId],
  // );
  // const pressableStyle = useMemo(
  //   () => [
  //     messageStyles.bubbleWrapper,
  //     currentUserId === userId && messageStyles.bubbleWrapperRight,
  //     currentUserId === userId && { backgroundColor: colors.primary },
  //     currentUserId !== userId && { backgroundColor: colors.accent },
  //   ],
  //   [colors.accent, colors.primary, currentUserId, userId],
  // );
  // const leftArrowStyle = useMemo(
  //   () => [
  //     messageStyles.leftArrow,
  //     currentUserId === userId && messageStyles.rightArrow,
  //     currentUserId === userId && { backgroundColor: colors.primary },
  //     currentUserId !== userId && { backgroundColor: colors.accent },
  //   ],
  //   [colors.accent, colors.primary, currentUserId, userId],
  // );
  // const leftArrowOverlapStyle = useMemo(
  //   () => [
  //     messageStyles.leftArrowOverlap,
  //     currentUserId === userId && messageStyles.rightArrowOverlap,
  //     {
  //       backgroundColor: dark ? overlay(4, colors.surface) : colors.surface,
  //     },
  //   ],
  //   [colors.surface, currentUserId, dark, userId],
  const isSameThread = useMemo(() => isSameUser && isSameDayMemo, [isSameDayMemo, isSameUser]);

  const Message = zacs.view(messageStyles.message, { isSameUser: messageStyles.messageMe });
  const Container = zacs.view(messageStyles.container, {
    currentUser: messageStyles.containerRight,
  });
  const Header = zacs.view(messageStyles.messageHeader, {
    currentUser: messageStyles.messageHeaderRight,
  });
  const Bubble = zacs.styled(Pressable, messageStyles.bubbleWrapper, {
    currentUser: [messageStyles.bubbleWrapperRight, { backgroundColor: colors.primary }],
    guestUser: { backgroundColor: colors.accent },
  });
  const LeftArrow = zacs.view(messageStyles.leftArrow, {
    currentUser: [messageStyles.rightArrow, { backgroundColor: colors.primary }],
    guestUser: { backgroundColor: colors.accent },
  });
  const LeftArrowOverLap = zacs.styled(
    Animated.View,
    messageStyles.leftArrowOverlap,
    { currentUser: messageStyles.rightArrowOverlap },
    { backgroundColor: 'backgroundColor' },
  );

  const messageCreateAt = format(new Date(messageProp.createdAt ?? createdAt), 'yyyy MMMM dd');

  return (
    <Message isSameUser={isSameUser}>
      {!isSameDayMemo && (
        <View style={messageStyles.timeContainerStyle}>
          <Text style={messageStyles.timeTextStyle}>{messageCreateAt}</Text>
        </View>
      )}
      <Container currentUser={currentUserId === userId}>
        <Header currentUser={currentUserId === userId}>
          {!isSameThread && user && <MessageAvatar user={user} />}
          {!isSameThread && (
            <View style={messageStyles.headerView}>
              <Text
                style={[
                  messageStyles.standardFont,
                  messageStyles.headerItem,
                  messageStyles.username,
                ]}
              >
                {user?.displayName}
              </Text>
            </View>
          )}
        </Header>
        <View style={messageStyles.bubbleContainer}>
          {/* <Pressable style={pressableStyle}>
            {messageData && type === 'text' && ( */}
          <Bubble currentUser={currentUserId === userId} guestUser={currentUserId !== userId}>
            {/* {type === 'text' && messageData && (
              <MessageText
                message={messageData}
                textStyle={{ color: colors.text, fontFamily: regularFont }}
              />
            )} */}
            {/* {messageData && type === 'image' && <MessageImage message={messageData} />}

            <View style={leftArrowStyle} />
            <Animated.View style={leftArrowOverlapStyle} />
          </Pressable> */}

            {type === 'text' && messageData && <MessageText message={messageData} />}
            {type === 'image' && messageData && <MessageImage message={messageData} />}

            <LeftArrow
              currentUser={currentUserId === userId}
              guestUser={currentUserId !== userId}
            />
            <LeftArrowOverLap
              currentUser={currentUserId === userId}
              backgroundColor={dark ? overlay(4, colors.surface) : colors.surface}
            />
          </Bubble>
        </View>
      </Container>
    </Message>
  );
};

export default MessageItem;
