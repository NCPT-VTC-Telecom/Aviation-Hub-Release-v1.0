import { useEffect, useState, useMemo } from 'react';
import useMapStatus from 'utils/mapStatus';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router';

//project component
import MainCard from 'components/MainCard';
import { Dialog } from '@mui/material';
import ScrollX from 'components/ScrollX';
import AlertCustomerDelete from '../../../users/AlertCustomerDelete';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import AddSupplier from './AddDeviceProvider';
import { PopupTransition } from 'components/@extended/Transitions';

//column table
import { columnsDevicesProvider } from 'components/ul-config/table-config/suppliers';

//types
import { NewProvider, ProviderData } from 'types/provider';

//model
import { getAllSuppliers, postAddSupplier, postEditSupplier, postDeleteSupplier } from './model';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { enqueueSnackbar } from 'notistack';
import { importExcel, exportExcel, getFormatExcel } from 'store/reducers/excel';
import ViewDialog from 'components/template/ViewDialog';
import { providerViewConfig } from 'components/ul-config/view-dialog-config';

const ListDeviceProvider = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);

  const [recordDelete, setRecordDelete] = useState<ProviderData | null>(null);
  const [record, setRecord] = useState<ProviderData | null>(null);
  const [data, setData] = useState<ProviderData[] | []>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const intl = useIntl();
  const navigate = useNavigate();
  const { getStatusMessage } = useMapStatus();

  const getData = async (pageIndex: number, pageSize: number, searchValue?: string) => {
    try {
      const res = await getAllSuppliers(pageIndex, pageSize, searchValue);
      if (res && res.code === 0) {
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
  }, [pageIndex, pageSize, searchValue]);

  useEffect(() => {
    if (isReload) {
      getData(pageIndex, pageSize, searchValue);
      setIsReload(false);
    }
    //eslint-disable-next-line
  }, [isReload]);

  async function handleAddRecord(newRecord: NewProvider) {
    try {
      const res = await postAddSupplier(newRecord);
      setIsReload(true);
      return res;
    } catch (err) {
      return -1;
    }
  }

  async function handleDelete(status: boolean) {
    if (status && recordDelete) {
      try {
        const res = await postDeleteSupplier(recordDelete.id);
        if (res && res.code === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: intl.formatMessage({ id: 'delete-supplier-successfully' }),
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

  async function handleEdit(editedRecord: NewProvider) {
    try {
      const res = await postEditSupplier(editedRecord.id, editedRecord);
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

  const handleRowClick = (row: ProviderData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const handleImport = (data: NewProvider[]) => {
    dispatch(importExcel({ type: 'supplier', typeSupplier: 'device', data }));
  };

  const handleExport = () => {
    dispatch(exportExcel({ type: 'supplier', typeSupplier: 'device' }));
  };

  const handleGetFormat = () => {
    dispatch(getFormatExcel({ type: 'supplier', typeSupplier: 'device' }));
  };

  const onViewClick = (row: ProviderData) => {
    navigate(`/provider/profile/${row.name}`);
  };

  const columns = useMemo(() => {
    return columnsDevicesProvider(pageIndex, pageSize, handleAdd, handleClose, setRecord, setRecordDelete, onViewClick);
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
          csvFilename="device-provider-list.csv"
          addButtonLabel={<FormattedMessage id="add-supplier" />}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          sortColumns="index"
          onRowClick={handleRowClick}
          handleExportExcel={handleExport}
          handleExportFormat={handleGetFormat}
          getDataExcel={handleImport}
          searchFilter={setSearchValue}
          dataHandlerExcel={(jsonData: NewProvider[]) => {
            return jsonData.slice(1).map((row: any) => ({
              name: row[1], // Tên nhà cung cấp
              address: row[2], // Địa chỉ
              contact: row[3], // Thông tin
              description: row[4], // Mô tả
              type: 'device'
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
        <AddSupplier open={add} record={record} onCancel={handleAdd} handleAdd={handleAddRecord} handleEdit={handleEdit} />
      </Dialog>
      {recordDelete && (
        <AlertCustomerDelete
          alertDelete="alert-delete-supplier"
          nameRecord={recordDelete.name}
          open={open}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />
      )}
      <ViewDialog title="provider-info" config={providerViewConfig} open={openDialog} onClose={handleCloseView} data={record} />
    </MainCard>
  );
};

export default ListDeviceProvider;
