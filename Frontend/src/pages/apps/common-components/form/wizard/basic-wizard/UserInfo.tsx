import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

// project-import
import { DialogContent, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CheckMarkField, InputField } from 'components/molecules/form';

// third-party
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';
import { enqueueSnackbar } from 'notistack';

// redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// validate
import useValidationSchemas from 'utils/validateSchema';

//types
import { EditUser, NewUser, EndUserData } from 'types/end-user';
import { OptionList } from 'types/general';

const getInitialValues = (endUser: FormikValues | null) => {
  return {
    id: endUser?.id || '',
    fullname: endUser?.fullname || '',
    email: endUser?.email || '',
    phoneNumber: endUser?.phone_number || '',
    citizenId: endUser?.citizen_id || '',
    gender: endUser?.gender || '',
    address: endUser?.address || '',
    ward: endUser?.ward || '',
    district: endUser?.district || '',
    province: endUser?.province || '',
    country: endUser?.country || '',
    postcode: endUser?.postcode || '',
    username: endUser?.username || '',
    password: endUser?.password || '',
    userGroupId: endUser?.user_group || [1]
  };
};

export interface Props {
  endUser: EndUserData | null;
  onCancel: () => void;
  handleEdit: (values: EditUser) => void;
  handleAdd: (values: NewUser) => void;
  open: boolean;
  roleOptions: OptionList[];
}

const UserInfo = ({ endUser, onCancel, handleEdit, handleAdd, open, roleOptions }: Props) => {
  const intl = useIntl();
  const isEditMode: boolean = endUser ? true : false;
  const { EndUserSchema } = useValidationSchemas(isEditMode);
  const [selected, setSelected] = useState<number[]>([1]);

  const formik = useFormik({
    initialValues: getInitialValues(endUser),
    validationSchema: EndUserSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const actions = endUser ? handleEdit : handleAdd;
        const res: any = await actions({ ...values, userGroupId: selected });
        if (res && res.code === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: endUser
                ? intl.formatMessage({ id: 'update-admin-successfully' })
                : intl.formatMessage({ id: 'add-admin-successfully' }),
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
          setSubmitting(false);
          onCancel();
        } else {
          if (res.code === -1 && res.message === 'User này đã tồn tại') {
            setFieldError('username', intl.formatMessage({ id: 'duplicate-username' }));
          }
          enqueueSnackbar(endUser ? intl.formatMessage({ id: 'update-failed' }) : intl.formatMessage({ id: 'add-failed' }), {
            variant: 'error'
          });
          setSubmitting(false);
        }
      } catch (error) {
        enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
          variant: 'error'
        });
      }
    }
  });
  const {
    handleSubmit,
    // isSubmitting,
    setValues,
    resetForm
  } = formik;

  useEffect(() => {
    resetForm({
      touched: {},
      errors: {}
    });
    if (endUser) {
      setSelected(endUser.user_group);
    }
    setValues(getInitialValues(endUser));
    //eslint-disable-next-line
  }, [endUser, open]);

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={1}></Grid>
                <Grid item xs={10}>
                  <Grid container spacing={3}>
                    <InputField
                      name="name_user"
                      inputLabel={intl.formatMessage({ id: 'fullname' })}
                      required={true}
                      field="fullname"
                      placeholder={intl.formatMessage({ id: 'enter-full-name' })}
                      formik={formik}
                    />
                    <InputField
                      md={6}
                      name="email"
                      inputLabel={intl.formatMessage({ id: 'email-address' })}
                      required={true}
                      field="email"
                      placeholder={intl.formatMessage({ id: 'enter-email' })}
                      formik={formik}
                    />
                    <InputField
                      md={6}
                      name="phone-number"
                      inputLabel={intl.formatMessage({ id: 'phone-number' })}
                      required={true}
                      field="phoneNumber"
                      placeholder={intl.formatMessage({ id: 'enter-phone-number' })}
                      formik={formik}
                    />
                    <InputField
                      name="citizen-id"
                      inputLabel={intl.formatMessage({ id: 'citizen-id' })}
                      field="citizenId"
                      placeholder={intl.formatMessage({ id: 'enter-citizen-id' })}
                      formik={formik}
                    />
                    <InputField
                      name="address"
                      inputLabel={intl.formatMessage({ id: 'address' })}
                      required={true}
                      field="address"
                      placeholder={intl.formatMessage({ id: 'enter-address' })}
                      formik={formik}
                    />
                    <InputField
                      md={6}
                      name="ward"
                      inputLabel={intl.formatMessage({ id: 'ward' })}
                      required={true}
                      field="ward"
                      placeholder={intl.formatMessage({ id: 'enter-ward' })}
                      formik={formik}
                    />
                    <InputField
                      md={6}
                      name="district"
                      inputLabel={intl.formatMessage({ id: 'district' })}
                      required={true}
                      field="district"
                      placeholder={intl.formatMessage({ id: 'enter-district' })}
                      formik={formik}
                    />
                    <InputField
                      name="province"
                      inputLabel={intl.formatMessage({ id: 'province' })}
                      required={true}
                      field="province"
                      placeholder={intl.formatMessage({ id: 'enter-province' })}
                      formik={formik}
                    />
                    <InputField
                      md={6}
                      name="country"
                      inputLabel={intl.formatMessage({ id: 'country' })}
                      required={true}
                      field="country"
                      placeholder={intl.formatMessage({ id: 'enter-country' })}
                      formik={formik}
                    />
                    <InputField
                      md={6}
                      name="postcode"
                      inputLabel={intl.formatMessage({ id: 'postcode' })}
                      field="postcode"
                      placeholder={intl.formatMessage({ id: 'enter-postcode' })}
                      formik={formik}
                    />
                    {endUser && endUser.user_group.length > 1 ? (
                      <CheckMarkField
                        md={12}
                        inputLabel={intl.formatMessage({ id: 'choose-role' })}
                        name="userGroupId"
                        field="userGroupId"
                        arrayOption={roleOptions}
                        placeholder={intl.formatMessage({ id: 'choose-role' })}
                        required
                        formik={formik}
                      />
                    ) : (
                      ''
                    )}

                    {!endUser && (
                      <>
                        <InputField
                          name="username"
                          inputLabel={intl.formatMessage({ id: 'username' })}
                          required={true}
                          field="username"
                          placeholder={intl.formatMessage({ id: 'enter-username' })}
                          formik={formik}
                        />
                        <InputField
                          name="password"
                          inputLabel={intl.formatMessage({ id: 'password' })}
                          required={true}
                          field="password"
                          placeholder={intl.formatMessage({ id: 'enter-password' })}
                          type="password"
                          formik={formik}
                        />
                      </>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={1}></Grid>
              </Grid>
            </DialogContent>
            {/* <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="flex-end" alignItems="center">
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="flex-end">
                    <Button color="error" onClick={onCancel}>
                      <FormattedMessage id="cancel" />
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <CircularProgress size={24} />
                      ) : endUser ? (
                        <FormattedMessage id="edit" />
                      ) : (
                        <FormattedMessage id="confirm" />
                      )}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions> */}
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};

export default UserInfo;