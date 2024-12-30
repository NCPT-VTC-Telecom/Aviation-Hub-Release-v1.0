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
import AddGateway from './AddGateway';
import AlertCustomerDelete from '../../../users/AlertCustomerDelete';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { columnsGateway } from 'components/ul-config/table-config/payment';

//model
import { getGateway, postAddGateway, postDeleteGateway, postEditGateway } from './model';

//types
import { GatewayData, NewGateway } from 'types/order';
//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { importExcel, exportExcel, getFormatExcel } from 'store/reducers/excel';
import ViewDialog from 'components/template/ViewDialog';
import { gatewayViewConfig } from 'components/ul-config/view-dialog-config';

const ListGatewayPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);

  const [record, setRecord] = useState<GatewayData | null>(null);
  const [recordDelete, setRecordDelete] = useState<GatewayData | null>(null);
  const [data, setData] = useState<GatewayData[]>([]);
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
      const res = await getGateway(pageIndex, pageSize, searchValue);
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

  async function handleAddRecord(newRecord: NewGateway) {
    try {
      const res = await postAddGateway(newRecord);
      setIsReload(true);
      return res;
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  }

  async function handleDelete(status: boolean) {
    if (status && recordDelete) {
      try {
        const res = await postDeleteGateway(recordDelete.id);
        if (res && res.code === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: intl.formatMessage({ id: 'delete-gateway-successfully' }),
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

  async function handleEdit(editedRecord: NewGateway) {
    try {
      const res = await postEditGateway(editedRecord.id, editedRecord);
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

  const handleRowClick = (row: GatewayData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const columns = useMemo(() => {
    return columnsGateway(pageIndex, pageSize, handleAdd, handleClose, setRecord, setRecordDelete, true);
    //eslint-disable-next-line
  }, [setRecord, pageIndex, pageSize]);

  const handleImport = (data: NewGateway[]) => {
    dispatch(importExcel({ type: 'gateway', data }));
  };

  const handleExport = () => {
    dispatch(exportExcel({ type: 'gateway' }));
  };

  const handleGetFormat = () => {
    dispatch(getFormatExcel({ type: 'gateway' }));
  };

  return (
    <MainCard content={false}>
      <ScrollX>
        <GeneralizedTable
          isLoading={isLoading}
          isReload={isReload}
          columns={columns}
          data={data}
          handleAdd={handleAdd}
          csvFilename="gateway-list.csv"
          addButtonLabel={<FormattedMessage id="add-gateway" />}
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
        <AddGateway open={add} record={record} onCancel={handleAdd} handleAdd={handleAddRecord} handleEdit={handleEdit} />
        {recordDelete && (
          <AlertCustomerDelete
            alertDelete="alert-delete-gateway"
            nameRecord={recordDelete.title}
            open={open}
            handleClose={handleClose}
            handleDelete={handleDelete}
          />
        )}
      </Dialog>
      <ViewDialog title="gateway-info" config={gatewayViewConfig} open={openDialog} onClose={handleCloseView} data={record} />
    </MainCard>
  );
};

export default ListGatewayPage;
