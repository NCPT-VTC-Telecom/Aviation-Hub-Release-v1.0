import { useEffect, useState, useMemo } from 'react';
import useMapStatus from 'utils/mapStatus';
import useConfig from 'hooks/useConfig';
import { useIntl } from 'react-intl';

//third-party
// import { Row } from 'react-table';
import { enqueueSnackbar } from 'notistack';

//project component
import { Dialog } from '@mui/material';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import AlertCustomerDelete from '../../../users/AlertCustomerDelete';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { PopupTransition } from 'components/@extended/Transitions';
import { columnsSession } from 'components/ul-config/table-config/session';

//model & utils
import { getAllSession, postTerminateSession } from './model';
import { formatDateTime, useLangUpdate } from 'utils/handleData';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

//types
import { SessionGeneral } from 'types/end-user';
import { useNavigate } from 'react-router';
import ViewDialog from 'components/template/ViewDialog';
import { sessionViewConfig } from 'components/ul-config/view-dialog-config';

const ListSessionPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);

  const [record, setRecord] = useState<SessionGeneral | null>(null);
  const [recordDelete, setRecordDelete] = useState<SessionGeneral | null>(null);
  const [data, setData] = useState<SessionGeneral[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const intl = useIntl();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const { getStatusMessage } = useMapStatus();
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  const getData = async (pageIndex: number, pageSize: number, searchValue?: string) => {
    try {
      const res = await getAllSession(pageIndex, pageSize, searchValue);

      if (res.code === 0) {
        setTotalPages(res.totalPages);
        const formattedTime = formatDateTime(res.data, ['created_date', 'flight.departure_time', 'flight.arrival_time']);
        setData(formattedTime);
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
    if (isReload) {
      setIsReload(false);
    }
    //eslint-disable-next-line
  }, [i18n, isReload, pageIndex, pageSize, searchValue]);

  const handleDelete = async (status: boolean) => {
    if (status && recordDelete) {
      try {
        const res = await postTerminateSession(recordDelete.id);
        if (res && res.code === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: intl.formatMessage({ id: 'terminate-session-successfully' }),
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
  };

  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleClickView = (record: any) => {
    navigate(`/management-optimize-network/session-detail/${record.id}`);
  };

  const handleRowClick = (row: SessionGeneral) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const columns = useMemo(() => {
    return columnsSession(pageIndex, pageSize, handleAdd, handleClose, handleClickView, setRecordDelete);
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
          onRowClick={handleRowClick}
          // renderRowSubComponent={renderRowSubComponent}
          searchFilter={setSearchValue}
          onPageChange={handlePageChange}
          totalPages={totalPages}
          sortColumns="index"
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
        {recordDelete && (
          <AlertCustomerDelete
            alertDelete="alert-terminate-session"
            nameRecord={recordDelete.user.username}
            open={open}
            handleClose={handleClose}
            handleDelete={handleDelete}
            labelDeleteButton={intl.formatMessage({ id: 'terminate' })}
            descDelete={intl.formatMessage({ id: 'alert-terminate' })}
          />
        )}
        <ViewDialog title="session-info" config={sessionViewConfig} open={openDialog} onClose={handleCloseView} data={record} />
      </Dialog>
    </MainCard>
  );
};

export default ListSessionPage;
