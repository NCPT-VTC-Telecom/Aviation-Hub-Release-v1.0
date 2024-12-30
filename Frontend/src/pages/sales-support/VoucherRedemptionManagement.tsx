import { useCallback, useEffect, useState, useMemo } from 'react';
import useConfig from 'hooks/useConfig';
import { FormattedMessage, useIntl } from 'react-intl';

// material-ui
import { Dialog } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import AlertCustomerDelete from 'pages/apps/users/AlertCustomerDelete';
import GenericForm from 'components/organisms/GenericForm';
import { PopupTransition } from 'components/@extended/Transitions';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import ViewDialog from 'components/template/ViewDialog';

//config
import { columnsVoucherRedeemed } from 'components/ul-config/table-config/promotion';
import { voucherRedeemViewFields } from 'components/ul-config/view-dialog-config';
import { voucherFields } from 'components/ul-config/form-config';

//hooks
import useValidationSchemas from 'utils/validateSchema';
import useHandleProduct from 'hooks/useHandleProduct';
import useHandleVoucher from 'hooks/useHandleVouchers';

//third-party
import { useFormik } from 'formik';

//model & utils
import { useLangUpdate, getOption } from 'utils/handleData';

//types
import { VoucherRedeemedData, NewVoucherRedeemed } from 'types/vouchers';
import { OptionList } from 'types';

const ListVouchersRedemptionPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [record, setRecord] = useState<VoucherRedeemedData | null>(null);
  const [recordDelete, setRecordDelete] = useState<VoucherRedeemedData | null>(null);
  const [data, setData] = useState<VoucherRedeemedData[]>([]);
  const [productOption, setProductOption] = useState<OptionList[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const intl = useIntl();
  const { i18n } = useConfig();
  const { VoucherRedemptionSchema } = useValidationSchemas();
  useLangUpdate(i18n);

  const { fetchDataVoucher, isLoading, isReload, handleActionVoucher, totalPages } = useHandleVoucher();
  const { fetchDataProduct } = useHandleProduct();

  const getData = useCallback(async (pageIndex: number, pageSize: number, searchValue?: string) => {
    const dataVoucher = await fetchDataVoucher({ page: pageIndex, pageSize, filters: searchValue });
    setData(dataVoucher);
    //eslint-disable-next-line
  }, []);

  const getDataOption = useCallback(async () => {
    const dataProduct = await fetchDataProduct({ type: 'product' });
    setProductOption(getOption(dataProduct, 'title', 'id'));
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

  async function handleAction(data: NewVoucherRedeemed) {
    const action = record ? 'edit' : 'add';
    const res = await handleActionVoucher({ id: data.id, action }, data);
    if (res && res.code === -1) {
      if (res.message === 'Voucher này đã tồn tại') {
        formik.setFieldError('code', intl.formatMessage({ id: 'duplicate-voucher-redemption' }));
      }
    } else {
      handleAdd();
    }
    formik.setSubmitting(false);
  }

  async function handleDelete(status: boolean) {
    if (status && recordDelete) {
      await handleActionVoucher({ id: recordDelete.id, action: 'delete' });
    }
  }

  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleRowClick = (row: VoucherRedeemedData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const columns = useMemo(() => {
    return columnsVoucherRedeemed(pageIndex, pageSize, handleAdd, handleClose, setRecord, setRecordDelete, true);
    //eslint-disable-next-line
  }, [setRecord, pageIndex, pageSize]);

  const fieldsWithOptions = voucherFields.map((field) => {
    if (field.name === 'productId') {
      return { ...field, options: productOption };
    }
    // if (field.name === 'campaignId') {
    //   return { ...field, options: campaignOption };
    // }

    return field;
  });

  const initialValues = useMemo(() => getInitialValues(record), [record]);

  const formik = useFormik({
    initialValues,
    validationSchema: VoucherRedemptionSchema,
    onSubmit: handleAction,
    enableReinitialize: true
  });

  return (
    <MainCard content={false}>
      <ScrollX>
        <GeneralizedTable
          isLoading={isLoading}
          columns={columns}
          data={data}
          handleAdd={handleAdd}
          csvFilename="vouchers-redeem-list.csv"
          addButtonLabel={<FormattedMessage id="add-voucher-redeem" />}
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
          isEditMode={!!record}
          title={record ? intl.formatMessage({ id: 'edit-voucher-redemption' }) : intl.formatMessage({ id: 'add-voucher-redemption' })}
          fields={fieldsWithOptions}
          formik={formik}
          open={add}
        />
      </Dialog>
      {recordDelete && (
        <AlertCustomerDelete
          alertDelete="alert-delete-voucher-redeem"
          nameRecord={recordDelete.voucher_code}
          open={open}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />
      )}
      <ViewDialog title="voucher-redeem-info" config={voucherRedeemViewFields} open={openDialog} onClose={handleCloseView} data={record} />
    </MainCard>
  );
};

export default ListVouchersRedemptionPage;

const getInitialValues = (record: VoucherRedeemedData | null) => {
  return {
    id: record?.id || '',
    productId: record?.product_id || 0,
    fromDate: record?.from_date || null,
    endDate: record?.end_date || null
  };
};
