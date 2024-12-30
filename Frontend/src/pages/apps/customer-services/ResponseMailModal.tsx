import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

// material-ui
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

//redux
import { RootState, dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

//third-party & utils
import { enqueueSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';

//types
import { DataMail, ResponseMail } from 'types/customer-services';

//validate
// import useValidationSchemas from 'utils/validateSchema';
import ReactQuillDemo from '../common-components/form/field/ReactQuill';
import { useSelector } from 'react-redux';

const getInitialValues = (record: FormikValues | null, userReceiverID: string) => {
  const newRecord = {
    id: 0,
    adminId: '',
    requestNumber: '',
    titleSender: '',
    bodySender: '',
    userSenderId: userReceiverID,
    bodyReceiver: '',
    userReceiverId: '',
    statusId: 33,
    modifiedDate: '',
    createdDate: '',
    userSender: {
      id: '',
      fullname: '',
      email: '',
      phoneNumber: '',
      username: ''
    }
  };

  if (record) {
    newRecord.id = record.id;
    newRecord.adminId = record.user_receiver_id;
    newRecord.requestNumber = record.request_number;
    newRecord.titleSender = record.title_sender;
    newRecord.bodySender = record.body_sender;
    newRecord.userSenderId = record.user_sender;
    newRecord.bodyReceiver = record.body_receiver;
    newRecord.userReceiverId = userReceiverID;
    newRecord.statusId = record.status_id;
    newRecord.createdDate = record.created_date;
    newRecord.userSender.id = record.user_sender.id;
    newRecord.userSender.fullname = record.user_sender.fullname;
    newRecord.userSender.email = record.user_sender.email;
    newRecord.userSender.phoneNumber = record.user_sender.phone_number;
    newRecord.userSender.username = record.user_sender.username;
  }

  return newRecord;
};

export interface Props {
  record: DataMail | null;
  onCancel: () => void;
  handleResponseMail: (requestNumber: string, values: ResponseMail) => void;
  // handleEdit: (values: ResponseMail) => void;
  open: boolean;
}

const ResponseMailModal = ({ record, onCancel, handleResponseMail, open }: Props) => {
  const [userSenderID, setUserSenderID] = useState('');
  // const { AircraftSchema } = useValidationSchemas();
  const user = useSelector((state: RootState) => state.authSlice.user);
  const intl = useIntl();

  const formik = useFormik({
    initialValues: getInitialValues(record!, userSenderID),
    // validationSchema: AircraftSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // const actions = record && handleResponseMail;
        const res: any = await handleResponseMail(values.requestNumber, values);
        if (res && res.code === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: intl.formatMessage({ id: 'reply-successfully' }),
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
          enqueueSnackbar(intl.formatMessage({ id: 'reply-failed' }), {
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

  const { handleSubmit, isSubmitting, setValues, resetForm } = formik;

  useEffect(() => {
    if (user) {
      setUserSenderID(user.id);
    }

    if (!record && open) {
      resetForm({
        touched: {},
        errors: {}
      });
    }
    if (record) {
      setValues(getInitialValues(record, userSenderID));
    }

    //eslint-disable-next-line
  }, [record, open]);

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle className="text-lg">
              {record?.request_number} - {record?.title_sender}
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={1}></Grid>
                <Grid item xs={10}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h4"></Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <Typography>
                          <FormattedMessage id="from" />:
                        </Typography>
                        <Typography>{record?.user_sender.fullname}</Typography>
                        <Typography>{record?.user_sender.email}</Typography>
                        <Typography>{record?.user_sender.phone_number}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1.25}>
                        <Typography className="text-right">{record?.created_date}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider className="bg-black" />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h5" className="mb-4">
                        <FormattedMessage id="mail-content" /> :
                      </Typography>
                      <Typography>{record?.body_sender}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider className="bg-black" />
                    </Grid>
                    <Grid item xs={12}>
                      <ReactQuillDemo field="bodyReceiver" formik={formik}></ReactQuillDemo>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={1}></Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="flex-end" alignItems="center">
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="flex-end">
                    <Button color="error" onClick={onCancel}>
                      <FormattedMessage id="cancel" />
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      <FormattedMessage id="send" />
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};

export default ResponseMailModal;
