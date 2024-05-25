// Source:
// https://mobileledge.medium.com/usecontext-in-react-native-andbest-practices-1e899dc0f802

// react
import {AUTH_BACKEND_URL} from '../config/common';
import axios from 'axios';
import React, {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  user: {detail: any; session: any} | null;
  setUser: Dispatch<SetStateAction<{detail: any; session: any} | null>>;
};

// Save to persistent storage
const authCache = {
  async get(): Promise<AuthContextType['user']> {
    try {
      let value = await AsyncStorage.getItem('auth');
      if (!value) {
        return null;
      } else {
        return JSON.parse(value);
      }
    } catch (err) {
      return null;
    }
  },
  async save(value: AuthContextType['user']) {
    try {
      return AsyncStorage.setItem('auth', value ? JSON.stringify(value) : '');
    } catch (err) {
      return;
    }
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  if (context?.user === null) {
    // Check cache
    authCache.get().then(value => {
      if (value) {
        context.setUser(value);
      }
    });
  }
  return context;
}

const AuthProvider = (props: {children: ReactNode}): ReactElement => {
  const [user, setUser] = useState<AuthContextType['user']>(null);

  return <AuthContext.Provider {...props} value={{user, setUser}} />;
};

const SignedIn = (props: {children: ReactNode}): ReactElement => {
  const {user} = useAuth();
  return user ? <>{props.children}</> : <></>;
};

const SignedOut = (props: {children: ReactNode}): ReactElement => {
  const {user} = useAuth();
  return user ? <></> : <>{props.children}</>;
};

function useSignIn() {
  const {user, setUser} = useAuth();

  const signIn = async (email: string, password: string, token?: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    if (user) {
      throw new Error('User is already signed in');
    }
    let user_obj, last_web_session, last_app_session, session;
    console.log(AUTH_BACKEND_URL + '/api/user/login/');
    await axios
      .post(
        AUTH_BACKEND_URL + '/api/user/login/',
        {email: email, password: password, token: token},
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-By': 'expo',
          },
        },
      )
      .then(response => {
        user_obj = response.data.user;
        last_web_session = response.data.last_session;
        last_app_session = response.data.last_token_session;
        session = response.data.session;
      })
      .catch(error => {
        throw new Error(error);
      });
    // Save to cache
    authCache.save({detail: user_obj, session: session});
    // Set Context
    setUser({detail: user_obj, session: session});
    return {user_obj, session, last_web_session, last_app_session};
  };

  return {signIn};
}

function useSignOut() {
  const {user, setUser} = useAuth();

  const signOut = async () => {
    if (!user) {
      throw new Error('User is already signed out');
    }
    await axios
      .post(
        AUTH_BACKEND_URL + '/api/user/logout/',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-By': 'expo',
            Authorization: 'Bearer ' + user.session.key,
          },
        },
      )
      .then(() => {
        authCache.save(null);
        setUser(null);
      })
      .catch(error => {
        authCache.save(null);
        setUser(null);
        throw new Error(error);
      });
  };

  return {signOut};
}

function useRefresh() {
  const {user, setUser} = useAuth();

  /**
   * If refresh fails, user is signed out
   * @returns {boolean}
   */
  const refresh = async () => {
    if (!user) {
      throw new Error('User is signed out');
    }
    let success = false;
    await axios
      .get(AUTH_BACKEND_URL + '/api/user/me/', {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-By': 'expo',
          Authorization: 'Bearer ' + user.session.key,
        },
      })
      .then(response => {
        authCache.save({detail: response.data, session: user.session});
        setUser({detail: response.data, session: user.session});
        success = true;
      })
      .catch(() => {
        authCache.save(null);
        setUser(null);
      });
    return success;
  };

  return {refresh};
}

export {
  AuthProvider,
  useAuth,
  useSignIn,
  useSignOut,
  useRefresh,
  SignedIn,
  SignedOut,
};
