/* eslint-disable import/prefer-default-export */
export enum PostFeedTypeeee {
	Normal = 'normal',
	Global = 'global',
}

export enum PostSortBy {
	FIRST_CREATED = 'firstCreated',
	LAST_CREATED = 'lastCreated',
}

export enum PostFeedType {
	REVIEWING = 'reviewing',
	PUBLISHED = 'published',
}

export type PostProps = ASC.Post & { onPress: () => void };
