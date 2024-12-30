import { useCallback, useEffect, useState, useMemo } from 'react';
import useConfig from 'hooks/useConfig';
import { FormattedMessage, useIntl } from 'react-intl';

// material-ui
import { Dialog } from '@mui/material';

// third-party
import moment from 'moment';
import { useFormik } from 'formik';
import dayjs from 'dayjs';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { PopupTransition } from 'components/@extended/Transitions';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { columnsVoucherDiscount } from 'components/ul-config/table-config/promotion';
import AlertCustomerDelete from 'pages/apps/users/AlertCustomerDelete';
import GenericForm from 'components/organisms/GenericForm';
import ViewDialog from 'components/template/ViewDialog';

//config
import { voucherDiscountViewConfig } from 'components/ul-config/view-dialog-config';
import { discountInfoFields } from 'components/ul-config/form-config';

//hooks
import useHandleDiscount from 'hooks/useHandleDiscount';
import useValidationSchemas from 'utils/validateSchema';

//model & utils
import { useLangUpdate, excelSerialDateToDate } from 'utils/handleData';

//types
import { VoucherDiscountData, NewVoucherDiscount } from 'types/vouchers';

const VoucherDiscountManagement = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [record, setRecord] = useState<VoucherDiscountData | null>(null);
  const [recordDelete, setRecordDelete] = useState<VoucherDiscountData | null>(null);
  const [data, setData] = useState<VoucherDiscountData[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const intl = useIntl();
  const { i18n } = useConfig();
  const { VoucherDiscountSchema } = useValidationSchemas();
  const { totalPages, isLoading, isReload, fetchDataDiscount, handleActionDiscount } = useHandleDiscount();

  useLangUpdate(i18n);

  const voucherTypeOptions = [
    { label: intl.formatMessage({ id: 'discount-price' }), value: 'cash' },
    { label: intl.formatMessage({ id: 'discount-percent' }), value: 'percent' }
  ];

  const getData = useCallback(async (pageIndex: number, pageSize: number, searchValue?: string) => {
    const dataVoucherDiscount = await fetchDataDiscount({ page: pageIndex, pageSize, filters: searchValue });
    setData(dataVoucherDiscount);

    //eslint-disable-next-line
  }, []);

  const handlePageChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex + 1);
    setPageSize(newPageSize);
  };

  useEffect(() => {
    getData(pageIndex, pageSize, searchValue);
    //eslint-disable-next-line
  }, [pageIndex, pageSize, searchValue, i18n, isReload]);

  async function handleAction(data: NewVoucherDiscount) {
    const action = record ? 'edit' : 'add';
    const res = await handleActionDiscount({ id: data.id, action }, data);
    if (res && res.code === -1) {
      formik.setFieldError('name', intl.formatMessage({ id: 'duplicate-voucher-discount' }));
    } else if (res.code === 0) {
      handleAdd();
    }

    formik.setSubmitting(false);
  }

  async function handleDelete(status: boolean) {
    if (status && recordDelete) {
      await handleActionDiscount({ action: 'delete', id: recordDelete.id });
    }
  }

  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleRowClick = (row: VoucherDiscountData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const initialValues = useMemo(
    () => getInitialValues(record),
    //eslint-disable-next-line
    [record]
  );

  const fieldsWithOptions = discountInfoFields.map((field) => {
    if (field.name === 'type') {
      return { ...field, options: voucherTypeOptions };
    }
    return field;
  });

  const formik = useFormik({
    initialValues,
    validationSchema: VoucherDiscountSchema,
    onSubmit: handleAction,
    enableReinitialize: true
  });

  const columns = useMemo(() => {
    return columnsVoucherDiscount(pageIndex, pageSize, handleAdd, handleClose, setRecord, setRecordDelete, true);
    //eslint-disable-next-line
  }, [setRecord, pageIndex, pageSize]);

  return (
    <MainCard content={false}>
      <ScrollX>
        <GeneralizedTable
          isLoading={isLoading}
          columns={columns}
          data={data}
          handleAdd={handleAdd}
          csvFilename="vouchers-discount-list.csv"
          addButtonLabel={<FormattedMessage id="add-voucher-discount" />}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          sortColumns="index"
          onRowClick={handleRowClick}
          searchFilter={setSearchValue}
          dataHandlerExcel={(jsonData: NewVoucherDiscount[]) => {
            return jsonData.slice(1).map((row: any) => ({
              voucherName: row[1],
              description: row[2],
              discountAmount: row[3],
              discountType: row[4],
              expirationDate: row[5] ? moment(excelSerialDateToDate(row[5])).format('YYYY/MM/DD') : null
            }));
          }}
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
          isEditMode={!!record}
          title={record ? intl.formatMessage({ id: 'edit-voucher-discount' }) : intl.formatMessage({ id: 'new-voucher-discount' })}
          onCancel={handleAdd}
          fields={fieldsWithOptions}
          formik={formik}
          open={add}
        />
      </Dialog>
      {recordDelete && (
        <AlertCustomerDelete
          alertDelete="alert-delete-voucher-discount"
          nameRecord={recordDelete.name}
          open={open}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />
      )}
      <ViewDialog
        title="voucher-discount-info"
        config={voucherDiscountViewConfig}
        open={openDialog}
        onClose={handleCloseView}
        data={record}
      />
    </MainCard>
  );
};

export default VoucherDiscountManagement;

const getInitialValues = (record: VoucherDiscountData | null) => {
  return {
    id: record ? record.id : 0,
    code: record ? record.code : '',
    minimal: record ? record.minimal : 0,
    maximal: record ? record.maximal : 0,
    name: record ? record.name : '',
    quantity: record ? record.quantity : 0,
    quantityPerUser: record ? record.quantity_per_user : 0,
    type: record ? record.type : '',
    dateFrom: record ? dayjs(record.date_from, ['DD/MM/YYYY', 'MM/DD/YYYY']).format('YYYY/MM/DD') : null,
    dateEnd: record ? dayjs(record.date_end, ['DD/MM/YYYY', 'MM/DD/YYYY']).format('YYYY/MM/DD') : null
  };
};
