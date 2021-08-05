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
  Text,
  TouchableRipple,
} from 'react-native-paper';

import { t } from 'i18n';

import { UserSortBy, UserFilter } from 'types';

type FeedScreenFilterDialog = {
  showDialog: boolean;
  setShowDialog: (showDialog: boolean) => void;
  sortBy: UserSortBy;
  setSortBy: (sortBy: UserSortBy) => void;
  // filter: UserFilter;
  // setFilter: (filter: UserFilter) => void;
};

const FeedScreenFilterDialog: VFC<FeedScreenFilterDialog> = ({
  showDialog,
  setShowDialog,
  sortBy,
  setSortBy,
  // filter,
  // setFilter,
}) => {
  return (
    <Portal>
      <Dialog visible={showDialog} dismissable={false}>
        <Dialog.Content>
          {/* <Title>{t('users.filter')}</Title>
          <TouchableRipple
            rippleColor="transparent"
            style={styles.radioArea}
            onPress={() => setFilter(UserFilter.ALL)}
          >
            <>
              <Text>{t(`users.filter_${UserFilter.ALL}`)}</Text>
              <RadioButton
                value={UserFilter.ALL}
                status={filter === UserFilter.ALL ? 'checked' : 'unchecked'}
                onPress={() => setFilter(UserFilter.ALL)}
              />
            </>
          </TouchableRipple>
          <TouchableRipple
            rippleColor="transparent"
            style={styles.radioArea}
            onPress={() => setFilter(UserFilter.FLAGGED)}
          >
            <>
              <Text>{t(`users.filter_${UserFilter.FLAGGED}`)}</Text>
              <RadioButton
                value={UserFilter.FLAGGED}
                status={filter === UserFilter.FLAGGED ? 'checked' : 'unchecked'}
                onPress={() => setFilter(UserFilter.FLAGGED)}
              />
            </>
          </TouchableRipple> */}

          <Divider style={styles.divider} />

          <Title>{t('users.sort_by')}</Title>
          <TouchableRipple
            rippleColor="transparent"
            style={styles.radioArea}
            onPress={() => setSortBy(UserSortBy.FIRST_CREATED)}
          >
            <>
              <Text>{t(`users.sort_by_${UserSortBy.FIRST_CREATED}`)}</Text>
              <RadioButton
                value={UserSortBy.FIRST_CREATED}
                status={sortBy === UserSortBy.FIRST_CREATED ? 'checked' : 'unchecked'}
                onPress={() => setSortBy(UserSortBy.FIRST_CREATED)}
              />
            </>
          </TouchableRipple>
          <TouchableRipple
            rippleColor="transparent"
            style={styles.radioArea}
            onPress={() => setSortBy(UserSortBy.LAST_CREATED)}
          >
            <>
              <Text>{t(`users.sort_by_${UserSortBy.LAST_CREATED}`)}</Text>
              <RadioButton
                value={UserSortBy.LAST_CREATED}
                status={sortBy === UserSortBy.LAST_CREATED ? 'checked' : 'unchecked'}
                onPress={() => setSortBy(UserSortBy.LAST_CREATED)}
              />
            </>
          </TouchableRipple>

          <TouchableRipple
            rippleColor="transparent"
            style={styles.radioArea}
            onPress={() => setSortBy(UserSortBy.DISPLAY_NAME)}
          >
            <>
              <Text>{t(`users.sort_by_${UserSortBy.DISPLAY_NAME}`)}</Text>
              <RadioButton
                value={UserSortBy.DISPLAY_NAME}
                status={sortBy === UserSortBy.DISPLAY_NAME ? 'checked' : 'unchecked'}
                onPress={() => setSortBy(UserSortBy.DISPLAY_NAME)}
              />
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
