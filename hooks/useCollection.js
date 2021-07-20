import { useState } from "react";

export default (
  defaultValue = [],
  findIndex = (collection, index) => collection.indexOf(index)
) => {
  const [collection, setCollection] = useState(defaultValue);

  const addToCollection = (...items) => {
    const toAdd = items.filter((item) => findIndex(collection, item) === -1);
    if (toAdd.length) setCollection([...collection, ...toAdd]);
  };

  const removeFromCollection = (...items) => {
    const toRem = items.filter((item) => findIndex(collection, item) !== -1);
    if (toRem.length)
      setCollection(collection.filter((item) => !toRem.includes(item)));
  };

  const toggleCollection = (item) => {
    const index = findIndex(collection, item);
    if (index === -1) addToCollection(item);
    else removeFromCollection(item);
  };

  const resetCollection = () => {
    setCollection([]);
  };

  return [
    collection,
    addToCollection,
    removeFromCollection,
    toggleCollection,
    resetCollection,
  ];
};
