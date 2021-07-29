import React from 'react';

// https://juliangaramendy.dev/blog/loading-and-displaying-data-with-hooks
// https://resthooks.io/docs/api/useLoading
// https://usehooks.com/useAsync/
// https://github.com/puregarlic/react-use-loading

// TODO consider

const useAsyncFunction = <T>(
	asyncFunction: () => Promise<T>,
	defaultValue: T,
): [T, string | null, boolean] => {
	const [state, setState] = React.useState({
		value: defaultValue,
		error: null,
		isPending: true,
	});

	React.useEffect(() => {
		asyncFunction()
			.then(value => setState({ value, error: null, isPending: false }))
			.catch(error => setState({ value: defaultValue, error: error.toString(), isPending: false }));
	}, [asyncFunction, defaultValue]);

	const { value, error, isPending } = state;
	return [value, error, isPending];
};

export default useAsyncFunction;
