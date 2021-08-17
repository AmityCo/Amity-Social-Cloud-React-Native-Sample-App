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

import { FeedType, PostSortBy } from 'types';

type FeedScreenFilterDialog = {
  showDialog: boolean;
  setShowDialog: (showDialog: boolean) => void;
  isDeleted: Amity.Post['isDeleted'];
  setIsDeleted: (status: boolean) => void;
  sortBy: PostSortBy;
  setSortBy: (sortBy: PostSortBy) => void;
  feedType: FeedType;
  setFeedType: (feedType: FeedType) => void;
};

const FeedScreenFilterDialog: VFC<FeedScreenFilterDialog> = ({
  showDialog,
  setShowDialog,
  isDeleted,
  setIsDeleted,
  sortBy,
  setSortBy,
  feedType,
  setFeedType,
}) => {
  return (
    <Portal>
      <Dialog visible={showDialog} dismissable={false}>
        <Dialog.Content>
          <Title>{t('posts.feed_type')}</Title>
          <TouchableRipple
            rippleColor="transparent"
            style={styles.radioArea}
            onPress={() => setFeedType(FeedType.Normal)}
          >
            <>
              <Text>{t(`posts.feed_type_${FeedType.Normal}`)}</Text>
              <RadioButton
                value={FeedType.Normal}
                status={feedType === FeedType.Normal ? 'checked' : 'unchecked'}
                onPress={() => setFeedType(FeedType.Normal)}
              />
            </>
          </TouchableRipple>
          <TouchableRipple
            rippleColor="transparent"
            style={styles.radioArea}
            onPress={() => setFeedType(FeedType.Global)}
          >
            <>
              <Text>{t(`posts.feed_type_${FeedType.Global}`)}</Text>
              <RadioButton
                value={FeedType.Global}
                status={feedType === FeedType.Global ? 'checked' : 'unchecked'}
                onPress={() => setFeedType(FeedType.Global)}
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
