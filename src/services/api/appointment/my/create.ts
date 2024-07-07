import axios from 'axios';
import {AppointmentType} from '@src/types/appointment';
import {BACKEND_URL} from '@src/config/common';

export type MyCreateAppointmentType = {
  patient: string;
  start_time: string;
  duration: number;
  date: Date;
  status: 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  type: 'in-person' | 'video' | 'phone';
  reason: string;
  assigned_to: string;
};

/**
 *
 * @param appointment - CreateAppointmentType
 * @returns Promise
 *
 */
export function createMyAppointmentAPI(
  auth_token: string,
  appointment: MyCreateAppointmentType,
) {
  return axios
    .post(BACKEND_URL + '/api/scheduling/appointments/my/new/', appointment, {
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-By': 'expo',
        Authorization: 'Bearer ' + auth_token,
      },
    })
    .then(res => {
      return res.data.data as AppointmentType;
    });
}
