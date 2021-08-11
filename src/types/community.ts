export type CommunityItemProps = ASC.Community & {
	onPress: () => void;
	onEditCommunity?: (communityId: string) => void;
};

export type AddCommunityType = {
	visible: boolean;
	isEditId: string;
	onClose: () => void;
};
