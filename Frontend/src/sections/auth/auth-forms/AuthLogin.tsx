import { useState, SyntheticEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Button, FormHelperText, Grid, Link, InputAdornment, InputLabel, OutlinedInput, Stack } from '@mui/material';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { enqueueSnackbar } from 'notistack';

// assets
import { Eye, EyeSlash } from 'iconsax-react';
import { FormattedMessage, useIntl } from 'react-intl';

//utils
import useMapStatus from 'utils/mapStatus';
// ============================|| JWT - LOGIN ||============================ //

const AuthLogin = ({ forgot }: { forgot?: string }) => {
  const intl = useIntl();
  const { isLoggedIn, login } = useAuth();
  const scriptedRef = useScriptRef();
  const { getStatusMessage } = useMapStatus();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          username: 'admin',
          password: 'admin@123456',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string()
            .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
            .max(255)
            .required(intl.formatMessage({ id: 'username-required' })),
          password: Yup.string()
            .max(255)
            .required(intl.formatMessage({ id: 'password-required' }))
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const res: any = await login(values.username, values.password);

            if (scriptedRef.current) {
              if (res.code === 0) {
                setStatus({ success: true });
                setSubmitting(false);
                dispatch(
                  openSnackbar({
                    open: true,
                    message: getStatusMessage('login', res.code),
                    variant: 'alert',
                    alert: {
                      color: 'success'
                    },
                    close: false
                  })
                );
              } else {
                setStatus({ success: true });
                setSubmitting(false);
                enqueueSnackbar(getStatusMessage('login', res.code), {
                  variant: 'error'
                });
              }
            }
          } catch (err: any) {
            if (scriptedRef.current) {
              setStatus({ success: false });
              // setErrors({ submit: err.message });
              setErrors({ submit: intl.formatMessage({ id: 'verify-your-username-and-password' }) });
              setSubmitting(false);
              enqueueSnackbar(intl.formatMessage({ id: 'login-failed' }), {
                variant: 'error'
              });
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="username-login">
                    <FormattedMessage id="username" />
                  </InputLabel>
                  <OutlinedInput
                    id="username-login"
                    type="username"
                    value={values.username}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={intl.formatMessage({ id: 'enter-username' })}
                    fullWidth
                    error={Boolean(touched.username && errors.username)}
                  />
                  {touched.username && errors.username && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.username}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">
                    <FormattedMessage id="password" />
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <Eye /> : <EyeSlash />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder={intl.formatMessage({ id: 'enter-password' })}
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <Link variant="h6" component={RouterLink} to={isLoggedIn && forgot ? forgot : '/forgot-password'} color="text.primary">
                    <FormattedMessage id="forgot-password" />?
                  </Link>
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    <FormattedMessage id="login" />
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
