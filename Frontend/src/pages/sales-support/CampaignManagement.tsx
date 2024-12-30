import { useCallback, useEffect, useState, useMemo } from 'react';
import useConfig from 'hooks/useConfig';
import { FormattedMessage, useIntl } from 'react-intl';

// material-ui
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  FormHelperText,
  Stack,
  Tooltip,
  Dialog
} from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import AlertCustomerDelete from '../apps/users/AlertCustomerDelete';
import { PopupTransition } from 'components/@extended/Transitions';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { InputField, SelectField } from 'components/molecules/form';
import GenericForm from 'components/organisms/GenericForm';
import ViewDialog from 'components/template/ViewDialog';

//config
import { columnsCampaign } from 'components/ul-config/table-config/promotion';
import { campaignFields } from 'components/ul-config/form-config';
import { campaignViewConfig } from 'components/ul-config/view-dialog-config';

//model & utils
import { getOption, useLangUpdate } from 'utils/handleData';
import useValidationSchemas from 'utils/validateSchema';

//third-party
import dayjs from 'dayjs';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { FieldArray, useFormik } from 'formik';

//hook
import useHandleProduct from 'hooks/useHandleProduct';
import useHandleCampaign from 'hooks/useHandleCampaign';

//assets
import { Add, Trash } from 'iconsax-react';

//types
import { CampaignData, NewCampaign } from 'types/vouchers';
import { OptionList } from 'types';
import AlertProductDelete from 'components/molecules/order/invoice/component-overview/AlertProductDelete';

const CampaignManagement = () => {
  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [record, setRecord] = useState<CampaignData | null>(null);
  const [recordDelete, setRecordDelete] = useState<CampaignData | null>(null);
  const [data, setData] = useState<CampaignData[]>([]);
  const [optionProduct, setOptionProduct] = useState<OptionList[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [deleteIndex, setDeleteIndex] = useState(-1);

  const intl = useIntl();
  const { i18n } = useConfig();
  const { CampaignSchema } = useValidationSchemas();
  useLangUpdate(i18n);

  const { isLoading, isReload, fetchDataCampaign, handleActionCampaign, totalPages } = useHandleCampaign();
  const { fetchDataProduct } = useHandleProduct();

  const getDataOption = useCallback(async () => {
    const dataProduct = await fetchDataProduct({ type: 'product' });
    setOptionProduct(getOption(dataProduct, 'title', 'id'));
    //eslint-disable-next-line
  }, []);

  const getData = useCallback(async (pageIndex: number, pageSize: number, searchValue?: string) => {
    const dataCampaign = await fetchDataCampaign({ page: pageIndex, pageSize, filters: searchValue });
    setData(dataCampaign);
    //eslint-disable-next-line
  }, []);

  const handlePageChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex + 1);
    setPageSize(newPageSize);
  };

  useEffect(() => {
    getData(pageIndex, pageSize, searchValue);
    getDataOption();
    //eslint-disable-next-line
  }, [pageIndex, pageSize, searchValue, i18n, isReload]);

  const normalizeDate = (dateString: string | Date | null) => {
    return dayjs(dateString, ['YYYY/MM/DD', 'DD/MM/YYYY', 'MM/DD/YYYY']).format('YYYY-MM-DD');
  };

  async function confirmDateChange(data: NewCampaign) {
    const newStart = normalizeDate(data.startDate);
    const newEnd = normalizeDate(data.endDate);
    const originalStart = record ? normalizeDate(record.start_date) : null;
    const originalEnd = record ? normalizeDate(record.end_date) : null;

    if (newStart !== originalStart || newEnd !== originalEnd) {
      setOpen(true);
      setRecordDelete(record);
      return false; // Trả về false để ngăn không cho tiếp tục hành động
    }
    return true; // Không có thay đổi ngày, tiếp tục hành động
  }

  async function handleAction(data: NewCampaign) {
    const action = record ? 'edit' : 'add';

    // Kiểm tra xác nhận thay đổi ngày cho hành động edit
    if (action === 'edit' && !(await confirmDateChange(data))) {
      return; // Dừng hành động nếu cần xác nhận và chưa được xác nhận
    }

    executeCampaignAction(data, action);
  }

  async function executeCampaignAction(data: NewCampaign, action: 'add' | 'edit') {
    const result = await handleActionCampaign(
      { id: data.id, type: action },
      { ...data, startDate: normalizeDate(data.startDate), endDate: normalizeDate(data.endDate) }
    );

    if (result && result.code !== -1) {
      handleAdd();
    }
    formik.setSubmitting(false);
  }

  async function handleDelete(status: boolean) {
    if (status && recordDelete) {
      if (record && record === recordDelete) {
        // setIsChange(true);
        executeCampaignAction(formik.values, 'edit');
      } else {
        await handleActionCampaign({ id: recordDelete.id, type: 'delete' });
      }
    }
  }

  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleRowClick = (row: CampaignData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const columns = useMemo(() => {
    return columnsCampaign(pageIndex, pageSize, handleAdd, handleClose, setRecord, setRecordDelete, true);
    //eslint-disable-next-line
  }, [setRecord, pageIndex, pageSize]);

  const initialValues = useMemo(
    () => getInitialValues(record),
    //eslint-disable-next-line
    [record]
  );

  const formik = useFormik({
    initialValues,
    validationSchema: CampaignSchema,
    onSubmit: handleAction,
    enableReinitialize: true
  });

  const productDeleteTitle = useMemo(() => {
    if (deleteIndex === -1 || !formik.values.data[deleteIndex]) {
      return 'Unknown Product';
    }
    const productId = formik.values.data[deleteIndex].productId;
    const product = optionProduct.find((p) => p.value === productId);
    return product ? product.label : 'Unknown Product';
  }, [deleteIndex, formik.values.data, optionProduct]);

  const { values, errors, touched } = formik;

  return (
    <MainCard content={false}>
      <ScrollX>
        <GeneralizedTable
          isLoading={isLoading}
          columns={columns}
          data={data}
          handleAdd={handleAdd}
          csvFilename="campaign-list.csv"
          addButtonLabel={<FormattedMessage id="add-campaign" />}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          sortColumns="index"
          onRowClick={handleRowClick}
          searchFilter={setSearchValue}
        />
      </ScrollX>

      <Dialog
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        fullWidth
        onClose={handleAdd}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      >
        <GenericForm
          onCancel={handleAdd}
          title={record ? intl.formatMessage({ id: 'edit-campaign' }) : intl.formatMessage({ id: 'new-campaign' })}
          isEditMode={!!record}
          fields={campaignFields}
          formik={formik}
          open={add}
          children={
            <Grid item xs={12}>
              <FieldArray
                name="data"
                render={({ remove, push }) => (
                  <>
                    <TableContainer>
                      <Table sx={{ minWidth: 550, border: 'none' }}>
                        <TableHead sx={{ bgcolor: 'transparent', border: 'transparent' }}>
                          <TableRow>
                            <TableCell sx={{ padding: '0 !important' }}>
                              <FormattedMessage id="name-product" />
                            </TableCell>
                            <TableCell>
                              <FormattedMessage id="quantity" />
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody sx={{ bgcolor: 'transparent', border: 'transparent' }}>
                          {values.data?.map((item: any, index: number) => (
                            <TableRow key={index} sx={{ border: 'none', padding: 0 }}>
                              <TableCell sx={{ padding: '0 !important' }}>
                                <SelectField
                                  readOnly={record ? true : false}
                                  name="productId"
                                  placeholder={intl.formatMessage({ id: 'select-product' })}
                                  arrayOption={optionProduct}
                                  field={`data[${index}].productId`}
                                  formik={formik}
                                />
                              </TableCell>
                              <TableCell>
                                <InputField
                                  readOnly={record ? true : false}
                                  name="quantity"
                                  field={`data[${index}].quantity`}
                                  formik={formik}
                                  type="number"
                                  placeholder={intl.formatMessage({ id: 'enter-quantity' })}
                                />
                              </TableCell>
                              <TableCell>
                                {record ? (
                                  ''
                                ) : (
                                  <Tooltip title={intl.formatMessage({ id: 'remove-product' })}>
                                    <Box display="flex" justifyContent="flex-end">
                                      <Button
                                        color="error"
                                        onClick={() => {
                                          setOpen(true);
                                          setDeleteIndex(index);
                                        }}
                                      >
                                        <Trash />
                                      </Button>
                                    </Box>
                                  </Tooltip>
                                )}
                              </TableCell>
                              <AlertProductDelete
                                title={productDeleteTitle}
                                open={open}
                                handleClose={(status: boolean) => {
                                  setOpen(false);
                                  if (status) {
                                    remove(index);
                                    dispatch(
                                      openSnackbar({
                                        open: true,
                                        message: intl.formatMessage({ id: 'product-deleted-successfully' }),
                                        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                                        variant: 'alert',
                                        alert: { color: 'success' },
                                        close: false
                                      })
                                    );
                                  }
                                }}
                              />
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {touched.data && errors.data && !Array.isArray(errors?.data) && (
                      <Stack direction="row" justifyContent="center" sx={{ p: 1.5 }}>
                        <FormHelperText error={true}>{errors.data as string}</FormHelperText>
                      </Stack>
                    )}
                    {record ? (
                      ''
                    ) : (
                      <Grid container>
                        <Grid item xs={12}>
                          <Box sx={{ pt: 2.5, pr: 2.5, pb: 2.5, pl: 0 }}>
                            <Button
                              color="primary"
                              startIcon={<Add />}
                              onClick={() =>
                                push({
                                  productId: 0,
                                  quantity: 0
                                })
                              }
                              variant="dashed"
                              sx={{ bgcolor: 'transparent !important' }}
                            >
                              <FormattedMessage id="add-product" />
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    )}
                  </>
                )}
              />
            </Grid>
          }
        />
      </Dialog>
      {recordDelete && (
        <AlertCustomerDelete
          alertDelete={record && record === recordDelete ? 'alert-change-date' : 'alert-delete-campaign'}
          nameRecord={recordDelete.name}
          open={open}
          handleClose={() => setOpen(false)}
          handleDelete={handleDelete}
        />
      )}
      <ViewDialog title="campaign-info" config={campaignViewConfig} open={openDialog} onClose={handleCloseView} data={record} />
    </MainCard>
  );
};

export default CampaignManagement;

const getInitialValues = (record: CampaignData | null) => {
  return {
    id: record ? record.id : '',
    name: record ? record.name : '',
    budget: record ? record.budget : 0,
    startDate: record?.start_date || null,
    endDate: record?.end_date || null,
    description: record ? record.description : '',
    data: record ? record.data : [{ productId: 0, quantity: 0 }]
  };
};
