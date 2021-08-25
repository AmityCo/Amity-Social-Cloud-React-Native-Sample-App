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

import { FeedTargetType } from 'types';

import { filterDialogStyles } from './styles';

type FeedScreenFilterDialog = {
  targetFeedType: FeedTargetType;
  isDeleted: Amity.Post['isDeleted'];
  setIsDeleted: (status: boolean) => void;
  setShowDialog: (showDialog: boolean) => void;
  setTargetFeedType: (targetFeedType: FeedTargetType) => void;
};

const FeedScreenFilterDialog: VFC<FeedScreenFilterDialog> = ({
  isDeleted,
  setIsDeleted,
  setShowDialog,
  targetFeedType,
  setTargetFeedType,
}) => {
  return (
    <Portal>
      <Dialog visible dismissable={false}>
        <Dialog.Content>
          <Title>{t('posts.feed_type')}</Title>
          <TouchableRipple
            rippleColor="transparent"
            style={filterDialogStyles.radioArea}
            onPress={() => setTargetFeedType(FeedTargetType.Normal)}
          >
            <>
              <Text>{t(`posts.feed_type_${FeedTargetType.Normal}`)}</Text>
              <RadioButton
                value={FeedTargetType.Normal}
                status={targetFeedType === FeedTargetType.Normal ? 'checked' : 'unchecked'}
                onPress={() => setTargetFeedType(FeedTargetType.Normal)}
              />
            </>
          </TouchableRipple>
          <TouchableRipple
            rippleColor="transparent"
            style={filterDialogStyles.radioArea}
            onPress={() => setTargetFeedType(FeedTargetType.Global)}
          >
            <>
              <Text>{t(`posts.feed_type_${FeedTargetType.Global}`)}</Text>
              <RadioButton
                value={FeedTargetType.Global}
                status={targetFeedType === FeedTargetType.Global ? 'checked' : 'unchecked'}
                onPress={() => setTargetFeedType(FeedTargetType.Global)}
              />
            </>
          </TouchableRipple>

          {targetFeedType === FeedTargetType.Normal && (
            <>
              <Divider style={filterDialogStyles.divider} />
              <TouchableRipple
                rippleColor="transparent"
                style={[filterDialogStyles.radioArea, filterDialogStyles.includeDeletedArea]}
                onPress={() => setIsDeleted(!isDeleted)}
              >
                <>
                  <Text>{t('posts.include_deleted')}</Text>
                  <Switch value={isDeleted} onValueChange={() => setIsDeleted(!isDeleted)} />
                </>
              </TouchableRipple>
            </>
          )}

          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>{t('close')}</Button>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default FeedScreenFilterDialog;
