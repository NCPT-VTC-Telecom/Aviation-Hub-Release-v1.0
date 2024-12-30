import { useEffect, useState, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useConfig from 'hooks/useConfig';
import useMapStatus from 'utils/mapStatus';

// third-party
import { enqueueSnackbar } from 'notistack';

// project-imports
import { Dialog } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { PopupTransition } from 'components/@extended/Transitions';
import AddPlan from './AddPackagesWifi';
import AlertCustomerDelete from '../../apps/users/AlertCustomerDelete';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { columnsProduct } from 'components/ul-config/table-config/packages';

//model & utils
import { getAllPlans, postAddProduct, postDeleteProduct, postEditProduct } from './model';
import { formatDate, useLangUpdate } from 'utils/handleData';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { importExcel, exportExcel, getFormatExcel } from 'store/reducers/excel';

//types
import { ProductData, NewProduct } from 'types/product';
import { useNavigate } from 'react-router';
import ViewDialog from 'components/template/ViewDialog';
import { packageWifiViewConfig } from 'components/ul-config/view-dialog-config';

const ListPlanPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);

  const [record, setRecord] = useState<ProductData | null>(null);
  const [recordDelete, setRecordDelete] = useState<ProductData | null>(null);
  const [data, setData] = useState<ProductData[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { getStatusMessage } = useMapStatus();
  const { i18n } = useConfig();
  const intl = useIntl();
  const navigate = useNavigate();
  useLangUpdate(i18n);

  const getData = async (pageIndex: number, pageSize: number, searchValue?: string) => {
    try {
      const res = await getAllPlans(pageIndex, pageSize, searchValue);
      if (res.code === 0) {
        setTotalPages(res.totalPages);
        const formattedData = formatDate(res.data, ['price.start_date', 'price.end_date']);
        setData(formattedData);
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
  }, [i18n, pageIndex, pageSize, searchValue]);

  useEffect(() => {
    if (isReload) {
      getData(pageIndex, pageSize, searchValue);
      setIsReload(false);
      setSearchValue('');
    }
    //eslint-disable-next-line
  }, [isReload]);

  async function handleAddRecord(newRecord: NewProduct) {
    try {
      const res = await postAddProduct(newRecord);
      setIsReload(true);
      return res;
    } catch (err) {}
  }

  async function handleDelete(status: boolean) {
    if (status && recordDelete) {
      try {
        const res = await postDeleteProduct(recordDelete.id);
        if (res && res.code === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: intl.formatMessage({ id: 'delete-plan-successfully' }),
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

  async function handleEdit(editedRecord: NewProduct) {
    try {
      const res = await postEditProduct(editedRecord.id, editedRecord);
      setIsReload(true);
      return res;
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  }

  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const onViewClick = (row: ProductData) => {
    navigate(`/package/profile/${row.id}-${row.type}`);
  };

  const handleRowClick = (row: ProductData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const columns = useMemo(() => {
    return columnsProduct(pageIndex, pageSize, handleAdd, handleClose, setRecord, setRecordDelete, onViewClick);
    //eslint-disable-next-line
  }, [setRecord, pageIndex, pageSize]);

  const handleImport = (data: NewProduct[]) => {
    dispatch(importExcel({ type: 'product', typeProduct: 'product', data }));
  };

  const handleExport = () => {
    dispatch(exportExcel({ type: 'product', typeProduct: 'product' }));
  };

  const handleGetFormat = () => {
    dispatch(getFormatExcel({ type: 'product', typeProduct: 'product' }));
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
          csvFilename="plan-list.csv"
          addButtonLabel={<FormattedMessage id="add-plan" />}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
          sortColumns="index"
          handleExportExcel={handleExport}
          handleExportFormat={handleGetFormat}
          getDataExcel={handleImport}
          searchFilter={setSearchValue}
          dataHandlerExcel={(jsonData: NewProduct[]) => {
            return jsonData.slice(1).map((row: any) => ({
              title: row[1], // Tên gói cước
              type: row[2], // Loại
              totalTime: row[3], // Tổng thời gian truy cập
              bandwidthDownload: row[4], // Băng thông tải xuống
              bandwidthUpload: row[5], // Băng thông tải lên
              dataTotal: row[6], // Tổng dung lượng truy cập
              description: row[7], // Mô tả
              dataPrice: {
                originalPrice: row[8], // Giá
                currency: 'VND'
              }
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
        <AddPlan open={add} plan={record} onCancel={handleAdd} handleAdd={handleAddRecord} handleEdit={handleEdit} />
        {/* <FormWizard title="add-product" /> */}
        {recordDelete && (
          <AlertCustomerDelete
            alertDelete="alert-delete-plan"
            nameRecord={recordDelete.title}
            open={open}
            handleClose={handleClose}
            handleDelete={handleDelete}
          />
        )}
        <ViewDialog title="plan-info" config={packageWifiViewConfig} open={openDialog} onClose={handleCloseView} data={record} />
      </Dialog>
    </MainCard>
  );
};

export default ListPlanPage;
