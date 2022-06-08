import dayjs from 'dayjs';

export const isSameDay = (currentMessage: Amity.Message, diffMessage: Amity.Message): boolean => {
  if (!diffMessage || !diffMessage.createdAt) {
    return false;
  }
  const currentCreatedAt = dayjs(currentMessage.createdAt);
  const diffCreatedAt = dayjs(diffMessage.createdAt);
  if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
    return false;
  }
  return currentCreatedAt.isSame(diffCreatedAt, 'day');
};

export const isSameUser = (currentMessage: Amity.Message, diffMessage: Amity.Message): boolean => {
  return !!(diffMessage && diffMessage.userId === currentMessage.userId);
};

export default {};
