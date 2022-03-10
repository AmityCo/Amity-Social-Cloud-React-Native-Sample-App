import { format } from 'date-fns';
import { Image, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { VFC, useState, useEffect, useCallback } from 'react';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Caption, Card, useTheme, Paragraph, Button, Text } from 'react-native-paper';
import {
  observeUser,
  observeFile,
  getPosts,
  addReaction,
  removeReaction,
  deletePost,
  fileUrlWithSize,
  runQuery,
  createQuery,
  isReportedByMe,
  createReport,
  deleteReport,
  observePost,
  getPostTopic,
  subscribeTopic,
} from '@amityco/ts-sdk';

import { t } from 'i18n';
import useAuth from 'hooks/useAuth';
import { alertError, alertConfirmation } from 'utils/alerts';

import { ReactionsType } from 'types';

import CardTitle from '../CardTitle';
import HeaderMenu from '../HeaderMenu';

import styles from './styles';

export type PostItemProps = {
  onPress?: () => void;
  onEditPost?: (postId: string) => void;
};

const PostItem: VFC<{ post: Amity.Post; subscribable?: boolean } & PostItemProps> = ({
  post: postProp,
  onEditPost,
  onPress,
  subscribable = false,
}) => {
  const [user, setUser] = useState<Amity.User>();
  const [file, setFile] = useState<Amity.File>();
  const [openMenu, setOpenMenu] = useState(false);
  const [flaggedByMe, setFlaggedByMe] = useState(false);
  const [postImage, setPostImage] = useState<Amity.File>();
  const [childPost, setChildPost] = useState<Amity.Post[]>([]);
  const [postResult, setPostResult] = useState<Amity.Snapshot<Amity.Post | undefined>>({
    data: postProp,
    loading: false,
    origin: 'local',
  });

  const { data: post } = postResult;

  const { client } = useAuth();
  const navigation = useNavigation();
  const {
    colors: { text: textColor, primary: primaryColor },
  } = useTheme();

  const {
    data,
    postId,
    postedUserId,
    commentsCount,
    createdAt,
    myReactions,
    reactions,
    children,
    flagCount,
    isDeleted,
  } = post as Amity.Post;

  const checkIsReportedByMe = useCallback(async () => {
    runQuery(createQuery(isReportedByMe, 'post', postId), result => {
      setFlaggedByMe(!!result.data);
    });
  }, [postId]);

  useEffect(() => {
    return observePost(postId, updatedPost => {
      // console.log('observePost', { updatedPost });
      checkIsReportedByMe();
      setPostResult(updatedPost);
    });
  }, [checkIsReportedByMe, postId]);

  useEffect(() => {
    if (!post?.path || !subscribable) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return subscribeTopic(getPostTopic(post));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.path]);

  useEffect(() => {
    return observeUser(postedUserId, ({ data: updatedUser }) => {
      setUser(updatedUser);
    });
  }, [postedUserId]);

  useEffect(() => {
    if (user?.avatarFileId) {
      return observeFile(user.avatarFileId, fileObj => setFile(fileObj.data));
    }

    return () => {
      //
    };
  }, [user]);

  useEffect(() => {
    if (childPost[0]?.data?.fileId) {
      return observeFile(childPost[0].data?.fileId, imgObj => setPostImage(imgObj.data));
    }

    return () => {
      //
    };
  }, [childPost]);

  const fetchChildrenPost = useCallback(async () => {
    if (children && children?.length > 0) {
      const query = createQuery(getPosts, children);

      runQuery(query, ({ data: postData, error }) => {
        if (postData) {
          const posts = Object.values(postData);

          setChildPost(posts);
        } else if (error) {
          alertError(error);
        }
      });
    }
  }, [children]);

  useEffect(() => {
    fetchChildrenPost();
  }, [fetchChildrenPost]);

  const toggleReaction = async (type: ReactionsType) => {
    const api = myReactions?.includes(type) ? removeReaction : addReaction;
    const query = createQuery(api, 'post', postId, type);

    runQuery(query);
  };

  const toggleFlag = async () => {
    const api = flaggedByMe ? deleteReport : createReport;
    const query = createQuery(api, 'post', postId);

    runQuery(query);
  };

  const onEdit = () => {
    setOpenMenu(false);

    if (onEditPost) {
      onEditPost(postId);
    }
  };

  const onDelete = () => {
    alertConfirmation(() => {
      setOpenMenu(false);

      // const isPermanentDelete = !!isDeleted;
      // console.log(1);

      runQuery(createQuery(deletePost, postId, true), ({ data: postData, error }) => {
        // console.log(2, { postData, error });
        if (postData) {
          if (!onPress) {
            navigation.goBack();
          }
        } else if (error) {
          // console.log(3, { error });
          alertError(error);
        }
      });
    });
  };

  const postCreateAt = format(new Date(createdAt), 'HH:mm, MMM d');

  const isUser = client.userId === postedUserId;
  const canEdit = isUser && onEditPost ? onEdit : undefined;
  const canDelete = isUser ? onDelete : undefined;

  return (
    <Card onPress={onPress}>
      <Card.Title
        right={({ size }) => (
          <HeaderMenu
            size={size}
            visible={openMenu}
            onEdit={canEdit}
            onDelete={canDelete}
            onToggleMenu={() => setOpenMenu(prev => !prev)}
          />
        )}
        subtitle={postCreateAt}
        title={<CardTitle title={user?.displayName} flagCount={flagCount} isDeleted={isDeleted} />}
        left={
          file?.fileUrl
            ? () => <Image style={styles.avatar} source={{ uri: file?.fileUrl }} />
            : undefined
        }
      />

      <Card.Content>
        <ScrollView style={styles.content}>
          <Paragraph style={styles.text}>{data.text}</Paragraph>
        </ScrollView>
        {postImage?.fileUrl && postImage?.type === 'image' && (
          <Card.Cover source={{ uri: fileUrlWithSize(postImage?.fileUrl, 'medium') }} />
        )}
      </Card.Content>

      <Card.Actions style={styles.footer}>
        <View style={styles.footerLeft}>
          <Button onPress={() => toggleReaction(ReactionsType.LIKE)}>
            <MaterialCommunityIcons
              size={20}
              color={myReactions?.includes(ReactionsType.LIKE) ? primaryColor : textColor}
              name={myReactions?.includes(ReactionsType.LIKE) ? 'thumb-up' : 'thumb-up-outline'}
            />
            {reactions[ReactionsType.LIKE] > 0 && <Text>{reactions[ReactionsType.LIKE]}</Text>}
          </Button>
          <Button onPress={() => toggleReaction(ReactionsType.LOVE)}>
            <MaterialCommunityIcons
              size={20}
              name={myReactions?.includes(ReactionsType.LOVE) ? 'heart' : 'heart-outline'}
              color={myReactions?.includes(ReactionsType.LOVE) ? primaryColor : textColor}
            />
            {reactions[ReactionsType.LOVE] > 0 && <Text>{reactions[ReactionsType.LOVE]}</Text>}
          </Button>
          <Button onPress={toggleFlag}>
            <MaterialCommunityIcons
              size={20}
              name={flaggedByMe ? 'flag' : 'flag-plus-outline'}
              color={flaggedByMe ? primaryColor : textColor}
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
  );
};

export default PostItem;
