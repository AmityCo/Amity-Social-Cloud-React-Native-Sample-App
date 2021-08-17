// eslint-disable-next-line import/prefer-default-export
export enum CommentSortBy {
	FIRST_CREATED = 'firstCreated',
	LAST_CREATED = 'lastCreated',
	LAST_UPDATED = 'lastUpdated',
	FIRST_UPDATED = 'firstUpdated',
}

export type createCommentType = Pick<
	Amity.Comment<'text'>,
	'metadata' | 'parentId' | 'data' | 'referenceId' | 'referenceType'
>;

export type CommentProps = Amity.Comment & {
	postId?: string;
	selectedComment?: string;
	onReply?: (commentId: string) => void;
	onEdit: (commentId: string) => void;
};
