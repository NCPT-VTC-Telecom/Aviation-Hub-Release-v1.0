import React, { useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

//project-import
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  Step,
  Stepper,
  StepLabel,
  Grid,
  Stack,
  CircularProgress
} from '@mui/material';
import { PopupTransition } from 'components/@extended/Transitions';

//third-party
import { useFormik, FormikValues } from 'formik';
import Cookies from 'universal-cookie';
import useValidationSchemas from 'utils/validateSchema';
import { SelectCheckboxField, InputField } from 'components/molecules/form';

//utils
import axios from 'utils/axios';
import { API_PATH_ROLE } from 'utils/constant';
import { getOption } from 'utils/handleData';

//types
import { EndUserData, OptionList } from 'types';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  record: EndUserData | null;
}

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
    userGroupId: endUser?.user_group || [1],
    userGroupIdLv2: endUser?.user_group_lv2 || [],
    userGroupIdLv3: endUser?.user_group_lv3 || []
  };
};

const UserFormDialog: React.FC<UserFormProps> = ({ open, onClose, record }) => {
  const intl = useIntl();
  const cookies = new Cookies();
  const accessToken = cookies.get('accessToken');
  const [activeStep, setActiveStep] = useState(0);
  const [initialComponent, setInitialComponent] = useState<boolean>(true);
  const [dataRoleLv2, setDataRoleLv2] = useState<OptionList[]>([]);
  const [dataRoleLv3, setDataRoleLv3] = useState<OptionList[]>([]);
  const { EndUserSchema, RoleUserSchema } = useValidationSchemas(record ? true : false);
  const steps = [intl.formatMessage({ id: 'user-info' }), intl.formatMessage({ id: 'permission-user' })];

  const formik = useFormik({
    initialValues: getInitialValues(record),
    validationSchema: activeStep === 0 ? EndUserSchema : RoleUserSchema,
    onSubmit: (values) => {
      onClose(); // Close the dialog on successful submission
    },
    enableReinitialize: true
  });

  const handleNext = () => {
    if (formik.isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getRoleLv2 = async () => {
    try {
      const res = await axios.get(`${API_PATH_ROLE.dataRole}`, {
        headers: {
          Authorization: `${accessToken}`
        },
        params: {
          level: 2,
          pageSize: 100
        }
      });
      setDataRoleLv2(getOption(res.data.data, 'title', 'id'));
    } catch {}
  };

  const getRoleLv3 = async (parentId: number[]) => {
    try {
      if (parentId.length > 0) {
        const res = await axios.get(`${API_PATH_ROLE.dataRole}`, {
          headers: {
            Authorization: `${accessToken}`
          },
          params: {
            level: 3,
            pageSize: 100,
            parentId: `[${parentId}]`
          }
        });
        setDataRoleLv3(getOption(res.data.data, 'title', 'id'));
      }
    } catch {}
  };

  useEffect(() => {
    if (initialComponent) {
      formik.validateForm();
      formik.resetForm({
        touched: {},
        errors: {}
      });
      getRoleLv2();
      setInitialComponent(false);
    }
    formik.setValues(getInitialValues(record));
    getRoleLv3(formik.values.userGroupIdLv2);
    //eslint-disable-next-line
  }, [record]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      TransitionComponent={PopupTransition}
      keepMounted
      fullWidth
      sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{record ? <FormattedMessage id="edit-admin" /> : <FormattedMessage id="add-admin" />}</DialogTitle>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          {activeStep === 0 && (
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
              {!record && (
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
          )}
          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <SelectCheckboxField
                  key="group-role-lv2"
                  field="userGroupIdLv2"
                  formik={formik}
                  inputLabel={intl.formatMessage({ id: 'group-role-lv2' })}
                  name="group-role-lv2"
                  arrayOption={dataRoleLv2}
                />
              </Grid>
              <Grid item xs={12}>
                <SelectCheckboxField
                  key="group-role-lv3"
                  field="userGroupIdLv3"
                  formik={formik}
                  inputLabel={intl.formatMessage({ id: 'group-role-lv3' })}
                  name="group-role-lv3"
                  arrayOption={dataRoleLv3}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="pb-4">
          <Grid container justifyContent="flex-end" alignItems="center">
            <Grid item>
              <Stack direction="row" spacing={2} alignItems="flex-end">
                <Button color="error" onClick={onClose}>
                  <FormattedMessage id="cancel" />
                </Button>
                {activeStep > 0 && (
                  <Button onClick={handleBack}>
                    <FormattedMessage id="back" />
                  </Button>
                )}
                {activeStep < steps.length - 1 ? (
                  <Button variant="contained" onClick={handleNext} disabled={!formik.isValid}>
                    <FormattedMessage id="next" />
                  </Button>
                ) : (
                  <Button type="submit" variant="contained" disabled={!formik.isValid}>
                    {formik.isSubmitting ? (
                      <CircularProgress size={24} />
                    ) : record ? (
                      <FormattedMessage id="edit" />
                    ) : (
                      <FormattedMessage id="confirm" />
                    )}
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserFormDialog;
