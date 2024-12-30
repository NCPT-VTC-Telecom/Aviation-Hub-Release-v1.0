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
import { SelectCheckboxField, DatePickerField, InputField } from 'components/molecules/form';
import { PopupTransition } from 'components/@extended/Transitions';

//third-party
import { useFormik, FormikValues, Form, FormikProvider } from 'formik';
import Cookies from 'universal-cookie';

//utils
import useValidationSchemas from 'utils/validateSchema';
import { API_PATH_ROLE } from 'utils/constant';
import { formatDateToSV, getOption } from 'utils/handleData';
import axios from 'utils/axios';

//types
import { NewVendor, OptionList, VendorData } from 'types';

interface params {
  id?: string;
  dataBody?: NewVendor;
}

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  record: VendorData | null;
  handleSubmit: (action: 'add' | 'edit' | 'delete', params: params) => void;
}

const getInitialValues = (vendor: FormikValues | null) => {
  const expiredDateVendor = formatDateToSV(vendor?.expired_date);

  return {
    id: vendor?.id || '',
    userId: vendor?.user_id || '',
    fullname: vendor?.fullname || '',
    email: vendor?.email || '',
    phoneNumber: vendor?.phone_number || '',
    token: vendor?.token || '',
    address: vendor?.address || '',
    ward: vendor?.ward || '',
    district: vendor?.district || '',
    province: vendor?.province || '',
    username: vendor?.username || '',
    password: vendor?.password || '',
    expiredDate: expiredDateVendor || '',
    description: vendor?.description || '',
    userGroupIdLv1: vendor?.user_group || [],
    userGroupIdLv2: vendor?.user_group_lv2 || [],
    userGroupIdLv3: vendor?.user_group_lv3 || []
  };
};

const VendorFormDialog: React.FC<UserFormProps> = ({ open, onClose, record, handleSubmit }) => {
  const intl = useIntl();
  const cookies = new Cookies();
  const accessToken = cookies.get('accessToken');
  const [activeStep, setActiveStep] = useState(0);
  const [dataRoleLv2, setDataRoleLv2] = useState<OptionList[]>([]);
  const [dataRoleLv3, setDataRoleLv3] = useState<OptionList[]>([]);
  const { VendorSchema, RoleGroupSchema } = useValidationSchemas(record ? true : false);
  const steps = [intl.formatMessage({ id: 'user-info' }), intl.formatMessage({ id: 'permission-user' })];

  const formik = useFormik({
    initialValues: getInitialValues(record),
    validationSchema: activeStep === 0 ? VendorSchema : RoleGroupSchema,
    onSubmit: async (values) => {
      await handleSubmit(record ? 'edit' : 'add', { dataBody: values as NewVendor, id: values.userId });
      onClose(); // Close the dialog on successful submission
    },
    enableReinitialize: true
  });

  const handleNext = () => {
    if (formik.isValid && !formik.isSubmitting) {
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
    if (open) {
      formik.setValues(getInitialValues(record));
      formik.setTouched({});
      formik.setErrors({});
      setActiveStep(0);
      getRoleLv2();
    }
    //eslint-disable-next-line
  }, [open, record]);

  useEffect(() => {
    if (formik.values.userGroupIdLv2.length > 0) {
      getRoleLv3(formik.values.userGroupIdLv2);
    } else {
      setDataRoleLv3([]);
    }
    //eslint-disable-next-line
  }, [formik.values.userGroupIdLv2]);

  return (
    <FormikProvider value={formik}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        aria-hidden={false}
        keepMounted
        fullWidth
        sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{record ? <FormattedMessage id="edit-vendor" /> : <FormattedMessage id="add-vendor" />}</DialogTitle>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Grid container></Grid>
        <Form autoComplete="off" noValidate>
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={1}></Grid>
              <Grid item xs={10}>
                <Grid container spacing={3}>
                  {activeStep === 0 && (
                    <>
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
                      <DatePickerField
                        md={6}
                        name="expiredDate"
                        inputLabel={intl.formatMessage({ id: 'expired-date' })}
                        required={true}
                        field="expiredDate"
                        onlyFuture
                        formik={formik}
                      />
                      <InputField
                        md={6}
                        name="description"
                        inputLabel={intl.formatMessage({ id: 'desc' })}
                        field="description"
                        placeholder={intl.formatMessage({ id: 'enter-desc' })}
                        formik={formik}
                      />
                    </>
                  )}
                  {activeStep === 1 && (
                    <>
                      <SelectCheckboxField
                        key="group-role-lv2"
                        field="userGroupIdLv2"
                        formik={formik}
                        inputLabel={intl.formatMessage({ id: 'group-role-lv2' })}
                        name="group-role-lv2"
                        arrayOption={dataRoleLv2}
                      />
                      <SelectCheckboxField
                        key="group-role-lv3"
                        field="userGroupIdLv3"
                        formik={formik}
                        inputLabel={intl.formatMessage({ id: 'group-role-lv3' })}
                        name="group-role-lv3"
                        arrayOption={dataRoleLv3}
                      />
                    </>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={1}></Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="pb-4">
            <Grid container justifyContent="flex-end" alignItems="center">
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="flex-end">
                  <Button color="error" onClick={onClose} aria-hidden={false}>
                    <FormattedMessage id="cancel" />
                  </Button>
                  {activeStep > 0 && (
                    <Button onClick={handleBack} aria-hidden={false}>
                      <FormattedMessage id="back" />
                    </Button>
                  )}
                  {activeStep < steps.length - 1 && (
                    <Button
                      type="button"
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn chặn event tới các phần tử khác
                        handleNext();
                      }}
                      disabled={!formik.isValid}
                      aria-hidden={false}
                    >
                      <FormattedMessage id="next" />
                    </Button>
                  )}
                  {activeStep === steps.length - 1 && (
                    <Button type="submit" variant="contained" disabled={!formik.isValid} aria-hidden={false}>
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
        </Form>
      </Dialog>
    </FormikProvider>
  );
};

export default VendorFormDialog;
