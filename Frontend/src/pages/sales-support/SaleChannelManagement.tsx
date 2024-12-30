import { useEffect, useState, useMemo } from 'react';
import useConfig from 'hooks/useConfig';
import { useLangUpdate } from 'utils/handleData';
import { FormattedMessage, useIntl } from 'react-intl';

// project-imports
import { Dialog } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { PopupTransition } from 'components/@extended/Transitions';
import AlertCustomerDelete from 'pages/apps/users/AlertCustomerDelete';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { columnsSaleChannel } from 'components/ul-config/table-config/payment';
import ViewDialog from 'components/template/ViewDialog';
import GenericForm from 'components/organisms/GenericForm';
import { gatewayViewConfig } from 'components/ul-config/view-dialog-config';

//third-party
import { useFormik } from 'formik';

//config
import { saleChannelFields } from 'components/ul-config/form-config';

//types
import { GatewayData, NewGateway } from 'types';

//redux
import { dispatch } from 'store';
import { importExcel, exportExcel, getFormatExcel } from 'store/reducers/excel';

//hook
import useHandleSaleChannel from 'hooks/useHandleSaleChannel';
import useValidationSchemas from 'utils/validateSchema';

interface SaleChannelData extends GatewayData {}
interface NewSaleChannel extends NewGateway {}

const SaleChannelManagement = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [record, setRecord] = useState<SaleChannelData | null>(null);
  const [recordDelete, setRecordDelete] = useState<SaleChannelData | null>(null);
  const [data, setData] = useState<SaleChannelData[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const intl = useIntl();
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  const { isLoading, isReload, fetchDataSaleChannel, totalPages, handleActionSaleChannel } = useHandleSaleChannel();
  const { SaleChannelSchema } = useValidationSchemas();

  const getDataSaleChannel = async () => {
    const dateSaleChannel = await fetchDataSaleChannel({ page: pageIndex, pageSize, filters: searchValue });
    setData(dateSaleChannel);
  };

  const handlePageChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex + 1);
    setPageSize(newPageSize);
  };

  useEffect(() => {
    getDataSaleChannel();
    //eslint-disable-next-line
  }, [pageIndex, pageSize, searchValue, i18n, isReload]);

  async function handleAction(data: NewSaleChannel) {
    const action = record ? 'edit' : 'add';
    const res = await handleActionSaleChannel({ id: data.id, action }, data);
    if (res && res.code === -1) {
      if (res.message === 'Kênh bán hàng này đã tồn tại') {
        formik.setFieldError('code', intl.formatMessage({ id: 'duplicate-sale-channel' }));
      }
    } else {
      handleAdd();
    }
    formik.setSubmitting(false);
  }

  async function handleDelete(status: boolean) {
    if (status && recordDelete) {
      await handleActionSaleChannel({ id: recordDelete.id, action: 'delete' });
    }
  }

  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleRowClick = (row: GatewayData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const columns = useMemo(() => {
    return columnsSaleChannel(pageIndex, pageSize, handleAdd, handleClose, setRecord, setRecordDelete, true);
    //eslint-disable-next-line
  }, [setRecord, pageIndex, pageSize]);

  const handleImport = (data: NewGateway[]) => {
    dispatch(importExcel({ type: 'sale_channels', data }));
  };

  const handleExport = () => {
    dispatch(exportExcel({ type: 'sale_channels' }));
  };

  const handleGetFormat = () => {
    dispatch(getFormatExcel({ type: 'sale_channels' }));
  };

  const initialValues = useMemo(() => getInitialValues(record), [record]);

  var formik = useFormik({
    initialValues,
    validationSchema: SaleChannelSchema,
    onSubmit: handleAction,
    enableReinitialize: true
  });

  const fieldsWithReadOnly = saleChannelFields.map((field) => {
    if (field.name === 'code') {
      return { ...field, readOnly: record ? true : false };
    }
    return field;
  });

  return (
    <MainCard content={false}>
      <ScrollX>
        <GeneralizedTable
          isLoading={isLoading}
          isReload={isReload}
          columns={columns}
          data={data}
          handleAdd={handleAdd}
          csvFilename="sale-channel-list.csv"
          addButtonLabel={<FormattedMessage id="add-sale-channel" />}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          sortColumns="index"
          onRowClick={handleRowClick}
          handleExportExcel={handleExport}
          handleExportFormat={handleGetFormat}
          getDataExcel={handleImport}
          searchFilter={setSearchValue}
          dataHandlerExcel={(jsonData: NewGateway[]) => {
            return jsonData.slice(1).map((row: any) => ({
              code: row[1], // Code
              title: row[2], // Tên phương thức thanh toán (Payment Method Name)
              value: row[3], // Tham số dịch vụ (Service Parameters)
              description: row[4]
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
          onCancel={handleAdd}
          fields={fieldsWithReadOnly}
          formik={formik}
          title={record ? intl.formatMessage({ id: 'edit-sale-channel' }) : intl.formatMessage({ id: 'add-sale-channel' })}
          open={add}
        />
        {recordDelete && (
          <AlertCustomerDelete
            alertDelete="alert-delete-sale-channel"
            nameRecord={recordDelete.title}
            open={open}
            handleClose={handleClose}
            handleDelete={handleDelete}
          />
        )}
      </Dialog>
      <ViewDialog title="sale-channel-info" config={gatewayViewConfig} open={openDialog} onClose={handleCloseView} data={record} />
    </MainCard>
  );
};

export default SaleChannelManagement;

const getInitialValues = (record: SaleChannelData | null) => {
  return {
    id: record?.id || 0,
    code: record?.code || '',
    description: record?.description || '',
    title: record?.title || '',
    value: record?.value || ''
  };
};
