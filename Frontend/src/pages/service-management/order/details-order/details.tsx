import { useEffect, useState, useRef, Ref } from 'react';
import { useNavigate, useParams } from 'react-router';
import { FormattedMessage, useIntl } from 'react-intl';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  IconButton,
  FormControl,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
  Button
} from '@mui/material';

// third-party
import ReactToPrint from 'react-to-print';
// import { PDFDownloadLink } from '@react-pdf/renderer';

//model
import { getOrder, postAddBilling } from './model';

// project-imports
// import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import LogoSection from 'components/logo';
// import ExportPDFView from 'pages/apps/common-components/order/invoice/component-overview/export-pdf';

//redux
import { dispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

//types
import { Order, OrderDetail } from 'types/order';

// assets
import {
  // DocumentDownload,
  Printer,
  Share,
  ArrowLeft
} from 'iconsax-react';

//utils
import { formatDate } from 'utils/handleData';
import getChipStatus from 'pages/apps/common-components/form/field/renderChip';
import { enqueueSnackbar } from 'notistack';

// ==============================|| INVOICE - DETAILS ||============================== //

const Details = () => {
  const [orderDetail, setOrderDetail] = useState<Order>();
  const { orderNumber } = useParams();
  const navigation = useNavigate();
  const theme = useTheme();
  const intl = useIntl();

  const { country } = useSelector((state) => state.invoice);

  const getOrderDetail = async () => {
    try {
      if (orderNumber) {
        const res = await getOrder(orderNumber);
        const formattedData = formatDate(res.data, ['created_date']);
        // setLoading(true);
        setOrderDetail(formattedData[0]);
      }
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  };

  async function createBill(idOrder: string) {
    try {
      const res = await postAddBilling(idOrder);
      if (res.code === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: intl.formatMessage({ id: 'add-bill-successfully' }),
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
      } else {
        enqueueSnackbar(intl.formatMessage({ id: 'add-failed' }), {
          variant: 'error'
        });
      }
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  }

  useEffect(() => {
    getOrderDetail();
    //eslint-disable-next-line
  }, []);

  const componentRef: Ref<HTMLDivElement> = useRef(null);

  // if (loading) return <Loader />;

  return (
    <MainCard content={false}>
      <Stack spacing={2.5}>
        <Box sx={{ p: 2.5, pb: 0 }}>
          <MainCard content={false} border={false} sx={{ p: 1.25, bgcolor: 'secondary.lighter' }}>
            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Button
                variant="text"
                color="secondary"
                startIcon={<ArrowLeft color={theme.palette.text.secondary} />}
                onClick={() => navigation('/order-management/order-list')}
              ></Button>
              <Stack direction="row" justifyContent="flex-end">
                {/* <IconButton onClick={() => navigation(`/order/edit-order/${orderNumber}`)}>
                  <Edit color={theme.palette.text.secondary} />
                </IconButton> */}
                {/* <PDFDownloadLink document={<ExportPDFView list={list} />} fileName={`${orderDetail.orderNumber}-${list?.customer_name}.pdf`}>
                <IconButton>
                  <DocumentDownload color={theme.palette.text.secondary} />
                </IconButton>
              </PDFDownloadLink> */}
                <ReactToPrint
                  trigger={() => (
                    <IconButton>
                      <Printer color={theme.palette.text.secondary} />
                    </IconButton>
                  )}
                  content={() => componentRef.current}
                />
                <IconButton>
                  <Share color={theme.palette.text.secondary} />
                </IconButton>
              </Stack>
            </Stack>
          </MainCard>
        </Box>
        <Box sx={{ p: 2.5 }} id="print" ref={componentRef}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
                <Stack spacing={0.5}>
                  <Stack direction="row" spacing={2} width={300}>
                    <LogoSection />
                  </Stack>
                  <Typography color="secondary">#{orderDetail?.order_number}</Typography>
                </Stack>
                <Box>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Typography variant="subtitle1">
                      <FormattedMessage id="created-date" />
                    </Typography>
                    <Typography color="secondary">{orderDetail?.created_date}</Typography>
                  </Stack>
                  {/* <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Typography sx={{ overflow: 'hidden' }} variant="subtitle1">
                      Due Date
                    </Typography>
                    <Typography color="secondary">{due_dates}</Typography>
                  </Stack> */}
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <MainCard>
                <Stack spacing={1}>
                  <Typography variant="h5">
                    <FormattedMessage id="customer-info" />:
                  </Typography>
                  <FormControl sx={{ width: '100%' }}>
                    <Stack direction={'row'} gap={0.75}>
                      <Typography color="secondary">
                        <FormattedMessage id="customer-name" />:
                      </Typography>
                      <Typography color="secondary">{orderDetail?.user?.fullname}</Typography>
                    </Stack>
                    <Stack direction={'row'} gap={0.75}>
                      <Typography color="secondary">
                        <FormattedMessage id="email-address" />:
                      </Typography>
                      <Typography color="secondary">{orderDetail?.user?.email}</Typography>
                    </Stack>
                    <Stack direction={'row'} gap={0.75}>
                      <Typography color="secondary">
                        <FormattedMessage id="phone-number" />:
                      </Typography>
                      <Typography color="secondary">{orderDetail?.user?.phone_number}</Typography>
                    </Stack>
                    <Stack direction={'row'} gap={0.75}>
                      <Typography color="secondary">
                        <FormattedMessage id="address" />:
                      </Typography>
                      <Typography color="secondary">{orderDetail?.user?.province}</Typography>
                    </Stack>
                  </FormControl>
                </Stack>
              </MainCard>
            </Grid>
            <Grid item xs={12} sm={6}>
              <MainCard>
                <Stack spacing={1}>
                  <Typography variant="h5">
                    <FormattedMessage id="order-info" />:
                  </Typography>
                  <FormControl sx={{ width: '100%' }}>
                    <Stack direction={'row'} gap={0.75}>
                      <Typography color="secondary">
                        <FormattedMessage id="order-status" />:
                      </Typography>
                      {orderDetail ? (
                        orderDetail.transaction !== null && orderDetail.transaction.status_id ? (
                          getChipStatus(orderDetail.transaction.status_id, 'paid', 'not-paid', 'pending')
                        ) : (
                          <Button variant="text" onClick={() => createBill(orderDetail.id)}>
                            <FormattedMessage id="create-bill" />
                          </Button>
                        )
                      ) : (
                        <div>
                          <FormattedMessage id="loading-order-detail-or-not-available" />
                          ...
                        </div>
                      )}
                    </Stack>
                    <Stack direction={'row'} gap={0.75}>
                      <Typography color="secondary">
                        <FormattedMessage id="quantity" />:
                      </Typography>
                      <Typography color="secondary">{orderDetail?.total_quantity.toLocaleString('vi-VN')}</Typography>
                    </Stack>
                    <Stack direction={'row'} gap={0.75}>
                      <Typography color="secondary">
                        <FormattedMessage id="grand-total" />:
                      </Typography>
                      <Typography color="secondary">
                        {country?.code === 'VN'
                          ? orderDetail?.total.toLocaleString('vi-VN') + ' ' + country?.prefix
                          : country?.prefix + '' + orderDetail?.total}
                      </Typography>
                    </Stack>
                    <Stack direction={'row'} gap={0.75}>
                      <Typography color="secondary">
                        <FormattedMessage id="created-order-date" />:
                      </Typography>
                      <Typography color="secondary">{orderDetail?.created_date}</Typography>
                    </Stack>
                  </FormControl>
                </Stack>
              </MainCard>
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>
                        <FormattedMessage id="name-product" />
                      </TableCell>
                      <TableCell>
                        <FormattedMessage id="desc" />
                      </TableCell>
                      <TableCell align="right">
                        <FormattedMessage id="quantity" />
                      </TableCell>
                      <TableCell align="right">
                        <FormattedMessage id="price" />
                      </TableCell>
                      <TableCell align="right">
                        <FormattedMessage id="grand-total" />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderDetail?.order_details?.map((row: OrderDetail, index: number) => (
                      <TableRow key={row.product.title} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.product.title}</TableCell>
                        <TableCell>{row.product.description}</TableCell>
                        <TableCell align="right">{row.quantity}</TableCell>
                        <TableCell align="right">
                          {country?.code === 'VN'
                            ? Number(row.product?.price.new_price).toLocaleString('vi-VN') + ' ' + country?.prefix
                            : country?.prefix + '' + Number(row.product?.price.new_price).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {country?.code === 'VN'
                            ? Number(row.product?.price.new_price * row.quantity).toLocaleString('vi-VN') + ' ' + country?.prefix
                            : country?.prefix + '' + Number(row.product?.price.new_price * row.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ borderWidth: 1 }} />
            </Grid>
            <Grid item xs={12} sm={6} md={8}></Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.secondary.main}>
                    <FormattedMessage id="sub-total-product" />:
                  </Typography>
                  <Typography>
                    {country?.code === 'VN'
                      ? orderDetail?.subtotal.toLocaleString('vi-VN') + ' ' + country?.prefix
                      : country?.prefix + '' + orderDetail?.subtotal.toFixed(2)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.secondary.main}>
                    <FormattedMessage id="discount" />:
                  </Typography>
                  <Typography variant="h6" color={theme.palette.success.main}>
                    {country?.code === 'VN'
                      ? orderDetail?.total_discount.toLocaleString('vi-VN') + ' ' + country?.prefix
                      : country?.prefix + '' + orderDetail?.total_discount?.toFixed(2)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color={theme.palette.secondary.main}>
                    <FormattedMessage id="tax" />:
                  </Typography>
                  <Typography>
                    {country?.code === 'VN'
                      ? orderDetail?.tax_fee.toLocaleString('vi-VN') + ' ' + country?.prefix
                      : country?.prefix + '' + orderDetail?.tax_fee?.toFixed(2)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1">
                    <FormattedMessage id="grand-total" />:
                  </Typography>
                  <Typography variant="subtitle1">
                    {country?.code === 'VN'
                      ? orderDetail?.total.toLocaleString('vi-VN') + ' ' + country?.prefix
                      : country?.prefix + '' + orderDetail?.total}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Box>
        {/* <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ p: 2.5, a: { textDecoration: 'none', color: 'inherit' } }}>
          <PDFDownloadLink document={<ExportPDFView list={list} />} fileName={`${list?.invoice_id}-${list?.customer_name}.pdf`}>
            <Button variant="contained" color="primary">
              <FormattedMessage id="download" />
            </Button>
          </PDFDownloadLink>
        </Stack> */}
      </Stack>
    </MainCard>
  );
};

export default Details;
