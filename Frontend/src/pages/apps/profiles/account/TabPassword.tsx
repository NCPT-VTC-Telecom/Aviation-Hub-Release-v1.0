import { useState, SyntheticEvent, useEffect } from 'react';

// material-ui
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { isNumber, isLowercaseChar, isUppercaseChar, isSpecialChar, minLength } from 'utils/password-validation';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// assets
import { Eye, EyeSlash, Minus, TickCircle } from 'iconsax-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { getUser, postChangePassword } from './model';
import { ChangePasswordUser, EndUserData } from 'types/end-user';
import { useParams } from 'react-router';
import useMapStatus from 'utils/mapStatus';

// ==============================|| ACCOUNT PROFILE - PASSWORD CHANGE ||============================== //

const TabPassword = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const intl = useIntl();
  const { getStatusMessage } = useMapStatus();
  const [userInfo, setUserInfo] = useState<EndUserData>();

  const { id } = useParams();

  const handleClickShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };
  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  async function getDataUser(idUser: string) {
    try {
      const res = await getUser(idUser);
      if (res.code === 0) {
        setUserInfo(res.data);
      }
    } catch (err) {}
  }

  const handleChangePassword = async (idUser: string, record: ChangePasswordUser) => {
    try {
      const res = await postChangePassword(idUser, record);
      return res;
    } catch (err) {}
  };

  useEffect(() => {
    if (id) {
      getDataUser(id);
    }
    //eslint-disable-next-line
  }, []);

  return (
    <MainCard title={intl.formatMessage({ id: 'change-password' })}>
      <Formik
        initialValues={{
          email: userInfo?.email || '',
          oldPassword: '',
          newPassword: '',
          confirm: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          oldPassword: Yup.string().required(intl.formatMessage({ id: 'old-password-required' })),
          newPassword: Yup.string()
            .required(intl.formatMessage({ id: 'new-password-required' }))
            .matches(
              /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
              intl.formatMessage({ id: 'password-must-contain-at-least-8-characters-uppercase-number-special' })
            ),
          confirm: Yup.string()
            .required(intl.formatMessage({ id: 'confirm-password-required' }))
            .test(
              intl.formatMessage({ id: 'confirm' }),
              intl.formatMessage({ id: 'password-not-match' }),
              (confirm: string, yup: any) => yup.parent.newPassword === confirm
            )
        })}
        onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
          if (userInfo) {
            try {
              const res = await handleChangePassword(userInfo.id, {
                email: values.email,
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
              });
              if (res.code === 0) {
                dispatch(
                  openSnackbar({
                    open: true,
                    message: intl.formatMessage({ id: 'change-password-successfully' }),
                    variant: 'alert',
                    alert: {
                      color: 'success'
                    },
                    close: false
                  })
                );

                resetForm();
                setStatus({ success: false });
                setSubmitting(false);
              } else {
                const message = getStatusMessage('general', res.code);
                setErrors({ submit: message });
              }
            } catch (err: any) {
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
              <Grid item container spacing={3} xs={12} sm={6}>
                <Grid item xs={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="password-old">
                      <FormattedMessage id="old-password" />
                    </InputLabel>
                    <OutlinedInput
                      id="password-old"
                      placeholder={intl.formatMessage({ id: 'enter-old-password' })}
                      type={showOldPassword ? 'text' : 'password'}
                      value={values.oldPassword}
                      name="oldPassword"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowOldPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                            color="secondary"
                          >
                            {showOldPassword ? <Eye /> : <EyeSlash />}
                          </IconButton>
                        </InputAdornment>
                      }
                      autoComplete="password-old"
                    />
                    {touched.oldPassword && errors.oldPassword && (
                      <FormHelperText error id="password-old-helper">
                        {errors.oldPassword}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="password-password">
                      <FormattedMessage id="new-password" />
                    </InputLabel>
                    <OutlinedInput
                      id="password-password"
                      placeholder={intl.formatMessage({ id: 'enter-new-password' })}
                      type={showNewPassword ? 'text' : 'password'}
                      value={values.newPassword}
                      name="newPassword"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowNewPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                            color="secondary"
                          >
                            {showNewPassword ? <Eye /> : <EyeSlash />}
                          </IconButton>
                        </InputAdornment>
                      }
                      autoComplete="password-password"
                    />
                    {touched.newPassword && errors.newPassword && (
                      <FormHelperText error id="password-password-helper">
                        {errors.newPassword}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="password-confirm">
                      <FormattedMessage id="confirm-password" />
                    </InputLabel>
                    <OutlinedInput
                      id="password-confirm"
                      placeholder={intl.formatMessage({ id: 'enter-confirm-password' })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={values.confirm}
                      name="confirm"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                            color="secondary"
                          >
                            {showConfirmPassword ? <Eye /> : <EyeSlash />}
                          </IconButton>
                        </InputAdornment>
                      }
                      autoComplete="password-confirm"
                    />
                    {touched.confirm && errors.confirm && (
                      <FormHelperText error id="password-confirm-helper">
                        {errors.confirm}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: { xs: 0, sm: 2, md: 4, lg: 5 } }}>
                  <Typography variant="h5">
                    <FormattedMessage id="new-password-must-contain" />
                  </Typography>
                  <List sx={{ p: 0, mt: 1 }}>
                    <ListItem divider>
                      <ListItemIcon sx={{ color: minLength(values.newPassword) ? 'success.main' : 'inherit' }}>
                        {minLength(values.newPassword) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary={intl.formatMessage({ id: 'at-least-8-characters' })} />
                    </ListItem>
                    <ListItem divider>
                      <ListItemIcon sx={{ color: isLowercaseChar(values.newPassword) ? 'success.main' : 'inherit' }}>
                        {isLowercaseChar(values.newPassword) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary={intl.formatMessage({ id: 'at-least-1-lower-letter' })} />
                    </ListItem>
                    <ListItem divider>
                      <ListItemIcon sx={{ color: isUppercaseChar(values.newPassword) ? 'success.main' : 'inherit' }}>
                        {isUppercaseChar(values.newPassword) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary={intl.formatMessage({ id: 'at-least-1-uppercase-letter' })} />
                    </ListItem>
                    <ListItem divider>
                      <ListItemIcon sx={{ color: isNumber(values.newPassword) ? 'success.main' : 'inherit' }}>
                        {isNumber(values.newPassword) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary={intl.formatMessage({ id: 'at-least-1-number' })} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ color: isSpecialChar(values.newPassword) ? 'success.main' : 'inherit' }}>
                        {isSpecialChar(values.newPassword) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary={intl.formatMessage({ id: 'at-least-1-special-characters' })} />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                  <Button variant="outlined" color="secondary">
                    <FormattedMessage id="cancel" />
                  </Button>
                  <Button disabled={isSubmitting || Object.keys(errors).length !== 0} type="submit" variant="contained">
                    <FormattedMessage id="change-password" />
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default TabPassword;
