// material-ui
import { Grid } from '@mui/material';

//Hook
import {
  useEffect,
  useState,
  useMemo
  // , useCallback
} from 'react';
import { useParams } from 'react-router';
import useConfig from 'hooks/useConfig';

//third-party
// import { Row } from 'react-table';
import { enqueueSnackbar } from 'notistack';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
// import SessionView from 'pages/apps/management/session/list-session/SessionView';
import { columnsDevicesHealth } from 'components/ul-config/table-config/devices';
import FilterBar from 'pages/apps/profiles/common-components/FilterBar';

//types & utils
import { formatDateTime, useLangUpdate } from 'utils/handleData';
import { DeviceHealth } from 'types/device';

//model
import { getDeviceHealth } from './model';

import { useIntl } from 'react-intl';

const TabSession = () => {
  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [record, setRecord] = useState<any>();

  const [filters, setFilters] = useState();
  const [dataDeviceHealth, setDataDeviceHealth] = useState<DeviceHealth[]>([]);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);

  const intl = useIntl();
  const { deviceID } = useParams();
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  async function getDataDeviceHealth(pageIndex: number, pageSize: number, deviceID: string, filter: any) {
    try {
      const res = await getDeviceHealth(pageIndex, pageSize, deviceID);
      if (res.code === 0) {
        setTotalPages(res.totalPages);
        setTotalRecord(res.total);
        const formattedDate = formatDateTime(res.data, ['health_check_time', 'activation_date', 'deactivation_date', 'manufacturer_date']);
        setDataDeviceHealth(formattedDate);
      } else {
        setDataDeviceHealth([]);
      }
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
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
    const allColumns = columnsDevicesHealth(pageIndex, pageSize, handleAdd, handleClose);
    const excludeColumns = ['name', 'index', 'supplier', 'placement_location'];
    return allColumns.filter((column) => !column.accessor || !excludeColumns.includes(column.accessor));
    //eslint-disable-next-line
  }, [setRecord]);

  // const renderRowSubComponent = useCallback(
  //   ({ row }: { row: Row<{}> }) => <SessionView data={dataDeviceHealth[Number(row.id)]} />,
  //   [dataDeviceHealth]
  // );

  useEffect(() => {
    if (deviceID) {
      getDataDeviceHealth(pageIndex, pageSize, deviceID, filters);
    }
    if (isReload) {
      setIsReload(false);
    }
    //eslint-disable-next-line
  }, [deviceID, i18n, isReload, pageIndex, pageSize]);

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
              isLoading={isLoading}
              columns={columns}
              data={dataDeviceHealth}
              handleAdd={handleAdd}
              // renderRowSubComponent={renderRowSubComponent}
              onPageChange={handlePageChange}
              totalPages={totalPages}
              sortColumns="index"
            />
          </ScrollX>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default TabSession;
