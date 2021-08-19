import { useCallback, useState, useRef } from 'react';

const useDebounce = <T>(
	initialValue: T,
	ms: number,
): [value: T, debouncedSetter: (newValue: T) => void] => {
	const [value, setValue] = useState(initialValue);

	const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
	const debouncedSetter = useCallback(
		(newValue: T) => {
			if (timeout.current) {
				clearTimeout(timeout.current);
			}

			timeout.current = setTimeout(() => {
				setValue(newValue);
			}, ms);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[initialValue, ms],
	);

	return [value, debouncedSetter];
};

export default useDebounce;
