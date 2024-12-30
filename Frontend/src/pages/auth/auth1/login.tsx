import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import axios from 'axios';
// material-ui
import { Grid, Stack, Typography } from '@mui/material';
// project-imports
import Logo from 'components/logo';
import useAuth from 'hooks/useAuth';
import AuthSocButton from 'sections/auth/AuthSocButton';
import AuthDivider from 'sections/auth/AuthDivider';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';

// assets
import IconFacebook from 'components/atoms/icons/facebook';
import imgGoogle from 'assets/images/auth/google.svg';
import { FormattedMessage, useIntl } from 'react-intl';

//redux
import { dispatch } from 'store';
import { loginStore, registerStore } from 'store/reducers/auth';
import { openSnackbar } from 'store/reducers/snackbar';
import { enqueueSnackbar } from 'notistack';

// ================================|| LOGIN ||================================ //

const Login = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { isLoggedIn, loginBySocial } = useAuth();
  const [user, setUser] = useState<any>();
  const clientIDFacebook: string = process.env.REACT_APP_TOKEN_CLIENT_ID_FACEBOOK || '';

  const googleHandler = useGoogleLogin({
    onSuccess: (userInfo) => setUser(userInfo),
    onError: (error) => {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  });

  const handleGoogleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    googleHandler();
  };

  useEffect(() => {
    if (user) {
      responseGoogle();
    }
    //eslint-disable-next-line
  }, [user]);

  const responseGoogle = async () => {
    try {
      const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          Accept: 'application/json'
        }
      });

      const responseAuth = await loginBySocial(res.data);
      if (responseAuth.code === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: intl.formatMessage({ id: 'login-successfully' }),
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        dispatch(loginStore({ user: res.data.user, isLoggedIn: true }));
      } else {
        dispatch(registerStore({ userSocial: res.data }));
        navigate('/register');
      }
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  };

  const responseFacebook = async (response: any) => {
    if (response.accessToken) {
      try {
        const res = await axios.get(
          `https://graph.facebook.com/me?fields=id,name,first_name,last_name,email,picture&access_token=${response.accessToken}`
        );

        const responseAuth = await loginBySocial(res.data);
        if (responseAuth.code === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: intl.formatMessage({ id: 'login-successfully' }),
              variant: 'alert',
              alert: { color: 'success' },
              close: false
            })
          );
          dispatch(loginStore({ user: res.data.user, isLoggedIn: true }));
        } else {
          dispatch(registerStore({ userSocial: res.data }));
          navigate('/register');
        }
      } catch (error) {
        enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
          variant: 'error'
        });
      }
    }
  };
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Logo />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FacebookLogin
                className="flex justify-center items-center p-2 w-full text-gray-500 rounded-lg bg-gray-100 text-center bg-opacity-60 cursor-pointer border border-transparent hover:border-[#4680FF] hover:text-[#4680FF]"
                appId={clientIDFacebook}
                autoLoad={false}
                fields="name,email,first_name,last_name,picture,locale"
                onSuccess={responseFacebook}
                children={
                  <>
                    <IconFacebook className="mx-[10px] h-4 w-3" />
                    {intl.formatMessage({ id: 'login-with-facebook' })}
                  </>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <AuthSocButton onClick={handleGoogleClick}>
                <img src={imgGoogle} alt="Google" style={{ margin: '0 10px' }} />
                <FormattedMessage id="login-with-google" />
              </AuthSocButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <AuthDivider>
            <Typography variant="body1">
              <FormattedMessage id="or" />
            </Typography>
          </AuthDivider>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">
              <FormattedMessage id="login" />
            </Typography>
            <Typography
              component={Link}
              to={isLoggedIn ? '/auth/register' : '/register'}
              variant="body1"
              sx={{ textDecoration: 'none' }}
              color="primary"
            >
              <FormattedMessage id="don't-have-account" />?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin forgot="/auth/forgot-password" />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default Login;
