import { useNavigate } from 'react-router-dom';

// material-ui
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'components/@extended/AnimateButton';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { useIntl } from 'react-intl';
import useMapStatus from 'utils/mapStatus';

// ============================|| FIREBASE - FORGOT PASSWORD ||============================ //

const AuthForgotPassword = () => {
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();
  const { getStatusMessage } = useMapStatus();
  const intl = useIntl();

  const { isLoggedIn, verifyEmail } = useAuth();

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email(intl.formatMessage({ id: 'email-invalid' }))
            .max(255)
            .required(intl.formatMessage({ id: 'email-required' }))
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const res: any = await verifyEmail(values.email);

            if (res && res.code === 0) {
              setStatus({ success: true });
              setSubmitting(false);
              dispatch(
                openSnackbar({
                  open: true,
                  message: intl.formatMessage({ id: 'check-mail-for-reset-password' }),
                  variant: 'alert',
                  alert: {
                    color: 'success'
                  },
                  close: false
                })
              );
              setTimeout(() => {
                navigate(isLoggedIn ? `/auth/check-mail/${res.data.user.email}` : `/check-mail/${res.data.user.email}`, { replace: true });
              }, 1500);
            } else {
              setStatus({ success: false });
              setErrors({ submit: getStatusMessage('general', res.code) });
              setSubmitting(false);
            }
            // await resetPassword(values.email).then(
            //   () => {
            //     // WARNING: do not set any formik state here as formik might be already destroyed here. You may get following error by doing so.
            //     // Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application.
            //     // To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
            //     // github issue: https://github.com/formium/formik/issues/2430
            //   },
            //   (err: any) => {
            //     setStatus({ success: false });
            //     setErrors({ submit: err.message });
            //     setSubmitting(false);
            //   }
            // );
          } catch (err: any) {
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-forgot">{intl.formatMessage({ id: 'email-address' })}</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-forgot"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={intl.formatMessage({ id: 'enter-email' })}
                    inputProps={{}}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-forgot">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12} sx={{ mb: -2 }}>
                <Typography variant="caption">{intl.formatMessage({ id: 'do-not-forgot-to-check-spam-box' })}</Typography>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    {intl.formatMessage({ id: 'send-email' })}
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

export default AuthForgotPassword;
