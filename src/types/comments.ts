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
