export type CommunityProps = ASC.Community & { onPress: () => void };

export type CommunityItemProps = CommunityProps & {
	onRefresh: () => void;
	onEditCommunity?: (communityId: string) => void;
};
