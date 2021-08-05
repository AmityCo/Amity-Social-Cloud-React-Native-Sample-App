import { useCallback, useState, useRef } from 'react';

const useDebounce = <T>(
	initialValue: T,
	ms: number,
): [value: T, debouncedSetter: (newValue: T) => void] => {
	const [value, setValue] = useState(initialValue);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const timeout = useRef<any>();
	const debouncedSetter = useCallback(
		(newValue: T) => {
			clearTimeout(timeout.current);
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
