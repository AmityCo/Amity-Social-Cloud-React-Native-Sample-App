import { useState } from 'react';

const useCollection = <T>(
	defaultValue: T[],
	findIndex = (collection: T[], index: T): number => collection.indexOf(index),
): [T[], (...items: T[]) => void, (...items: T[]) => void, (item: T) => void, () => void] => {
	const [collection, setCollection] = useState(defaultValue);

	const addToCollection = (...items: T[]) => {
		const toAdd = items.filter(item => findIndex(collection, item) === -1);
		if (toAdd.length) setCollection([...collection, ...toAdd]);
	};

	const removeFromCollection = (...items: T[]) => {
		const toRem = items.filter(item => findIndex(collection, item) !== -1);
		if (toRem.length) setCollection(collection.filter(item => !toRem.includes(item)));
	};

	const toggleCollection = (item: T) => {
		const index = findIndex(collection, item);
		if (index === -1) addToCollection(item);
		else removeFromCollection(item);
	};

	const resetCollection = () => {
		setCollection([]);
	};

	return [collection, addToCollection, removeFromCollection, toggleCollection, resetCollection];
};

export default useCollection;
