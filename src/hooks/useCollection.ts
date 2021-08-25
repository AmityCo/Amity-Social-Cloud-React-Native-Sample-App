/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from 'react';

const useCollection = <T>(
  defaultValue: T[],
  findIndex = (collection: T[], index: T): number => collection.indexOf(index),
): [T[], (...items: T[]) => void, (...items: T[]) => void, (item: T) => void, () => void] => {
  const [collection, setCollection] = useState(defaultValue);

  const addToCollection = useCallback(
    (...items: T[]) => {
      const toAdd = items.filter(item => findIndex(collection, item) === -1);
      if (toAdd.length) setCollection([...collection, ...toAdd]);
    },
    [collection, findIndex],
  );

  const removeFromCollection = useCallback(
    (...items: T[]) => {
      const toRem = items.filter(item => findIndex(collection, item) !== -1);
      if (toRem.length) setCollection(collection.filter(item => !toRem.includes(item)));
    },
    [collection, findIndex],
  );

  const toggleCollection = useCallback(
    (item: T) => {
      const index = findIndex(collection, item);
      if (index === -1) addToCollection(item);
      else removeFromCollection(item);
    },
    [addToCollection, collection, findIndex, removeFromCollection],
  );

  const resetCollection = useCallback(() => {
    setCollection([]);
  }, []);

  return [collection, addToCollection, removeFromCollection, toggleCollection, resetCollection];
};

export default useCollection;
