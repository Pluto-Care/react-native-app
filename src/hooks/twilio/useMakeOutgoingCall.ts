import {getTwimlToken} from './api';
import {voice, callMap} from '../../utils/voice';
import {settlePromise} from '../../utils/settlePromise';
import {Call as TwilioCall} from '@twilio/voice-react-native-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {P, match} from 'ts-pattern';

export function useMakeOutgoingCall(
  auth_token: string,
  to: string,
  recipientType: RecipientType,
) {
  const makeCall = async () => {
    const token = await getTwimlToken(auth_token);

    const outgoingCallResult = await settlePromise(
      voice.connect(token, {
        params: {
          To: to,
          recipientType,
        },
      }),
    );
    if (outgoingCallResult.status === 'rejected') {
      return {
        reason: 'NATIVE_MODULE_REJECTED',
        error: outgoingCallResult.reason,
      };
    }

    const outgoingCall = outgoingCallResult.value;

    const uuid = outgoingCall['_uuid'];

    callMap.set(uuid, outgoingCall);

    outgoingCall.on(TwilioCall.Event.Disconnected, error => {
      // The type of error here is "TwilioError | undefined".
      if (error) {
        console.error('Disconnected:', error);
      }

      const callSid = outgoingCall.getSid();
      if (typeof callSid !== 'string') {
        return;
      }
      AsyncStorage.removeItem(callSid);
    });

    outgoingCall.once(TwilioCall.Event.Connected, () => {
      const callSid = outgoingCall.getSid();
      if (typeof callSid !== 'string') {
        return;
      }
      AsyncStorage.setItem(callSid, JSON.stringify({to, recipientType}));

      const info = getCallInfo(outgoingCall);
      if (typeof info.initialConnectedTimestamp === 'undefined') {
        info.initialConnectedTimestamp = Date.now();
      }
    });

    return {outgoingCall};
  };

  return {makeCall};
}

export type RecipientType = 'client' | 'number';

export type CallInfo = {
  sid?: string;
  state?: string;
  to?: string;
  from?: string;
  initialConnectedTimestamp?: number;
  isMuted?: boolean;
  isOnHold?: boolean;
};

export const getCallInfo = (call: TwilioCall): CallInfo => {
  const sid = call.getSid();
  const state = call.getState();
  const to = call.getTo();
  const from = call.getFrom();

  const initialConnectedTimestamp = match(call.getInitialConnectedTimestamp())
    .with(undefined, () => undefined)
    .with(P._, timestamp => Number(timestamp))
    .exhaustive();

  const isMuted = Boolean(call.isMuted());
  const isOnHold = Boolean(call.isOnHold());

  return {
    sid,
    state,
    to,
    from,
    initialConnectedTimestamp,
    isMuted,
    isOnHold,
  };
};
