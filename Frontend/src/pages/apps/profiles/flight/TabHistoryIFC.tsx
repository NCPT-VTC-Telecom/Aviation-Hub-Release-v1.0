// material-ui
import { Grid } from '@mui/material';

//Hook
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import useConfig from 'hooks/useConfig';
import useMapStatus from 'utils/mapStatus';

//third-party
import { enqueueSnackbar } from 'notistack';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { columnsHistoryIFC } from 'components/ul-config/table-config/devices';
import AlertCustomerDelete from 'pages/apps/users/AlertCustomerDelete';
import { PopupTransition } from 'components/@extended/Transitions';
import { Dialog } from '@mui/material';
import FilterBar from 'pages/apps/profiles/common-components/FilterBar';
// import ViewDialog from 'components/template/ViewDialog';
// import { sessionViewConfig } from 'components/ul-config/view-dialog-config';

//types
import {
  // formatDateTime
  useLangUpdate
} from 'utils/handleData';

//model
import { postTerminateSession } from './model';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { useIntl } from 'react-intl';
import { SessionGeneral } from 'types/end-user';

const TabHistoryIFC = () => {
  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [record, setRecord] = useState<any>();
  const [recordDelete, setRecordDelete] = useState<any>();
  // const [openDialog, setOpenDialog] = useState(false);

  const dataSession = [
    {
      deviceId: 'C265F0F7-51D4-4103-B5AF-92FCC3AB940B',
      flightId: 1427,
      speed: 100.0,
      latency: 40,
      bandwidthUsage: 5200,
      packetLossRate: 0.01,
      connectionQuality: 7,
      uptime: 7200, // 2 hours of operation
      downtime: 600, // 10 minutes downtime
      unauthorizedAccessAttempts: 1,
      failedConnections: 2,
      concurrentUsers: 80
    },
    {
      deviceId: 'C265F0F7-51D4-4103-B5AF-92FCC3AB940B',
      flightId: 1427,
      speed: 110.0,
      latency: 35,
      bandwidthUsage: 5300,
      packetLossRate: 0.02,
      connectionQuality: 8,
      uptime: 14400, // 4 hours of operation
      downtime: 300, // 5 minutes downtime
      unauthorizedAccessAttempts: 2,
      failedConnections: 4,
      concurrentUsers: 100
    },
    {
      deviceId: 'C265F0F7-51D4-4103-B5AF-92FCC3AB940B',
      flightId: 1427,
      speed: 115.0,
      latency: 33,
      bandwidthUsage: 5400,
      packetLossRate: 0.03,
      connectionQuality: 9,
      uptime: 21600, // 6 hours of operation
      downtime: 200, // 3 minutes downtime
      unauthorizedAccessAttempts: 4,
      failedConnections: 3,
      concurrentUsers: 110
    },
    {
      deviceId: 'C265F0F7-51D4-4103-B5AF-92FCC3AB940B',
      flightId: 1427,
      speed: 130.0,
      latency: 30,
      bandwidthUsage: 5500,
      packetLossRate: 0.01,
      connectionQuality: 8,
      uptime: 28800, // 8 hours of operation
      downtime: 100, // 1 minute downtime
      unauthorizedAccessAttempts: 5,
      failedConnections: 6,
      concurrentUsers: 125
    },
    {
      deviceId: 'C265F0F7-51D4-4103-B5AF-92FCC3AB940B',
      flightId: 1427,
      speed: 140.0,
      latency: 25,
      bandwidthUsage: 5600,
      packetLossRate: 0.05,
      connectionQuality: 7,
      uptime: 32400, // 9 hours of operation
      downtime: 0, // No downtime
      unauthorizedAccessAttempts: 1,
      failedConnections: 1,
      concurrentUsers: 130
    },
    {
      deviceId: 'C265F0F7-51D4-4103-B5AF-92FCC3AB940B',
      flightId: 1427,
      speed: 125.0,
      latency: 28,
      bandwidthUsage: 5700,
      packetLossRate: 0.02,
      connectionQuality: 9,
      uptime: 36000, // 10 hours of operation
      downtime: 600, // 10 minutes downtime
      unauthorizedAccessAttempts: 3,
      failedConnections: 5,
      concurrentUsers: 140
    }
  ];
  const [filters, setFilters] = useState();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);

  const intl = useIntl();
  const { getStatusMessage } = useMapStatus();
  const { flightNumber } = useParams();
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  async function getTotalSession(pageIndex: number, pageSize: number, flightNumber: string, filters: any) {
    // try {
    //   const res = await getSession(flightNumber, pageIndex, pageSize);
    // if(res.code === 0){
    // setTotalPages(res.totalPages);
    //   setTotalRecord(0);
    //   // const formattedDate = formatDateTime(res.data, ['session.start_time', 'session.stop_time', 'created_date']);
    //   setDataSession(formattedDate);
    // } else {
    // setDataSession([])
    // }
    // } catch (err) {
    //   enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
    //     variant: 'error'
    //   });
    // }
  }

  const handleDelete = async (status: boolean) => {
    if (status) {
      try {
        const res = await postTerminateSession(recordDelete['session.id']);
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
      getTotalSession(pageIndex, pageSize, flightNumber, filters);
      setTotalPages(1);
      setTotalRecord(0);
      // setDataSession([]);
    }
    if (isReload) {
      setIsReload(false);
    }
    //eslint-disable-next-line
  }, [flightNumber, i18n, isReload, pageIndex, pageSize]);

  const handleRowClick = (row: SessionGeneral) => {
    setRecord(row);
    // setOpenDialog(true);
  };

  // const handleCloseView = () => {
  //   setOpenDialog(false);
  //   setRecord(null);
  // };

  const columns = useMemo(() => {
    return columnsHistoryIFC(pageIndex, pageSize, handleAdd, handleClose, setRecord, setRecordDelete);
    // Filter out the column with accessor 'user_ip_address'
    // return allColumns.filter((column) => column.accessor !== 'flight.aircraft.flight_number');
    //eslint-disable-next-line
  }, [setRecord]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FilterBar totalRecord={totalRecord} getFilterValues={setFilters} />
      </Grid>
      <Grid item xs={12}>
        <MainCard content={false}>
          <ScrollX>
            <GeneralizedTable
              isReload={isReload}
              columns={columns}
              data={dataSession}
              handleAdd={handleAdd}
              onPageChange={handlePageChange}
              totalPages={totalPages}
              sortColumns="index"
              onRowClick={handleRowClick}
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
                nameRecord={recordDelete['session.id']}
                open={open}
                handleClose={handleClose}
                handleDelete={handleDelete}
              />
            )}
          </Dialog>
          {/* <ViewDialog title="session-info" config={sessionViewConfig} open={openDialog} onClose={handleCloseView} data={record} /> */}
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default TabHistoryIFC;
