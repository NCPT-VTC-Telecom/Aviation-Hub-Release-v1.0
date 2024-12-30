import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

// material-ui
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// project-imports
import { SelectField, DatePickerField, InputField } from 'components/molecules/form';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

//third-party & utils
import { enqueueSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';
import { adjustDateForTimezone, formatDateToSV, formatYear } from 'utils/handleData';

//types
import { NewAircraft, AircraftData } from 'types/aviation';

//validate
import useValidationSchemas from 'utils/validateSchema';

const getInitialValues = (record: FormikValues | null) => {
  const maintenanceSchedule = formatDateToSV(record?.maintenance_schedule);
  const lastMaintenanceDate = formatDateToSV(record?.last_maintenance_date);

  const newRecord = {
    id: 0,
    flightNumber: '',
    tailNumber: '',
    model: '',
    manufacturer: '',
    modelType: '',
    capacity: 0,
    maintenanceSchedule: null as Date | null | string,
    lastMaintenanceDate: null as Date | null | string,
    leasedAircraftStatus: '',
    yearManufactured: null as Date | null | string,
    ownership: ''
  };

  if (record) {
    newRecord.id = record.id;
    newRecord.flightNumber = record.flight_number;
    newRecord.tailNumber = record.tail_number;
    newRecord.model = record.model;
    newRecord.manufacturer = record.manufacturer;
    newRecord.modelType = record.model_type;
    newRecord.capacity = record.capacity;
    newRecord.maintenanceSchedule = record.maintenance_schedule ? adjustDateForTimezone(maintenanceSchedule) : null;
    newRecord.lastMaintenanceDate = record.last_maintenance_date ? adjustDateForTimezone(lastMaintenanceDate) : null;
    newRecord.leasedAircraftStatus = record.leased_aircraft_status;
    newRecord.yearManufactured = record?.year_manufactured ? formatYear(record?.year_manufactured) : null;
    newRecord.ownership = record.ownership;
  }

  return newRecord;
};

export interface Props {
  record: AircraftData | null;
  onCancel: () => void;
  handleAdd: (values: NewAircraft) => void;
  handleEdit: (values: NewAircraft) => void;
  open: boolean;
}

const AddAircraft = ({ record, onCancel, handleAdd, handleEdit, open }: Props) => {
  const { AircraftSchema } = useValidationSchemas();
  const intl = useIntl();

  const leasedAircraft = [
    {
      label: intl.formatMessage({ id: 'owned' }),
      value: 'owned'
    },
    {
      label: intl.formatMessage({ id: 'rent' }),
      value: 'rent'
    },
    {
      label: intl.formatMessage({ id: 'lease' }),
      value: 'lease'
    }
  ];

  const formik = useFormik({
    initialValues: getInitialValues(record!),
    validationSchema: AircraftSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const actions = record ? handleEdit : handleAdd;
        const res: any = await actions(values);
        if (res && res.code === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: record ? intl.formatMessage({ id: 'update-successfully' }) : intl.formatMessage({ id: 'add-successfully' }),
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
          if (res.code === -1 && res.message === 'Số đuôi máy bay này đã tồn tại') {
            setFieldError('tailNumber', intl.formatMessage({ id: 'duplicate-tail-number' }));
          }
          if (res.code === -1 && res.message === 'Số máy bay này đã tồn tại') {
            setFieldError('flightNumber', intl.formatMessage({ id: 'duplicate-flight-number' }));
          }

          enqueueSnackbar(record ? intl.formatMessage({ id: 'update-failed' }) : intl.formatMessage({ id: 'add-failed' }), {
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
    resetForm({
      touched: {},
      errors: {}
    });
    if (record) {
      setValues(getInitialValues(record));
    }

    //eslint-disable-next-line
  }, [record, open]);

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle className="text-base">{record ? <FormattedMessage id="edit" /> : <FormattedMessage id="add-new" />}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={1}></Grid>
                <Grid item xs={10}>
                  <Grid container spacing={3}>
                    <InputField
                      md={6}
                      name="flight-number"
                      inputLabel={intl.formatMessage({ id: 'flight-number' })}
                      required={true}
                      field="flightNumber"
                      placeholder={intl.formatMessage({ id: 'enter-flight-number' })}
                      formik={formik}
                    />
                    <InputField
                      md={6}
                      name="tail_number"
                      field="tailNumber"
                      inputLabel={intl.formatMessage({ id: 'tail_number' })}
                      required={true}
                      placeholder={intl.formatMessage({ id: 'enter-tail-number' })}
                      formik={formik}
                      readOnly={record ? true : false}
                    />
                    <InputField
                      md={6}
                      name="model"
                      inputLabel={intl.formatMessage({ id: 'model' })}
                      required={true}
                      field="model"
                      placeholder={intl.formatMessage({ id: 'enter-model' })}
                      formik={formik}
                    />
                    <InputField
                      md={6}
                      name="aircraft-model-type"
                      field="modelType"
                      inputLabel={intl.formatMessage({ id: 'aircraft-model-type' })}
                      required={true}
                      placeholder={intl.formatMessage({ id: 'enter-aircraft-model-type' })}
                      formik={formik}
                    />
                    <InputField
                      md={6}
                      name="passengers-capacity"
                      type="number"
                      inputLabel={intl.formatMessage({ id: 'passengers-capacity' })}
                      required={true}
                      field="capacity"
                      placeholder={intl.formatMessage({ id: 'enter-passengers-capacity' })}
                      formik={formik}
                    />
                    <SelectField
                      md={6}
                      arrayOption={leasedAircraft}
                      name="leased-aircraft-status"
                      field="leasedAircraftStatus"
                      placeholder={intl.formatMessage({ id: 'select-leased-aircraft-status' })}
                      inputLabel={intl.formatMessage({ id: 'leased-aircraft-status' })}
                      formik={formik}
                    />
                    {/* <InputField
                      md={6}
                      name="leased-aircraft-status"
                      inputLabel={intl.formatMessage({ id: 'leased-aircraft-status' })}
                      field="leasedAircraftStatus"
                      placeholder={intl.formatMessage({ id: 'enter-leased-aircraft-status' })}
                      formik={formik}
                    /> */}
                    <InputField
                      md={6}
                      name="manufacturer"
                      inputLabel={intl.formatMessage({ id: 'manufacturer' })}
                      required={true}
                      field="manufacturer"
                      placeholder={intl.formatMessage({ id: 'enter-manufacturer' })}
                      formik={formik}
                    />
                    {/* <InputField
                      md={6}
                      name="year-manufactured"
                      inputLabel={intl.formatMessage({ id: 'year-manufactured' }) + '*'}
                      field="yearManufactured"
                      placeholder={intl.formatMessage({ id: 'enter-year-manufactured' })}
                      formik={formik}
                    /> */}
                    <DatePickerField
                      md={6}
                      name="year-manufactured"
                      inputLabel={intl.formatMessage({ id: 'year-manufactured' })}
                      required={true}
                      field="yearManufactured"
                      formik={formik}
                      onlyYear
                      onlyPast
                    />
                    <InputField
                      md={6}
                      name="aircraft-owners"
                      inputLabel={intl.formatMessage({ id: 'aircraft-owners' })}
                      required={true}
                      field="ownership"
                      placeholder={intl.formatMessage({ id: 'enter-aircraft-owners' })}
                      formik={formik}
                    />
                    <DatePickerField
                      md={6}
                      name="maintenance-schedule"
                      inputLabel={intl.formatMessage({ id: 'maintenance-schedule' })}
                      field="maintenanceSchedule"
                      formik={formik}
                    />
                    <DatePickerField
                      md={6}
                      name="last-maintenance-date"
                      inputLabel={intl.formatMessage({ id: 'last-maintenance-date' })}
                      field="lastMaintenanceDate"
                      formik={formik}
                    />
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
                      {record ? <FormattedMessage id="edit" /> : <FormattedMessage id="confirm" />}
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

export default AddAircraft;
