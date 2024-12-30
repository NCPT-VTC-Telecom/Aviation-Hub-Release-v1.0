import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

// material-ui
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';

//project import
import { AutocompleteField, SelectField, DatePickerField, InputField } from 'components/molecules/form';

// third-party
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';
import { enqueueSnackbar } from 'notistack';

// redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

//validate
import useValidationSchemas from 'utils/validateSchema';

//types
import { NewDevice, DeviceData } from 'types/device';
import { OptionList } from 'types/general';
import { adjustDateForTimezone, formatDateToSV } from 'utils/handleData';

const wifiStandardOptions = [
  {
    label: '802.11a',
    value: '802.11a'
  },
  {
    label: '802.11b',
    value: '802.11b'
  },
  {
    label: '802.11g',
    value: '802.11g'
  },
  {
    label: '802.11n',
    value: '802.11n'
  },
  {
    label: '802.11ac',
    value: '802.11ac'
  },
  {
    label: '802.11ax',
    value: '802.11ax'
  },
  {
    label: '802.11be',
    value: '802.11be'
  }
];

const mapLabelOptionToID = (OptionList: OptionList[], key: keyof DeviceData) => {
  if (key) {
    const OptionsID = OptionList.find((dt) => dt.label === key);
    return OptionsID ? OptionsID.value : 0;
  } else {
    return 0;
  }
};

const getInitialValues = (device: FormikValues | null, devicesType: OptionList[], aircraftOptions: OptionList[]) => {
  const dateOfManufacture = formatDateToSV(device?.manufacturer_date);
  const deactivationDate = formatDateToSV(device?.deactivation_date);
  const activationDate = formatDateToSV(device?.activation_date);

  const newDevice = {
    id: '',
    idAircraft: 0,
    idTypeDevice: 0,
    name: '',
    description: '',
    dateOfManufacture: null as Date | null,
    placementLocation: '',
    activationDate: null as Date | null,
    deactivationDate: null as Date | null,
    ipAddress: '',
    port: '',
    macAddress: '',
    ipv6Address: '',
    firmware: '',
    wifiStandard: '',
    manufacturer: '',
    model: '',
    cpuType: '',
    supplier: ''
  };

  if (device) {
    newDevice.id = device.id_device;
    newDevice.name = device.name;
    newDevice.description = device.description;
    newDevice.placementLocation = device.placement_location;
    newDevice.activationDate = device.activation_date ? adjustDateForTimezone(activationDate) : null;
    newDevice.deactivationDate = device.deactivation_date ? adjustDateForTimezone(deactivationDate) : null;
    newDevice.ipAddress = device.ip_address;
    newDevice.port = device.port;
    newDevice.macAddress = device.mac_address;
    newDevice.ipv6Address = device.ipv6_address;
    newDevice.firmware = device.firmware;
    newDevice.wifiStandard = device.wifi_standard;
    newDevice.manufacturer = device.manufacturer;
    newDevice.dateOfManufacture = device.manufacturer_date ? adjustDateForTimezone(dateOfManufacture) : null;
    newDevice.model = device.model;
    newDevice.cpuType = device.cpu_type;
    newDevice.supplier = device.supplier;
    newDevice.idTypeDevice = mapLabelOptionToID(devicesType, device?.type) as number;
    newDevice.idAircraft = mapLabelOptionToID(aircraftOptions, device?.aircraft.tail_number) as number;

    return newDevice;
  }

  return newDevice;
};

export interface Props {
  device: DeviceData | null;
  onCancel: () => void;
  handleAdd: (values: NewDevice) => void;
  handleEdit: (values: NewDevice) => void;
  open: boolean;
  aircraftOption: OptionList[];
  deviceType: OptionList[];
  supplierOption: OptionList[];
}

const AddDevice = ({ device, onCancel, handleAdd, handleEdit, open, aircraftOption, deviceType, supplierOption }: Props) => {
  const { DeviceSchema } = useValidationSchemas();
  const intl = useIntl();

  const placementLocationOptions = [
    {
      label: intl.formatMessage({ id: 'aircraft-nose' }),
      value: 'Aircraft nose'
    },
    {
      label: intl.formatMessage({ id: 'fuselage' }),
      value: 'Fuselage'
    },
    {
      label: intl.formatMessage({ id: 'aircraft-roof' }),
      value: 'Aircraft roof'
    },
    {
      label: intl.formatMessage({ id: 'aircraft-tail' }),
      value: 'Aircraft tail'
    }
  ];

  const formik = useFormik({
    initialValues: getInitialValues(device!, deviceType, aircraftOption),
    validationSchema: DeviceSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const actions = device ? handleEdit : handleAdd;

        const res: any = await actions(values);
        if (res && res.code === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: device
                ? intl.formatMessage({ id: 'device-update-successfully' })
                : intl.formatMessage({ id: 'device-add-successfully' }),
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
          if (res.code === -1 && res.message === 'Id loại thiết bị không tồn tại') {
            setFieldError('idTypeDevice', intl.formatMessage({ id: 'device-type-not-exits' }));
          }
          if (res.code === -1 && res.message === 'Id máy bay không tồn tại') {
            setFieldError('idAircraft', intl.formatMessage({ id: 'aircraft-not-exits' }));
          }
          if (res.code === -1 && res.message === 'Nhà cung cấp không tồn tại') {
            setFieldError('supplier', intl.formatMessage({ id: 'supplier-not-exits' }));
          }
          enqueueSnackbar(device ? intl.formatMessage({ id: 'update-failed' }) : intl.formatMessage({ id: 'add-failed' }), {
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

    setValues(getInitialValues(device, deviceType, aircraftOption));
    //eslint-disable-next-line
  }, [device, open]);

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle className="text-base">
              {device ? <FormattedMessage id="edit-device" /> : <FormattedMessage id="new-device" />}
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={1}></Grid>
                <Grid item xs={10}>
                  <Grid container spacing={3}>
                    <InputField
                      name="device-name"
                      inputLabel={intl.formatMessage({ id: 'device-name' })}
                      required={true}
                      field="name"
                      placeholder={intl.formatMessage({ id: 'enter-name-device' })}
                      formik={formik}
                    />
                    <InputField
                      md={6}
                      name="firmware"
                      inputLabel={intl.formatMessage({ id: 'firmware' })}
                      required={true}
                      field="firmware"
                      placeholder={intl.formatMessage({ id: 'enter-firmware' })}
                      formik={formik}
                    />
                    <SelectField
                      md={6}
                      name="wifi-standard"
                      inputLabel={intl.formatMessage({ id: 'wifi-standard' })}
                      required={true}
                      field="wifiStandard"
                      arrayOption={wifiStandardOptions || []}
                      formik={formik}
                      placeholder="select-wifi-standard"
                    />
                    <InputField
                      md={6}
                      name="ip-address"
                      inputLabel={intl.formatMessage({ id: 'ip-address' })}
                      field="ipAddress"
                      placeholder={intl.formatMessage({ id: 'enter-ip-address' })}
                      formik={formik}
                    />
                    <InputField
                      md={6}
                      name="ipv6-address"
                      inputLabel={intl.formatMessage({ id: 'ipv6-address' })}
                      field="ipv6Address"
                      placeholder={intl.formatMessage({ id: 'enter-ipv6-address' })}
                      formik={formik}
                    />
                    <InputField
                      md={6}
                      name="port"
                      inputLabel={intl.formatMessage({ id: 'port' })}
                      field="port"
                      placeholder={intl.formatMessage({ id: 'enter-port' })}
                      formik={formik}
                    />
                    <InputField
                      md={6}
                      name="mac-address"
                      inputLabel={intl.formatMessage({ id: 'mac-address' })}
                      field="macAddress"
                      placeholder={intl.formatMessage({ id: 'enter-mac-address' })}
                      formik={formik}
                    />
                    <InputField
                      name="cpu-type"
                      inputLabel={intl.formatMessage({ id: 'cpu-type' })}
                      field="cpuType"
                      placeholder={intl.formatMessage({ id: 'enter-cpu-type' })}
                      formik={formik}
                    />
                    <InputField
                      md={6}
                      name="device-model"
                      inputLabel={intl.formatMessage({ id: 'device-model' })}
                      field="model"
                      placeholder={intl.formatMessage({ id: 'enter-device-model' })}
                      formik={formik}
                    />
                    <SelectField
                      md={6}
                      name="device-type"
                      inputLabel={intl.formatMessage({ id: 'device-type' })}
                      required={true}
                      field="idTypeDevice"
                      arrayOption={deviceType || []}
                      formik={formik}
                      placeholder="select-device-type"
                    />
                    <InputField
                      md={6}
                      name="manufacturer"
                      inputLabel={intl.formatMessage({ id: 'manufacturer' })}
                      field="manufacturer"
                      placeholder={intl.formatMessage({ id: 'enter-manufacturer-device' })}
                      formik={formik}
                    />
                    <DatePickerField
                      md={6}
                      name="date-of-manufacture"
                      inputLabel={intl.formatMessage({ id: 'date-of-manufacture' })}
                      field="dateOfManufacture"
                      formik={formik}
                    />
                    <AutocompleteField
                      md={6}
                      name="placement-location"
                      inputLabel={intl.formatMessage({ id: 'placement-location' })}
                      required={true}
                      arrayOption={placementLocationOptions || []}
                      formik={formik}
                      field="placementLocation"
                      placeholder={intl.formatMessage({ id: 'select-placement-location' })}
                      noOptionText={intl.formatMessage({ id: 'no-option' })}
                    />
                    <AutocompleteField
                      md={6}
                      name="equipment-installation-aircraft"
                      inputLabel={intl.formatMessage({ id: 'equipment-installation-aircraft' })}
                      required={true}
                      arrayOption={aircraftOption || []}
                      formik={formik}
                      field="idAircraft"
                      placeholder={intl.formatMessage({ id: 'select-tail-number' })}
                      noOptionText={intl.formatMessage({ id: 'no-option' })}
                    />
                    <SelectField
                      md={12}
                      name="supplier"
                      inputLabel={intl.formatMessage({ id: 'supplier' })}
                      required={true}
                      arrayOption={supplierOption || []}
                      formik={formik}
                      field="supplier"
                      placeholder="select-supplier"
                    />
                    <DatePickerField
                      md={6}
                      name="activation-date"
                      inputLabel={intl.formatMessage({ id: 'activation-date' })}
                      field="activationDate"
                      formik={formik}
                    />
                    <DatePickerField
                      md={6}
                      name="deactivation-date"
                      inputLabel={intl.formatMessage({ id: 'deactivation-date' })}
                      field="deactivationDate"
                      formik={formik}
                    />
                    <InputField
                      name="desc"
                      inputLabel={intl.formatMessage({ id: 'desc' })}
                      field="description"
                      placeholder={intl.formatMessage({ id: 'description' })}
                      formik={formik}
                      row={2}
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
                      {device ? <FormattedMessage id="edit" /> : <FormattedMessage id="confirm" />}
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

export default AddDevice;
