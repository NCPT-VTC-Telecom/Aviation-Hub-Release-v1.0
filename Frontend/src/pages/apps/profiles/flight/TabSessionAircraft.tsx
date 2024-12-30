// material-ui
import { Grid } from '@mui/material';

//Hook
import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import useConfig from 'hooks/useConfig';
import useMapStatus from 'utils/mapStatus';
import { useIntl } from 'react-intl';

//third-party
import { enqueueSnackbar } from 'notistack';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { columnsSession } from 'components/ul-config/table-config/session';
import AlertCustomerDelete from 'pages/apps/users/AlertCustomerDelete';
import { PopupTransition } from 'components/@extended/Transitions';
import { Dialog } from '@mui/material';
import FilterBar from 'pages/apps/profiles/common-components/FilterBar';
import ViewDialog from 'components/template/ViewDialog';
import { sessionViewConfig } from 'components/ul-config/view-dialog-config';

//types
import { formatDateTime, getOption, useLangUpdate } from 'utils/handleData';

//model
import { getProduct, getSession, postTerminateSession } from './model';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { SessionGeneral } from 'types/end-user';
import { OptionList } from 'types';

interface FilterProps {
  plan: number;
}

const TabSession = () => {
  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [record, setRecord] = useState<any>();
  const [recordDelete, setRecordDelete] = useState<any>();
  const [openDialog, setOpenDialog] = useState(false);

  const [dataSession, setDataSession] = useState([{}]);
  const [productOption, setProductOption] = useState<OptionList[]>([]);
  const [filters, setFilters] = useState<FilterProps>();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);

  const intl = useIntl();
  const navigate = useNavigate();
  const { getStatusMessage } = useMapStatus();
  const { flightNumber } = useParams();
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  async function getTotalSession(pageIndex: number, pageSize: number, flightNumber: string, productId: number | undefined) {
    try {
      const res = await getSession(flightNumber, pageIndex, pageSize, productId);
      if (res.code === 0) {
        setTotalPages(res.totalPages);
        setTotalRecord(res.total);
        const formattedDate = formatDateTime(res.data, ['flight.departure_time', 'flight.arrival_time', 'created_date']);
        setDataSession(formattedDate);
      } else {
        setDataSession([]);
      }
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function getOptionProduct() {
    try {
      const res = await getProduct();
      setProductOption(getOption(res.data, 'title', 'id'));
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  }
  const handleDelete = async (status: boolean) => {
    if (status) {
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

  const handlePageChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex + 1);
    setPageSize(newPageSize);
  };

  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (flightNumber) {
      getTotalSession(pageIndex, pageSize, flightNumber, filters?.plan);
      getOptionProduct();
    }
    if (isReload) {
      setIsReload(false);
    }
    //eslint-disable-next-line
  }, [flightNumber, i18n, isReload, pageIndex, pageSize, filters?.plan]);

  const handleRowClick = (row: SessionGeneral) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const handleClickView = (record: any) => {
    navigate(`/session-management/session-detail/${record.id}`);
  };

  const columns = useMemo(() => {
    const allColumns = columnsSession(pageIndex, pageSize, handleAdd, handleClose, handleClickView, setRecordDelete);
    // Filter out the column with accessor 'user_ip_address'
    return allColumns.filter((column) => column.accessor !== 'flight.aircraft.flight_number');
    //eslint-disable-next-line
  }, [setRecord, pageIndex, pageSize]);

  const filterItems = [
    {
      name: 'plan',
      optionList: productOption
    }
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FilterBar filterItems={filterItems} totalRecord={totalRecord} getFilterValues={setFilters} />
      </Grid>
      <Grid item xs={12}>
        <MainCard content={false}>
          <ScrollX>
            <GeneralizedTable
              isLoading={isLoading}
              isReload={isReload}
              columns={columns}
              data={dataSession}
              handleAdd={handleAdd}
              onPageChange={handlePageChange}
              totalPages={totalPages}
              onRowClick={handleRowClick}
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
      </Grid>
    </Grid>
  );
};

export default TabSession;
