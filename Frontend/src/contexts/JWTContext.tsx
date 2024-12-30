import { createContext, useEffect, ReactElement } from 'react';
import { useNavigate } from 'react-router';

//third-party
import Cookies from 'universal-cookie';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import * as Crypto from 'crypto-js';

// reducer - state management
// import { LOGIN, LOGOUT } from 'store/reducers/actions';

//redux
import { RootState } from 'store';
import { useSelector, useDispatch } from 'react-redux';
import { loginStore, logoutStore } from 'store/reducers/auth';

// project-imports
import Loader from 'components/Loader';

//types
import { JWTContextType } from 'types/auth';

//constant
import { API_PATH_AUTHENTICATE, API_PATH_ROLE } from 'utils/constant';
import { useIntl } from 'react-intl';
import { RoleData } from 'types';

const setCookies = (accessToken?: string | null) => {
  const cookies = new Cookies();
  if (accessToken) {
    cookies.set('accessToken', `Bearer ${accessToken}`);
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  } else {
    cookies.remove('accessToken');
    delete axios.defaults.headers.common['Authorization'];
  }
};

const JWTContext = createContext<JWTContextType | null>(null);

interface UserGroupLv3 {
  id: number;
  group_id_lv1: number;
  group_id_lv2: number;
  group_id_lv3: number;
  user_id: string;
}

const getAccessKey = (arrRole: RoleData[]) => {
  return arrRole.map((role) => role.access);
};

const getParentId = (arrRole: UserGroupLv3[], level: 2 | 3) => {
  if (level === 2) {
    return arrRole.map((role) => role.group_id_lv2);
  } else {
    return arrRole.map((role) => role.group_id_lv3);
  }
};

export const JWTProvider = ({ children }: { children: ReactElement }) => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.authSlice);
  const navigate = useNavigate();
  const cookies = new Cookies();
  const accessToken = cookies.get('accessToken');
  const intl = useIntl();

  useEffect(() => {
    const init = async () => {
      if (accessToken) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_TEST + API_PATH_AUTHENTICATE.verifyLogin}`, {
            headers: { Authorization: `${accessToken}` }
          });
          if (response.data.code === 0) {
            const getRole3 = await axios.get(`${process.env.REACT_APP_BACKEND_API_TEST + API_PATH_ROLE.dataRole}`, {
              headers: { Authorization: `${accessToken}` },
              params: {
                // level: 3,
                roleId: getParentId(response.data.data.user_group_lv3, 3),
                pageSize: 100
              }
            });
            const getRole2 = await axios.get(`${process.env.REACT_APP_BACKEND_API_TEST + API_PATH_ROLE.dataRole}`, {
              headers: { Authorization: `${accessToken}` },
              params: {
                // level: 2,
                roleId: getParentId(response.data.data.user_group_lv2, 2),
                pageSize: 100
              }
            });
            dispatch(loginStore({ user: response.data.data, isLoggedIn: true }));
            if (getRole2.data.code === 0 && getRole3.data.code === 0) {
              const keyAccess = {
                level2: getAccessKey(getRole2.data.data),
                level3: getAccessKey(getRole3.data.data)
              };
              const parseString = JSON.stringify(keyAccess);
              const encryptedData = Crypto.AES.encrypt(parseString, process.env.REACT_APP_SECRET_KEY as string).toString();
              sessionStorage.setItem('accessPermission', encryptedData);
            } else {
              setCookies(null);
              dispatch(logoutStore());
              // dispatch(clearDataRoles());
              navigate(`/login`, {
                state: {
                  from: ''
                }
              });
            }
          } else {
            setCookies(null);
            // dispatch(clearDataRoles());
            dispatch(logoutStore());
            navigate(`/login`, {
              state: {
                from: ''
              }
            });
          }
        } catch (err) {
          dispatch(logoutStore());
          // dispatch(clearDataRoles());
          navigate(`/login`, {
            state: {
              from: ''
            }
          });
        }
      } else {
        dispatch(logoutStore());
        // dispatch(clearDataRoles());
        navigate(`/login`, {
          state: {
            from: ''
          }
        });
      }
    };
    init();
    //eslint-disable-next-line
  }, [dispatch, accessToken]);

  const login = async (username: string, password: string): Promise<{ code: number }> => {
    try {
      setCookies(null);
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_API_TEST + API_PATH_AUTHENTICATE.loginUser}`, { username, password });
      dispatch(loginStore({ isLoggedIn: true, user: res.data.data.user }));
      setCookies(res.data.data.accessToken);
      return { code: res.data.code };
    } catch (err) {
      dispatch(logoutStore());
      return { code: -1 };
    }
  };

  const loginBySocial = async (userSocial: any): Promise<{ code: number }> => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_API_TEST + API_PATH_AUTHENTICATE.loginOAuth}`, {
        email: userSocial.email
      });
      return { code: res.data.code };
    } catch (err) {
      return { code: -1 };
    }
  };

  const register = async (
    phoneNumber: string,
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    isAdmin: boolean
  ): Promise<{ code: number; message: string }> => {
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_API_TEST + API_PATH_AUTHENTICATE.registerUser}`, {
      phoneNumber: phoneNumber,
      email,
      isAdmin,
      username,
      password,
      fullname: `${firstName} ${lastName}`
    });

    return { code: res.data.code, message: res.data.message };
  };

  const logout = () => {
    setCookies(null);
    dispatch(logoutStore());
    navigate(`/login`, {
      state: {
        from: ''
      }
    });
  };

  const resetPassword = async (username: string, email: string, newPassword: string) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_API_TEST + API_PATH_AUTHENTICATE.resetPassword}`, {
        username,
        email,
        newPassword
      });
      return { ...res.data };
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  };

  const verifyEmail = async (email: string) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_API_TEST + API_PATH_AUTHENTICATE.verifyEmail}`, {
        params: {
          email
        }
      });
      return { ...res.data };
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  };

  const updateProfile = () => {};

  if (!state.isInitialized) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile, loginBySocial, verifyEmail }}>
      {children}
    </JWTContext.Provider>
  );
};

export default JWTContext;
