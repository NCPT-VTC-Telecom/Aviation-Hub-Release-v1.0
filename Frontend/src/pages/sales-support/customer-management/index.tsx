import { useEffect, useState, useMemo } from 'react';
import useMapStatus from 'utils/mapStatus';
import useConfig from 'hooks/useConfig';

//third-party
import { enqueueSnackbar } from 'notistack';

// material-ui
import { Dialog } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { PopupTransition } from 'components/@extended/Transitions';
import AddUser from './AddUser';
// import AddUserByStep from 'pages/apps/common-components/form/wizard/basic-wizard';
import AlertCustomerDelete from '../../apps/users/AlertCustomerDelete';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { columnsEndUser } from 'components/ul-config/table-config/user';

//model & utils
import { getEndUser, postAddUser, postDeleteUser, postEditEndUser } from './model';
import { useLangUpdate } from 'utils/handleData';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { importExcel, exportExcel, getFormatExcel } from 'store/reducers/excel';

//types
import { EndUserData, NewUser, EditUser } from 'types/end-user';
import { useNavigate } from 'react-router';
import ViewDialog from 'components/template/ViewDialog';
import { userViewConfig } from 'components/ul-config/view-dialog-config';

const CustomerManagement = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');

  const [record, setRecord] = useState<EndUserData | null>(null);
  const [recordDelete, setRecordDelete] = useState<EndUserData | null>(null);
  const [data, setData] = useState<EndUserData[]>([]);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const intl = useIntl();
  const { i18n } = useConfig();
  const navigate = useNavigate();
  const { getStatusMessage } = useMapStatus();
  useLangUpdate(i18n);

  const getData = async (pageIndex: number, pageSize: number, searchValue?: string) => {
    try {
      const res = await getEndUser(pageIndex, pageSize, searchValue);
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
  }, [pageIndex, pageSize, i18n, searchValue]);

  useEffect(() => {
    if (isReload) {
      getData(pageIndex, pageSize);
      setIsReload(false);
    }
    //eslint-disable-next-line
  }, [isReload]);

  async function handleAddRecord(newRecord: NewUser) {
    try {
      const res = await postAddUser(newRecord);
      setIsReload(true);
      return res;
    } catch (err) {
      return -1;
    }
  }

  async function handleDelete(status: boolean) {
    if (status && recordDelete) {
      try {
        const res = await postDeleteUser(recordDelete.id);

        if (res && res.code === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: intl.formatMessage({ id: 'delete-user-successfully' }),
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
        enqueueSnackbar(intl.formatMessage({ id: 'delete-fail' }), {
          variant: 'error'
        });
      }
    }
  }

  const handleEdit = async (editedRecord: EditUser) => {
    try {
      const res = await postEditEndUser(editedRecord.id, editedRecord);
      setIsReload(true);
      return res;
    } catch (err) {
      return -1;
    }
  };

  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const onViewClick = (row: EndUserData) => {
    navigate(`/account/basic/${row.id}`);
  };

  const handleRowClick = (row: EndUserData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const columns = useMemo(() => {
    return columnsEndUser(pageIndex, pageSize, handleAdd, handleClose, setRecord, setRecordDelete, onViewClick);
    //eslint-disable-next-line
  }, [setRecord, pageIndex, pageSize]);

  const handleImport = (data: NewUser[]) => {
    dispatch(importExcel({ type: 'user', groupId: [2], data }));
  };

  const handleExport = () => {
    dispatch(exportExcel({ type: 'user', groupId: [2] }));
  };

  const handleGetFormat = () => {
    dispatch(getFormatExcel({ type: 'user', groupId: [2] }));
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
          csvFilename="end-user-list.csv"
          addButtonLabel={<FormattedMessage id="add-end-user" />}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          sortColumns="index"
          onRowClick={handleRowClick}
          handleExportExcel={handleExport}
          handleExportFormat={handleGetFormat}
          searchFilter={setSearchValue}
          getDataExcel={handleImport}
          dataHandlerExcel={(jsonData: NewUser[]) => {
            return jsonData.slice(1).map((row: any) => ({
              fullname: row[1], // Tên người dùng
              username: row[2], // Tên tài khoản
              phoneNumber: row[3], // Số điện thoại
              gender: row[4], // Giới tính
              district: row[5], // Quận / Huyện
              city: row[6], // Thành phố / Tỉnh
              country: row[7], // Quốc gia
              userGroupId: [2] // Static field as per your original code
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
        {/* <AddUserByStep
          open={add}
          handleAdd={handleAddRecord}
          endUser={record}
          onCancel={handleAdd}
          handleEdit={handleEdit}
          roleOptions={roleOptions}
        /> */}
        <AddUser open={add} handleAdd={handleAddRecord} endUser={record} onCancel={handleAdd} handleEdit={handleEdit} />
        {recordDelete && (
          <AlertCustomerDelete
            alertDelete="alert-delete-user"
            nameRecord={recordDelete.username}
            open={open}
            handleClose={handleClose}
            handleDelete={handleDelete}
          />
        )}
        <ViewDialog title="user-info" config={userViewConfig} open={openDialog} onClose={handleCloseView} data={record} />
      </Dialog>
    </MainCard>
  );
};

export default CustomerManagement;
