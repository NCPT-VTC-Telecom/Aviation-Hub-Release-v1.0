import { useEffect, useState, useMemo } from 'react';
import useConfig from 'hooks/useConfig';
import { useLangUpdate } from 'utils/handleData';
import { FormattedMessage } from 'react-intl';

//third-party

// project-imports
import { Dialog } from '@mui/material';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { PopupTransition } from 'components/@extended/Transitions';
import AddVendor from './AddVendor';
import AlertCustomerDelete from '../../apps/users/AlertCustomerDelete';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { columnsVendor } from 'components/ul-config/table-config/user';

//types
import { VendorData } from 'types/end-user';
//redux
import useHandleVendor from 'hooks/useHandleVendor';
import ViewDialog from 'components/template/ViewDialog';
import { vendorViewConfig } from 'components/ul-config/view-dialog-config';

const VendorManagement = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [record, setRecord] = useState<VendorData | null>(null);
  const [recordDelete, setRecordDelete] = useState<VendorData | null>(null);
  const [data, setData] = useState<VendorData[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  const { getData, totalPages, isLoading, handleAction, isReload } = useHandleVendor();

  const getDataVendor = async (pageIndex: number, pageSize: number, searchValue?: string) => {
    const dataVendor = await getData({ page: pageIndex, pageSize, filters: searchValue });
    setData(dataVendor);
  };

  const handlePageChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex + 1);
    setPageSize(newPageSize);
  };

  useEffect(() => {
    getDataVendor(pageIndex, pageSize, searchValue);
    //eslint-disable-next-line
  }, [pageIndex, pageSize, searchValue, i18n, isReload]);

  async function handleDelete(status: boolean) {
    if (status && recordDelete) {
      await handleAction('delete', { id: recordDelete.user_id });
    }
  }

  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleRowClick = (row: VendorData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const columns = useMemo(() => {
    return columnsVendor(pageIndex, pageSize, handleAdd, handleClose, setRecord, setRecordDelete, true);

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
          csvFilename="vendor-list.csv"
          addButtonLabel={<FormattedMessage id="add-vendor" />}
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
        <AddVendor open={add} record={record} onClose={handleAdd} handleSubmit={handleAction} />
        {recordDelete && (
          <AlertCustomerDelete
            alertDelete="alert-delete-vendor"
            nameRecord={recordDelete.fullname}
            open={open}
            handleClose={handleClose}
            handleDelete={handleDelete}
          />
        )}
      </Dialog>
      <ViewDialog title="vendor-info" config={vendorViewConfig} open={openDialog} onClose={handleCloseView} data={record} />
    </MainCard>
  );
};

export default VendorManagement;
