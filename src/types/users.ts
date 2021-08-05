export type UserProps = ASC.User & {
	onPress: () => void;
	onRefresh: () => void;
	onEditUser: (userId: string) => void;
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
	onAddUser: () => void;
};

export type UserItemProps = UserProps & {
	onRefresh: () => void;
	onEditUser?: (userId: string) => void;
};
