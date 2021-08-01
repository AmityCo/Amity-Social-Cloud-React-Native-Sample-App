/* eslint-disable import/prefer-default-export */
export enum PostFeedTypeeee {
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

export enum PostReactions {
	LIKE = 'like',
	LOVE = 'love',
}

export type PostProps = ASC.Post & { onPress: () => void };
