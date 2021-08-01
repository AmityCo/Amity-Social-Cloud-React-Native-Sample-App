// eslint-disable-next-line import/no-extraneous-dependencies
import axios, { AxiosError } from 'axios';

// TODO  functionality & typing

const handleError = (error: Error | AxiosError): string => {
	let errorText = 'Error while handling request!';

	if (axios.isAxiosError(error)) {
		//  console.error(error, error.name, error.message, error.toString());
		if (error.message) {
			// Something happened in setting up the request that triggered an Error
			errorText = error.message;
		} else if (error.response) {
			// Request made and server responded
			// console.log('error response', error.response.data);
			// console.log(error.response.status);
			// console.log(error.response.headers);

			errorText = String(error.response.status);
		} else if (error.request) {
			// The request was made but no response was received
			// console.log('error request', error.request);
		}
	}

	return errorText;
};

export default handleError;
