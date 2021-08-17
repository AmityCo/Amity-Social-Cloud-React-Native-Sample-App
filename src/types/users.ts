export type UserItemProps = {
	onPress?: () => void;
	onEditUser?: (userId: string) => void;
};

export enum UserSortBy {
	FIRST_CREATED = 'firstCreated',
	LAST_CREATED = 'lastCreated',
	DISPLAY_NAME = 'displayName',
}

export enum UserFilter {
	ALL = 'all',
	FLAGGED = 'flagged',
}

export type AddUserType = {
	visible: boolean;
	isEditId: string;
	onClose: () => void;
};
