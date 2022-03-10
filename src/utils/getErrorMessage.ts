// import { AxiosError } from 'axios';

const getErrorMessage = (error: Error | undefined): string => {
  return error?.message ?? 'Error while handling request!';
};

export default getErrorMessage;
