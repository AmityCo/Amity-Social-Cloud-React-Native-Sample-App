export type CommunityItemProps = {
	onPress?: () => void;
	onEditCommunity?: (communityId: string) => void;
};

export type AddCommunityType = {
	visible: boolean;
	isEditId: string;
	onClose: () => void;
	onAddCommunity?: () => void;
};

export enum CommunitySortBy {
	FIRST_CREATED = 'firstCreated',
	LAST_CREATED = 'lastCreated',
	DISPLAY_NAME = 'displayName',
}

export enum CommunityMembership {
	MEMBER = 'member',
	NOT_MEMBER = 'notMember',
	ALL = 'all',
}
