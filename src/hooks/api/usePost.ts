import React, { VFC, useState, useEffect } from 'react';
import {
	observeUser,
	observeFile,
	getPost,
	//   addReaction,
	//   removeReaction,
	deletePost,
} from '@amityco/ts-sdk';

import { PostReactions } from 'types';

const usePost = (
	postId: string,
	postedUserId: string,
	children: string[],
	// myReactions: string[] | undefined,
): {
	user?: ASC.User;
	file?: ASC.File;
	postImage?: ASC.File;
	childPost?: ASC.Post[];
	toggleReaction: (type: PostReactions) => void;
	onEdit: () => void;
	onDelete: () => Promise<boolean> | Error;
	onFlag: () => void;
	onUnflag: () => void;
} => {
	const [user, setUser] = useState<ASC.User>();
	const [file, setFile] = useState<ASC.File>();
	const [postImage, setPostImage] = useState<ASC.File>();
	const [childPost, setChildPost] = useState<ASC.Post[]>([]);
	// const [myReaction, setMyReaction] = useState<Pick<ASC.Reactable, 'myReactions'>[]>([]);

	useEffect(() => {
		if (postedUserId) {
			observeUser(postedUserId, setUser);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (user?.avatarFileId) {
			observeFile(user.avatarFileId, setFile);
		}
	}, [user]);

	useEffect(() => {
		fetchChildredPost();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchChildredPost = async () => {
		if (children && children.length > 0) {
			const childrenPost = await getPost(children[0]);

			setChildPost([childrenPost]);
		}
	};

	useEffect(() => {
		if (childPost[0]) {
			observeFile(childPost[0].data?.fileId, setPostImage);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [childPost.length]);

	// TODO api is not there!
	const toggleReaction = async (type: PostReactions) => {
		// try {
		//   const api = myReactions?.includes(type) ? addReaction : removeReaction;
		//   await api('post', postId, type);
		// } catch (e) {
		//   console.log(123, e);
		//   // TODO toastbar
		// }
	};

	// TODO
	const onEdit = () => {
		//
	};

	// TODO return type!
	const onDelete = async () => {
		const data = await deletePost(postId);
		return data;
	};

	// TODO
	const onFlag = () => {
		//
	};

	// TODO
	const onUnflag = () => {
		//
	};

	return { user, file, postImage, childPost, toggleReaction, onEdit, onDelete, onFlag, onUnflag };
};

export default usePost;
