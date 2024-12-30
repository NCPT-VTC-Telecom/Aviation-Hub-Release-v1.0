import { useEffect, useState, useMemo } from 'react';
import useConfig from 'hooks/useConfig';
import useMapStatus from 'utils/mapStatus';
import { useLangUpdate } from 'utils/handleData';
import { FormattedMessage, useIntl } from 'react-intl';

//third-party
import { enqueueSnackbar } from 'notistack';
// project-imports
import { Dialog } from '@mui/material';

import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { PopupTransition } from 'components/@extended/Transitions';
import AddPaymentMethod from './AddPaymentMethod';
import AlertCustomerDelete from 'pages/apps/users/AlertCustomerDelete';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { columnsPaymentMethod } from 'components/ul-config/table-config/payment';

//model
import { getPaymentMethod, postAddPaymentMethod, postDeletePaymentMethod, postEditPaymentMethod } from './model';

//types
import { PaymentMethodData, NewPaymentMethod } from 'types/order';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import ViewDialog from 'components/template/ViewDialog';
import { gatewayViewConfig } from 'components/ul-config/view-dialog-config';

const ListPaymentMethodPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);

  const [record, setRecord] = useState<PaymentMethodData | null>(null);
  const [recordDelete, setRecordDelete] = useState<PaymentMethodData | null>(null);
  const [data, setData] = useState<PaymentMethodData[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { getStatusMessage } = useMapStatus();
  const intl = useIntl();
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  const getData = async (pageIndex: number, pageSize: number, searchValue?: string) => {
    try {
      const res = await getPaymentMethod(pageIndex, pageSize, searchValue);
      if (res.code === 0) {
        setTotalPages(res.totalPages);
        setData(res.data);
      } else {
        setTotalPages(0);
        setData([]);
      }
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex + 1);
    setPageSize(newPageSize);
  };

  useEffect(() => {
    getData(pageIndex, pageSize, searchValue);
    //eslint-disable-next-line
  }, [pageIndex, pageSize, searchValue, i18n]);

  useEffect(() => {
    if (isReload) {
      getData(pageIndex, pageSize, searchValue);
      setIsReload(false);
    }
    //eslint-disable-next-line
  }, [isReload]);

  async function handleAddRecord(newRecord: NewPaymentMethod) {
    try {
      const res = await postAddPaymentMethod(newRecord);
      setIsReload(true);
      return res;
    } catch (err) {
      return -1;
    }
  }

  async function handleDelete(status: boolean) {
    if (status && recordDelete) {
      try {
        const res = await postDeletePaymentMethod(recordDelete.id);
        if (res && res.code === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: intl.formatMessage({ id: 'delete-payment-method-successfully' }),
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
          setIsReload(true);
        } else {
          enqueueSnackbar(getStatusMessage('general', res.code), {
            variant: 'error'
          });
        }
      } catch (err) {
        enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
          variant: 'error'
        });
      }
    }
  }

  async function handleEdit(editedRecord: NewPaymentMethod) {
    try {
      const res = await postEditPaymentMethod(editedRecord.id, editedRecord);
      setIsReload(true);
      return res;
    } catch (err) {
      return -1;
    }
  }

  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleRowClick = (row: PaymentMethodData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const getDataExcel = (data: NewPaymentMethod[]) => {};

  const columns = useMemo(() => {
    return columnsPaymentMethod(pageIndex, pageSize, handleAdd, handleClose, setRecord, setRecordDelete, true);
    //eslint-disable-next-line
  }, [setRecord, pageIndex, pageSize]);

  return (
    <MainCard content={false}>
      <ScrollX>
        <GeneralizedTable
          isLoading={isLoading}
          isReload={isReload}
          columns={columns}
          data={data}
          handleAdd={handleAdd}
          csvFilename="payment-method-list.csv"
          addButtonLabel={<FormattedMessage id="add-payment-method" />}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          sortColumns="index"
          onRowClick={handleRowClick}
          getDataExcel={getDataExcel}
          searchFilter={setSearchValue}
          dataHandlerExcel={(jsonData: NewPaymentMethod[]) => {
            return jsonData.slice(1).map((row: any) => ({
              code: row[1],
              title: row[2],
              description: row[3],
              value: row[4]
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
        <AddPaymentMethod open={add} record={record} onCancel={handleAdd} handleAdd={handleAddRecord} handleEdit={handleEdit} />
        {recordDelete && (
          <AlertCustomerDelete
            alertDelete="alert-delete-payment-method"
            nameRecord={recordDelete.title}
            open={open}
            handleClose={handleClose}
            handleDelete={handleDelete}
          />
        )}
      </Dialog>
      <ViewDialog title="payment-method-info" config={gatewayViewConfig} open={openDialog} onClose={handleCloseView} data={record} />
    </MainCard>
  );
};

export default ListPaymentMethodPage;
