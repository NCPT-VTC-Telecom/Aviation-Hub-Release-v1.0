// material-ui
import { Grid, Dialog } from '@mui/material';

//Hook
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import useConfig from 'hooks/useConfig';

//third-party
import { enqueueSnackbar } from 'notistack';

// project-imports
import { PopupTransition } from 'components/@extended/Transitions';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import FilterBar from 'pages/apps/profiles/common-components/FilterBar';

//config
import { flightViewConfig } from 'components/ul-config/view-dialog-config';
import { ColumnsHistoryFlight } from 'components/ul-config/table-config/flight-info';

//types
import { formatDateTime, getRouteHistory, getTimeFlight, useLangUpdate } from 'utils/handleData';

//model
import { getFlight } from './model';

//redux
import { useIntl } from 'react-intl';
import { FlightData } from 'types/aviation';
import ViewDialog from 'components/template/ViewDialog';

const TabFlightHistory = () => {
  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [record, setRecord] = useState<any>();

  const [dataFlight, setDataFlight] = useState<FlightData[]>([]);
  const [filters, setFilters] = useState();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);

  const intl = useIntl();
  const { tailNumber } = useParams();
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  // const filterItem = [
  //   {
  //     name: 'browser',
  //     optionList: [
  //       {
  //         label: 'Chrome',
  //         value: 'chrome'
  //       },
  //       {
  //         label: 'Safari',
  //         value: 'safari'
  //       },
  //       {
  //         label: 'Fire fox',
  //         value: 'fire-fox'
  //       },
  //       {
  //         label: 'Other browser',
  //         value: 'other'
  //       }
  //     ]
  //   },
  //   {
  //     name: 'plan-type',
  //     optionList: [
  //       {
  //         label: intl.formatMessage({ id: 'wifi-packages' }),
  //         value: 'product'
  //       },
  //       {
  //         label: intl.formatMessage({ id: 'airfare-packages' }),
  //         value: 'airline'
  //       },
  //       {
  //         label: intl.formatMessage({ id: 'telecom-packages' }),
  //         value: 'telecom'
  //       }
  //     ]
  //   }
  // ];

  async function getHistoryFlight(pageIndex: number, pageSize: number, tailNumber: string, filters: any) {
    try {
      const res = await getFlight(pageIndex, pageSize, tailNumber);
      if (res.code === 0) {
        setTotalPages(res.totalPages);
        setTotalRecord(res.total);
        const formattedDate = formatDateTime(res.data, ['departure_time', 'arrival_time', 'created_date']);
        const mapRoute = getRouteHistory(formattedDate);
        const mapFlightTime = getTimeFlight(mapRoute);
        setDataFlight(mapFlightTime);
      } else {
        setDataFlight([]);
      }
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  }

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

  const columns = useMemo(() => {
    const allColumns = ColumnsHistoryFlight(pageIndex, pageSize, handleAdd, handleClose, undefined, true);
    const excludeColumns = ['aircraft.tail_number', 'index'];
    return allColumns.filter((column) => !column.accessor || !excludeColumns.includes(column.accessor));
    //eslint-disable-next-line
  }, [setRecord, pageIndex, pageSize]);

  useEffect(() => {
    if (tailNumber) {
      getHistoryFlight(pageIndex, pageSize, tailNumber, filters);
    }
    if (isReload) {
      setIsReload(false);
    }
    //eslint-disable-next-line
  }, [tailNumber, i18n, isReload, pageIndex, pageSize]);

  const handleRowClick = (row: FlightData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

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
              data={dataFlight}
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
            <ViewDialog title="flight-info" config={flightViewConfig} open={openDialog} onClose={handleCloseView} data={record} />
          </Dialog>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default TabFlightHistory;
