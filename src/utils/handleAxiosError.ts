import {AxiosError} from 'axios';
import {Dispatch, SetStateAction} from 'react';

export interface ErrorType {
  detail: string;
  status: number;
  title: string;
  instance: string;
}

export function handleAxiosError(
  error: AxiosError,
  setReqError: Dispatch<SetStateAction<string | null>>,
) {
  const msg = error.response?.data;
  console.log(error.response?.data);
  try {
    const res = msg as ErrorType;
    setReqError(
      JSON.stringify(res.title).replaceAll('"', '').replaceAll('\\n', '\n') +
        ' [' +
        res.status +
        ']',
    );
  } catch (err) {
    setReqError(JSON.stringify(error.message).replaceAll('"', ''));
  }
}
