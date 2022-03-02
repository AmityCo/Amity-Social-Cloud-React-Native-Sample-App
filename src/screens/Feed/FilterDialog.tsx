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

type FeedScreenFilterDialogType = {
  useCustomRanking?: boolean;
  targetFeedType: FeedTargetType;
  isDeleted: Amity.Post['isDeleted'];
  setIsDeleted: (status: boolean) => void;
  setCustomRanking: (status: boolean) => void;
  setShowDialog: (showDialog: boolean) => void;
  setTargetFeedType: (targetFeedType: FeedTargetType) => void;
};

const FeedScreenFilterDialog: VFC<FeedScreenFilterDialogType> = ({
  isDeleted,
  setIsDeleted,
  setShowDialog,
  targetFeedType,
  setCustomRanking,
  setTargetFeedType,
  useCustomRanking = false,
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
            <React.Fragment>
              <Text>{t(`posts.feed_type_${FeedTargetType.Normal}`)}</Text>
              <RadioButton
                value={FeedTargetType.Normal}
                status={targetFeedType === FeedTargetType.Normal ? 'checked' : 'unchecked'}
                onPress={() => setTargetFeedType(FeedTargetType.Normal)}
              />
            </React.Fragment>
          </TouchableRipple>
          <TouchableRipple
            rippleColor="transparent"
            style={filterDialogStyles.radioArea}
            onPress={() => setTargetFeedType(FeedTargetType.Global)}
          >
            <React.Fragment>
              <Text>{t(`posts.feed_type_${FeedTargetType.Global}`)}</Text>
              <RadioButton
                value={FeedTargetType.Global}
                status={targetFeedType === FeedTargetType.Global ? 'checked' : 'unchecked'}
                onPress={() => setTargetFeedType(FeedTargetType.Global)}
              />
            </React.Fragment>
          </TouchableRipple>

          {targetFeedType === FeedTargetType.Normal && (
            <React.Fragment>
              <Divider style={filterDialogStyles.divider} />
              <TouchableRipple
                rippleColor="transparent"
                style={[filterDialogStyles.radioArea, filterDialogStyles.includeDeletedArea]}
                onPress={() => setIsDeleted(!isDeleted)}
              >
                <React.Fragment>
                  <Text>{t('posts.include_deleted')}</Text>
                  <Switch value={isDeleted} onValueChange={() => setIsDeleted(!isDeleted)} />
                </React.Fragment>
              </TouchableRipple>
            </React.Fragment>
          )}

          {targetFeedType === FeedTargetType.Global && (
            <React.Fragment>
              <Divider style={filterDialogStyles.divider} />
              <TouchableRipple
                rippleColor="transparent"
                style={[filterDialogStyles.radioArea, filterDialogStyles.includeDeletedArea]}
                onPress={() => setCustomRanking(!useCustomRanking)}
              >
                <React.Fragment>
                  <Text>{t('posts.custom_ranking')}</Text>
                  <Switch
                    value={useCustomRanking}
                    onValueChange={() => setCustomRanking(!useCustomRanking)}
                  />
                </React.Fragment>
              </TouchableRipple>
            </React.Fragment>
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
