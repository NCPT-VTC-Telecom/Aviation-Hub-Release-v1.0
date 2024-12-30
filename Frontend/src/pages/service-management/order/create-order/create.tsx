import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import useValidationSchemas from 'utils/validateSchema';

// material-ui
import {
  CircularProgress,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Autocomplete // Import Autocomplete here
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FormattedMessage, useIntl } from 'react-intl';
import useConfig from 'hooks/useConfig';

// third-party
import { FieldArray, useFormik, FormikProvider, Form } from 'formik';
import { enqueueSnackbar } from 'notistack';

// project-imports
import MainCard from 'components/MainCard';
import InvoiceItem from 'components/molecules/order/invoice/component-overview/InvoiceItem';
import { SelectField, DatePickerField, AutocompleteField } from 'components/molecules/form';

// utils
import { formatTime, getOption, getRouteHistory, getTimeFlight, useLangUpdate } from 'utils/handleData';
import { calculateSubtotal } from 'utils/calculateSubtotal';

// redux
import { dispatch, useSelector, RootState } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { selectCountry } from 'store/reducers/invoice';

// assets
import { Add } from 'iconsax-react';

// types
import { CountryType } from 'types/invoice';
import { OptionList } from 'types/general';

// model
import { getGateway, getPaymentMethod, getAircraft, postCreateOrder, getAllUser } from './model';
import { getUser } from 'pages/apps/profiles/account/model';

const Create = () => {
  const { countries, country } = useSelector((state) => state.invoice);
  const user = useSelector((state: RootState) => state.authSlice.user);

  const { OrderSchema } = useValidationSchemas();
  const navigate = useNavigate();
  const { i18n } = useConfig();
  const theme = useTheme();
  const intl = useIntl();

  const [paymentMethodOptions, setPaymentMethodOptions] = useState<OptionList[]>([]);
  const [aircraftOptions, setAircraftOptions] = useState<OptionList[]>([]);
  const [gatewayOptions, setGatewayOptions] = useState<OptionList[]>([]);
  const [userOptions, setUserOptions] = useState<OptionList[]>([]);
  const [userInfo, setUserInfo] = useState(user);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialAircraftOptions, setIsInitialAircraftOptions] = useState<boolean>(false);

  useLangUpdate(i18n);

  const notesLimit: number = 500;

  const typeProductOptions: OptionList[] = [
    {
      label: intl.formatMessage({ id: 'wifi-packages' }),
      value: 'product'
    },
    {
      label: intl.formatMessage({ id: 'airfare-packages' }),
      value: 'airline'
    },
    {
      label: intl.formatMessage({ id: 'telecom-packages' }),
      value: 'telecom'
    }
  ];

  const fetchData = useCallback(async () => {
    const gatewayPromise = getGateway();
    const paymentMethodPromise = getPaymentMethod();
    const aircraftPromise = getAircraft(formik.values.date);
    const userPromise = getAllUser();

    const results = await Promise.allSettled([gatewayPromise, paymentMethodPromise, aircraftPromise, userPromise]);

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const { code, data } = result.value;

        if (code === 0) {
          switch (index) {
            case 0:
              setGatewayOptions(getOption(data, 'title', 'id'));
              break;
            case 1:
              setPaymentMethodOptions(getOption(data, 'title', 'id'));
              break;
            case 2:
              const mapRoute = getRouteHistory(data);
              const formattedTime = formatTime(mapRoute, ['departure_time', 'arrival_time']);
              const mapTimeFlight = getTimeFlight(formattedTime);
              setAircraftOptions(getOption(mapTimeFlight, 'aircraft.flight_number', 'aircraft.id', 'route', 'timeFlight'));
              setIsInitialAircraftOptions(true);
              break;
            case 3:
              setUserOptions(getOption(data, 'username', 'id'));
              break;
          }
        } else {
          navigate('/login');
        }
      } else {
        if (index === 0) setGatewayOptions([]);
        if (index === 1) setPaymentMethodOptions([]);
        if (index === 2) setAircraftOptions([]);
      }
    });
    //eslint-disable-next-line
  }, []);

  const getUserInfo = useCallback(async (userID: string) => {
    try {
      const res = await getUser(userID);
      setUserInfo(res.data[0]);
    } catch (err) {}
  }, []);

  const handleCreateOrder = useCallback(async (record: any) => {
    try {
      const res = await postCreateOrder(record);
      return res;
    } catch (err) {}
  }, []);

  const getInitialValues = useCallback(
    () => ({
      date: new Date(),
      customerInfo: {
        address: userInfo?.address,
        email: userInfo?.email,
        name: userInfo?.fullname,
        phone: userInfo?.phoneNumber
      },
      subtotal: 0,
      total: 0,
      totalQuantity: 0,
      itemList: [
        {
          name: '',
          type: '',
          productId: 0,
          quantity: 0,
          price: '0.00'
        }
      ],
      totalDiscount: 0,
      idGateway: 0,
      idPaymentMethod: 0,
      idUser: userInfo?.id,
      note: '',
      taxFee: 0,
      shippingMethod: 'Online',
      idFlight: 0
    }),
    [userInfo]
  );

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: OrderSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true);
      try {
        const res = await handleCreateOrder(values);
        if (res.code === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: intl.formatMessage({ id: 'create-order-successfully' }),
              variant: 'alert',
              alert: { color: 'success' },
              close: false
            })
          );
          navigate('/order-management/order-list');
        } else {
          setSubmitting(false);
          enqueueSnackbar(intl.formatMessage({ id: 'create-failed' }), { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
          variant: 'error'
        });
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    }
  });

  const discountRate = 0;
  const taxRate = 0;

  const { handleSubmit, touched, errors, values, handleChange, handleBlur, setFieldValue } = formik;

  useEffect(() => {
    const subtotal = calculateSubtotal(values.itemList);
    const taxAmount = subtotal * (taxRate / 100);
    setFieldValue('subtotal', subtotal);
    setFieldValue('total', subtotal - values.totalDiscount + taxAmount);
    setFieldValue(
      'totalQuantity',
      values.itemList.reduce((total, item) => total + (item.quantity || 1), 0)
    );
  }, [values.itemList, values.totalDiscount, taxRate, setFieldValue]);

  const renderSubtotal = useMemo(() => {
    const formattedSubtotal =
      country?.code === 'VN'
        ? values.subtotal.toLocaleString('vi-VN') + ' ' + country?.prefix
        : country?.prefix + '' + values.subtotal.toFixed(2);

    return formattedSubtotal;
  }, [values.subtotal, country]);

  const renderTotal = useMemo(() => {
    const formattedTotal =
      country?.code === 'VN'
        ? values.total % 1 === 0
          ? values.total.toLocaleString('vi-VN') + ' ' + country?.prefix
          : values.total.toLocaleString('vi-VN') + ' ' + country?.prefix
        : values.total % 1 === 0
        ? country?.prefix + '' + values.total
        : country?.prefix + '' + values.total.toFixed(2);

    return formattedTotal;
  }, [values.total, country]);

  const getFlight = async () => {
    try {
      const res = await getAircraft(formik.values.date);
      const mapRoute = getRouteHistory(res.data);
      const formattedTime = formatTime(mapRoute, ['departure_time', 'arrival_time']);
      const mapTimeFlight = getTimeFlight(formattedTime);
      setAircraftOptions(getOption(mapTimeFlight, 'aircraft.flight_number', 'aircraft.id', 'route', 'timeFlight'));
    } catch {}
  };

  useEffect(() => {
    if (isInitialAircraftOptions) {
      getFlight();
    }
    //eslint-disable-next-line
  }, [formik.values.date, isInitialAircraftOptions]);

  useEffect(() => {
    fetchData();
  }, [fetchData, i18n]);

  useEffect(() => {
    if (formik.values.idUser) {
      getUserInfo(formik.values.idUser);
    }
  }, [formik.values.idUser, getUserInfo]);

  return (
    <MainCard>
      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <AutocompleteField
              name="user_id"
              arrayOption={userOptions}
              xs={12}
              sm={6}
              md={4}
              inputLabel={intl.formatMessage({ id: 'username' })}
              field="idUser"
              placeholder={intl.formatMessage({ id: 'select-user-name' })}
              formik={formik}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePickerField
                name="date"
                inputLabel={intl.formatMessage({ id: 'date' })}
                field="date"
                xs={12}
                sm={6}
                md={4}
                formik={formik}
              />
            </LocalizationProvider>
            <SelectField
              xs={12}
              sm={6}
              md={4}
              inputLabel={intl.formatMessage({ id: 'select-flight-number' })}
              name="flight-number"
              field="idFlight"
              arrayOption={aircraftOptions}
              placeholder={intl.formatMessage({ id: 'select-flight-number' })}
              formik={formik}
            />
            <Grid item xs={12} sm={6}>
              <MainCard sx={{ minHeight: 168 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <Stack spacing={2}>
                      <Typography variant="h5">
                        <FormattedMessage id="customer-info" />:
                      </Typography>
                      <Stack sx={{ width: '100%' }}>
                        <Typography variant="subtitle1">{userInfo?.fullname}</Typography>
                        <Typography color="secondary">{userInfo?.username}</Typography>
                        <Typography color="secondary">{userInfo?.email}</Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">
                <FormattedMessage id="detail" />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FieldArray
                name="itemList"
                render={({ remove, push }) => (
                  <>
                    <TableContainer>
                      <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>
                              <FormattedMessage id="type-product" />
                            </TableCell>
                            <TableCell>
                              <FormattedMessage id="name-product" />
                            </TableCell>
                            <TableCell>
                              <FormattedMessage id="quantity" />
                            </TableCell>
                            <TableCell>
                              <FormattedMessage id="price" />
                            </TableCell>
                            <TableCell align="right">
                              <FormattedMessage id="amount" />
                            </TableCell>
                            <TableCell align="right">
                              <FormattedMessage id="action" />
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {values.itemList?.map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <InvoiceItem
                                key={index}
                                id={item.id}
                                index={index}
                                name={item.name}
                                quantity={item.quantity}
                                price={item.price}
                                onDeleteItem={() => remove(index)}
                                onEditItem={handleChange}
                                Blur={handleBlur}
                                errors={errors}
                                touched={touched}
                                // productData={productData}
                                formik={formik}
                                typeProductOptions={typeProductOptions}
                                initialType={item.type}
                              />
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Divider />
                    {touched.itemList && errors.itemList && !Array.isArray(errors?.itemList) && (
                      <Stack direction="row" justifyContent="center" sx={{ p: 1.5 }}>
                        <FormHelperText error={true}>{errors.itemList as string}</FormHelperText>
                      </Stack>
                    )}
                    <Grid container justifyContent="space-between">
                      <Grid item xs={12} md={8}>
                        <Box sx={{ pt: 2.5, pr: 2.5, pb: 2.5, pl: 0 }}>
                          <Button
                            color="primary"
                            startIcon={<Add />}
                            onClick={() =>
                              push({
                                productId: 0,
                                name: '',
                                quantity: 0,
                                price: '0'
                              })
                            }
                            variant="dashed"
                            sx={{ bgcolor: 'transparent !important' }}
                          >
                            <FormattedMessage id="add-product" />
                          </Button>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Grid container justifyContent="space-between" spacing={2} sx={{ pt: 2.5, pb: 2.5 }}>
                          <SelectField
                            xs={6}
                            md={6}
                            name="gateway"
                            field="idGateway"
                            arrayOption={gatewayOptions}
                            placeholder={intl.formatMessage({ id: 'select-gateway' })}
                            formik={formik}
                          />
                          <SelectField
                            xs={6}
                            md={6}
                            name="payment-method"
                            field="idPaymentMethod"
                            arrayOption={paymentMethodOptions}
                            placeholder={intl.formatMessage({ id: 'select-payment-method' })}
                            formik={formik}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Stack spacing={2}>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography color={theme.palette.secondary.main}>
                                <FormattedMessage id="sub-total-product" />:
                              </Typography>
                              <Typography>{renderSubtotal}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography color={theme.palette.secondary.main}>
                                <FormattedMessage id="discount" />:
                              </Typography>
                              <Typography variant="h6" color={theme.palette.success.main}>
                                {country?.code === 'VN'
                                  ? discountRate + ' ' + country?.prefix
                                  : country?.prefix + '' + discountRate.toFixed(2)}
                              </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography color={theme.palette.secondary.main}>
                                <FormattedMessage id="tax" />:
                              </Typography>
                              <Typography>
                                {country?.code === 'VN' ? taxRate + ' ' + country?.prefix : country?.prefix + '' + taxRate.toFixed(2)}
                              </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="subtitle1">
                                <FormattedMessage id="grand-total" />:
                              </Typography>
                              <Typography variant="subtitle1">{renderTotal}</Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel>
                  <FormattedMessage id="notes" />
                </InputLabel>
                <TextField
                  placeholder={intl.formatMessage({ id: 'note' })}
                  rows={3}
                  value={values.note}
                  multiline
                  name="note"
                  onChange={handleChange}
                  inputProps={{
                    maxLength: notesLimit
                  }}
                  helperText={`${values.note.length} / ${notesLimit}`}
                  sx={{
                    width: '100%',
                    '& .MuiFormHelperText-root': {
                      mr: 0,
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel>
                  <FormattedMessage id="set-currency" />*
                </InputLabel>
                <FormControl sx={{ width: { xs: '100%', sm: 250 } }}>
                  <Autocomplete
                    id="country-select-demo"
                    fullWidth
                    options={countries}
                    defaultValue={countries[0]}
                    value={countries.find((option: CountryType) => option.code === country?.code)}
                    onChange={(event, value) => {
                      dispatch(
                        selectCountry({
                          country: value
                        })
                      );
                    }}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        {option.code && (
                          <img
                            loading="lazy"
                            width="20"
                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                            alt=""
                          />
                        )}
                        {option.label}
                      </Box>
                    )}
                    renderInput={(params) => {
                      const selected = countries.find((option: CountryType) => option.code === country?.code);
                      return (
                        <TextField
                          {...params}
                          name="phoneCode"
                          placeholder="Select"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                {selected && selected.code !== '' && (
                                  <img
                                    style={{ marginRight: 6 }}
                                    loading="lazy"
                                    width="20"
                                    src={`https://flagcdn.com/w20/${selected.code.toLowerCase()}.png`}
                                    srcSet={`https://flagcdn.com/w40/${selected.code.toLowerCase()}.png 2x`}
                                    alt=""
                                  />
                                )}
                              </>
                            )
                          }}
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password' // disable autocomplete and autofill
                          }}
                        />
                      );
                    }}
                  />
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={2} sx={{ height: '100%' }}>
                <Button color="primary" variant="contained" type="submit" disabled={!formik.isValid || isLoading}>
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : <FormattedMessage id="create-order" />}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </MainCard>
  );
};

export default Create;
