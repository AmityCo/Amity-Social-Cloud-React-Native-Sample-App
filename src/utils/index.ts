export const humanTime = (createdAt: string | number): string => {
	const date = new Date(createdAt);
	return `${date.getHours().toString().padStart(2, '0')}:${date
		.getMinutes()
		.toString()
		.padStart(2, '0')}`;
};

export default {};
