export type UserProps = ASC.User & { onPress: () => void };

export enum UserSortBy {
	FIRST_CREATED = 'firstCreated',
	LAST_CREATED = 'lastCreated',
	DISPLAY_NAME = 'displayName',
}

export enum UserFilter {
	ALL = 'all',
	FLAGGED = 'flagged',
}
