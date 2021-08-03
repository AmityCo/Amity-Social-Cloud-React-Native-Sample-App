/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { StyleSheet } from 'react-native';
import React, { VFC } from 'react';
import {
  Button,
  Divider,
  RadioButton,
  Portal,
  Dialog,
  Title,
  Switch,
  Text,
  TouchableRipple,
} from 'react-native-paper';

import { t } from 'i18n';

import { PostFeedTypeeee, PostSortBy } from 'types';

type FeedScreenFilterDialog = {
  showDialog: boolean;
  setShowDialog: (showDialog: boolean) => void;
  isDeleted: ASC.Post['isDeleted'];
  setIsDeleted: (status: boolean) => void;
  sortBy: PostSortBy;
  setSortBy: (sortBy: PostSortBy) => void;
  feedTypeee: PostFeedTypeeee;
  setFeedTypeee: (feedType: PostFeedTypeeee) => void;
};

const FeedScreenFilterDialog: VFC<FeedScreenFilterDialog> = ({
  showDialog,
  setShowDialog,
  isDeleted,
  setIsDeleted,
  sortBy,
  setSortBy,
  feedTypeee,
  setFeedTypeee,
}) => {
  return (
    <Portal>
      <Dialog visible={showDialog} dismissable={false}>
        <Dialog.Content>
          <Title>{t('posts.feed_type')}</Title>
          <TouchableRipple
            rippleColor="transparent"
            style={styles.radioArea}
            onPress={() => setFeedTypeee(PostFeedTypeeee.Normal)}
          >
            <>
              <Text>{t(`posts.feed_type_${PostFeedTypeeee.Normal}`)}</Text>
              <RadioButton
                disabled
                value={PostFeedTypeeee.Normal}
                status={feedTypeee === PostFeedTypeeee.Normal ? 'checked' : 'unchecked'}
                onPress={() => setFeedTypeee(PostFeedTypeeee.Normal)}
              />
            </>
          </TouchableRipple>
          <TouchableRipple
            disabled
            rippleColor="transparent"
            style={styles.radioArea}
            onPress={() => setFeedTypeee(PostFeedTypeeee.Global)}
          >
            <>
              <Text>{t(`posts.feed_type_${PostFeedTypeeee.Global}`)}</Text>
              <RadioButton
                value={PostFeedTypeeee.Global}
                status={feedTypeee === PostFeedTypeeee.Global ? 'checked' : 'unchecked'}
                onPress={() => setFeedTypeee(PostFeedTypeeee.Global)}
              />
            </>
          </TouchableRipple>

          <Divider style={styles.divider} />

          <Title>{t('posts.sort_by')}</Title>
          <TouchableRipple
            rippleColor="transparent"
            style={styles.radioArea}
            onPress={() => setSortBy(PostSortBy.FIRST_CREATED)}
          >
            <>
              <Text>{t(`posts.sort_by_${PostSortBy.FIRST_CREATED}`)}</Text>
              <RadioButton
                value={PostSortBy.FIRST_CREATED}
                status={sortBy === PostSortBy.FIRST_CREATED ? 'checked' : 'unchecked'}
                onPress={() => setSortBy(PostSortBy.FIRST_CREATED)}
              />
            </>
          </TouchableRipple>
          <TouchableRipple
            rippleColor="transparent"
            style={styles.radioArea}
            onPress={() => setSortBy(PostSortBy.LAST_CREATED)}
          >
            <>
              <Text>{t(`posts.sort_by_${PostSortBy.LAST_CREATED}`)}</Text>
              <RadioButton
                value={PostSortBy.LAST_CREATED}
                status={sortBy === PostSortBy.LAST_CREATED ? 'checked' : 'unchecked'}
                onPress={() => setSortBy(PostSortBy.LAST_CREATED)}
              />
            </>
          </TouchableRipple>

          <Divider style={styles.divider} />

          <TouchableRipple
            rippleColor="transparent"
            style={[styles.radioArea, styles.includeDeletedArea]}
            onPress={() => setIsDeleted(!isDeleted)}
          >
            <>
              <Text>{t('posts.include_deleted')}</Text>
              <Switch value={isDeleted} onValueChange={() => setIsDeleted(!isDeleted)} />
            </>
          </TouchableRipple>

          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>{t('close')}</Button>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  radioArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: { marginBottom: 25 },
  includeDeletedArea: {
    marginTop: 10,
    marginBottom: 10,
  },
  errorText: { fontSize: 18, alignSelf: 'center', marginTop: 25, marginBottom: 15 },
});

export default FeedScreenFilterDialog;
