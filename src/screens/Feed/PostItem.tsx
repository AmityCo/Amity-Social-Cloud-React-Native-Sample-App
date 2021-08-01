import Moment from 'moment';
import React, { VFC, useState, useEffect } from 'react';
import { Image, StyleSheet, Pressable, View } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Surface, Caption, Card, useTheme, Paragraph, Button } from 'react-native-paper';
import { observeUser, observeFile, getPost, addReaction, removeReaction } from '@amityco/ts-sdk';

import { t } from 'i18n';

import { PostProps, PostReactions } from 'types';

type PostItemProps = PostProps & { onRefresh: () => void };

const PostItem: VFC<PostItemProps> = ({
  data,
  postId,
  onPress,
  postedUserId,
  commentsCount,
  createdAt,
  children,
  myReactions,
  onRefresh,
  // ...args
}) => {
  const [user, setUser] = useState<ASC.User>();
  const [file, setFile] = useState<ASC.File>();
  const [postImage, setPostImage] = useState<ASC.File>();
  const [childPost, setChildPost] = useState<ASC.Post[]>([]);
  // const [myReaction, setMyReaction] = useState<Pick<ASC.Reactable, 'myReactions'>[]>([]);

  const {
    colors: { text: textColor, primary: primaryColor },
  } = useTheme();

  useEffect(() => {
    if (postedUserId) {
      observeUser(postedUserId, setUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.avatarFileId) {
      observeFile(user.avatarFileId, setFile);
    }
  }, [user]);

  useEffect(() => {
    fetchChildredPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchChildredPost = async () => {
    if (children && children.length > 0) {
      const childrenPost = await getPost(children[0]);

      setChildPost([childrenPost]);
    }
  };

  useEffect(() => {
    if (childPost[0]) {
      observeFile(childPost[0].data?.fileId, setPostImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childPost.length]);

  // TODO api is not there!
  const toggleReaction = async (type: PostReactions) => {
    try {
      const api = myReactions?.includes(type) ? addReaction : removeReaction;

      await api('post', postId, type);
      onRefresh();
    } catch (e) {
      console.log(123, e);
      // TODO toastbar
    }
  };

  const postCreateAt = Moment(createdAt).format('HH:mm, MMM d');

  const LeftContent: VFC = () => <Image source={{ uri: file?.fileUrl }} style={styles.avatar} />;
  const RightContent: VFC<{
    size: number;
  }> = ({ size }) => (
    <Pressable
      style={styles.ellipsis}
      onPress={() => {
        //
      }}
    >
      <Ionicons name="ellipsis-vertical-sharp" size={size} color={textColor} />
    </Pressable>
  );

  return (
    <Surface style={styles.container}>
      <Card onPress={onPress}>
        <Card.Title
          right={RightContent}
          subtitle={postCreateAt}
          title={user?.displayName}
          left={file?.fileUrl ? LeftContent : undefined}
        />
        <Card.Content>
          <Paragraph style={styles.text}>{data.text}</Paragraph>
          {postImage?.fileUrl && <Card.Cover source={{ uri: postImage?.fileUrl }} />}
        </Card.Content>
        <Card.Actions style={styles.footer}>
          <View style={styles.footerLeft}>
            <Button onPress={() => toggleReaction(PostReactions.LIKE)}>
              <MaterialCommunityIcons
                size={20}
                color={myReactions?.includes(PostReactions.LIKE) ? primaryColor : textColor}
                name={myReactions?.includes(PostReactions.LIKE) ? 'thumb-up' : 'thumb-up-outline'}
              />
            </Button>
            <Button onPress={() => toggleReaction(PostReactions.LOVE)}>
              <MaterialCommunityIcons
                size={20}
                name={myReactions?.includes(PostReactions.LOVE) ? 'heart' : 'heart-outline'}
                color={myReactions?.includes(PostReactions.LOVE) ? primaryColor : textColor}
              />
            </Button>
          </View>
          <View style={styles.footerRight}>
            <FontAwesome5
              name="comment"
              size={20}
              color={commentsCount === 0 ? textColor : primaryColor}
            />
            <Caption> {t('posts.commentsCount', { count: commentsCount })}</Caption>
          </View>
        </Card.Actions>
      </Card>
    </Surface>
  );
};

export default PostItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
    borderRadius: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 18,
    marginRight: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
  },
  ellipsis: { marginHorizontal: 10 },
  text: { marginBottom: 10 },
  footer: { justifyContent: 'space-between' },
  footerLeft: { flexDirection: 'row' },
  footerRight: { flexDirection: 'row', paddingEnd: 10 },
});
