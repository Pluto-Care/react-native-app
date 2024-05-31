import {BACKEND_URL} from '../../config/common';
import axios from 'axios';

/**
 *
 * @returns {Promise<string>}
 */
export const getTwimlToken = async (auth_token: string): Promise<string> => {
  return await axios
    .get(BACKEND_URL + '/api/phone_call/token/', {
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-By': 'expo',
        Authorization: 'Bearer ' + auth_token,
      },
    })
    .then(function (response) {
      return response.data.data.token;
    });
};
