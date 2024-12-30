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
import AddPlan from './AddPackagesTelecom';
import AlertCustomerDelete from '../../apps/users/AlertCustomerDelete';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { columnsBundle } from 'components/ul-config/table-config/packages';

//model & utils
import { getAllPlans, postAddProduct, postDeleteProduct, postEditProduct } from './model';
import { formatDate, getOption, useLangUpdate } from 'utils/handleData';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { importExcel, exportExcel, getFormatExcel } from 'store/reducers/excel';

//types
import { BundleData, NewBundle } from 'types/product';
import { useNavigate } from 'react-router';
import { OptionList } from 'types';
import ViewDialog from 'components/template/ViewDialog';
import { bundleTelecomViewConfig } from 'components/ul-config/view-dialog-config';

const BundleTelecomList = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);

  const [record, setRecord] = useState<BundleData | null>(null);
  const [recordDelete, setRecordDelete] = useState<BundleData | null>(null);
  const [data, setData] = useState<BundleData[]>([]);
  const [dataProduct, setDataProduct] = useState<OptionList[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const intl = useIntl();
  const navigate = useNavigate();
  const { getStatusMessage } = useMapStatus();
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  const getData = async (pageIndex: number, pageSize: number, searchValue?: string) => {
    try {
      const res = await getAllPlans(pageIndex, pageSize, 'telecom', searchValue);
      const getProduct = await getAllPlans(1, 100, 'product');
      setDataProduct(getOption(getProduct.data, 'title', 'id'));
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
    }
    //eslint-disable-next-line
  }, [isReload]);

  async function handleAddRecord(newRecord: NewBundle) {
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

  async function handleEdit(editedRecord: NewBundle) {
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

  const onViewClick = (row: BundleData) => {
    navigate(`/package/profile/${row.id}`);
  };

  const handleRowClick = (row: BundleData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const columns = useMemo(() => {
    const allColumns = columnsBundle(pageIndex, pageSize, handleAdd, handleClose, setRecord, setRecordDelete, onViewClick);
    const excludeColumns = ['ticket_plan'];
    return allColumns.filter((column) => !column.accessor || !excludeColumns.includes(column.accessor));
    //eslint-disable-next-line
  }, [setRecord, pageIndex, pageSize]);

  const handleImport = (data: NewBundle[]) => {
    dispatch(importExcel({ type: 'product', typeSupplier: 'telecom', data }));
  };

  const handleExport = () => {
    dispatch(exportExcel({ type: 'product', typeSupplier: 'telecom' }));
  };

  const handleGetFormat = () => {
    dispatch(getFormatExcel({ type: 'product', typeSupplier: 'telecom' }));
  };

  return (
    <MainCard content={false}>
      <ScrollX>
        <GeneralizedTable
          onRowClick={handleRowClick}
          isLoading={isLoading}
          isReload={isReload}
          columns={columns}
          data={data}
          handleAdd={handleAdd}
          csvFilename="bundle-telecom-list.csv"
          addButtonLabel={<FormattedMessage id="add-bundle" />}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          sortColumns="index"
          handleExportExcel={handleExport}
          handleExportFormat={handleGetFormat}
          getDataExcel={handleImport}
          searchFilter={setSearchValue}
          dataHandlerExcel={(jsonData: NewBundle[]) => {
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
        <AddPlan
          open={add}
          plan={record}
          onCancel={handleAdd}
          handleAdd={handleAddRecord}
          handleEdit={handleEdit}
          optionProduct={dataProduct}
        />
        {/* <FormWizard title="add-product" /> */}
        {recordDelete && (
          <AlertCustomerDelete
            alertDelete="alert-delete-bundle"
            nameRecord={recordDelete.name}
            open={open}
            handleClose={handleClose}
            handleDelete={handleDelete}
          />
        )}
        <ViewDialog title="bundle-info" config={bundleTelecomViewConfig} open={openDialog} onClose={handleCloseView} data={record} />
      </Dialog>
    </MainCard>
  );
};

export default BundleTelecomList;
