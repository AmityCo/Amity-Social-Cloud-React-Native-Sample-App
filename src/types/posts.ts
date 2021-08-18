/* eslint-disable import/prefer-default-export */
export enum FeedType {
	Normal = 'normal',
	Global = 'global',
}

export enum PostSortBy {
	FIRST_CREATED = 'firstCreated',
	LAST_CREATED = 'lastCreated',
	LAST_UPDATED = 'lastUpdated',
	FIRST_UPDATED = 'firstUpdated',
}

export enum PostFeedType {
	REVIEWING = 'reviewing',
	PUBLISHED = 'published',
}

export type AddFeedType = {
	visible: boolean;
	isEditId: string;
	onClose: () => void;
	communityId?: string;
	// onAddPost: () => void;
};

export type AddPostDataType = {
	data: {
		text: string;
		images?: string[];
	};
	targetType: string;
	targetId: string;
};

export type UpdatePostDataType = Patch<Amity.Post, 'data' | 'metadata'>;

export type UploadedPostImageType = Amity.File & { uri: string };

export type PostItemProps = {
	onPress?: () => void;
	onEditPost?: (postId: string) => void;
};
