import axios from 'axios';
import {BACKEND_URL} from '@src/config/common';

export type SearchPatientResponseType = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  state: string;
};

/**
 *
 * @param keyword - string
 * @returns Promise
 *
 */
export async function searchPatientAPI(auth_token: string, keyword: string) {
  const res = await axios.post(
    BACKEND_URL + '/api/patients/search/',
    {keyword: keyword},
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-By': 'expo',
        Authorization: 'Bearer ' + auth_token,
      },
      withCredentials: true,
    },
  );
  return res.data.data as SearchPatientResponseType[];
}
