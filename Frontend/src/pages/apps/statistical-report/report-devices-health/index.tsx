import { useEffect, useState, useMemo } from 'react';
import useMapStatus from 'utils/mapStatus';
import useConfig from 'hooks/useConfig';
import { FormattedMessage, useIntl } from 'react-intl';

//project component
import { Grid } from '@mui/material';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { columnsDevicesHealth } from 'components/ul-config/table-config/devices';

//model
import { getChartDeviceHealth, getDevicesHealth } from './model';
import { formatDateTime, getInitialDate, useLangUpdate } from 'utils/handleData';
import ApexPieDonutChart from 'components/organisms/chart/ApexPieDonutChart';

//redux
import { enqueueSnackbar } from 'notistack';

//types
import { DeviceHealth } from 'types/device';
import { ChartData } from 'types/general';
import { FilterDeviceHealth } from 'types/filter';

const ListSessionPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [isReload, setIsReload] = useState<boolean>(false);

  const [record, setRecord] = useState<DeviceHealth | null>(null);
  const [data, setData] = useState<DeviceHealth[]>([]);
  const [deviceHeathDataChart, setDeviceHealthDataChart] = useState<ChartData>({
    series: [{ name: '', data: [] }],
    categories: []
  });
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const intl = useIntl();
  const { getStatusMessage } = useMapStatus();
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  const [filterValues, setFilterValues] = useState<FilterDeviceHealth>({
    start_date: '',
    end_date: '',
    airline: '',
    tail_number: '',
    slot: 'day'
  });

  useEffect(() => {
    getInitialDate(setFilterValues, filterValues);
    //eslint-disable-next-line
  }, []);

  const getData = async (pageIndex: number, pageSize: number) => {
    try {
      const res = await getDevicesHealth(pageIndex, pageSize);
      if (res && res.code === 0) {
        setTotalPages(res.totalPages);
        const formattedTime = formatDateTime(res.data, ['health_check_time', 'activation_date', 'manufacturer_date']);
        setData(formattedTime);
      } else {
        setData([]);
      }
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  };

  const getDataChart = async () => {
    try {
      const res = await getChartDeviceHealth(filterValues.start_date, filterValues.end_date);
      if (res && res.code === 0) {
        setDeviceHealthDataChart(res.data);
      } else {
        const message = getStatusMessage('general', res.code);
        alert(message);
        setData([]);
      }
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  };

  const handlePageChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex + 1);
    setPageSize(newPageSize);
  };

  useEffect(() => {
    getData(pageIndex, pageSize);
    //eslint-disable-next-line
  }, [pageIndex, pageSize]);

  useEffect(() => {
    getDataChart();
    if (isReload) {
      setIsReload(false);
    }
    //eslint-disable-next-line
  }, [i18n, isReload, filterValues]);

  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo(() => {
    return columnsDevicesHealth(pageIndex, pageSize, handleAdd, handleClose);
    //eslint-disable-next-line
  }, [setRecord]);

  const chartConfig = {
    chart: {
      type: 'donut',
      height: 350
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        distributed: true
      }
    },
    dataLabels: {
      enabled: true
    },
    legend: {
      show: true,
      fontFamily: `Inter var`,
      position: 'bottom',
      offsetX: 10,
      offsetY: 10,
      labels: {
        useSeriesColors: false
      },
      markers: {
        width: 16,
        height: 16,
        radius: 5
      },
      itemMargin: {
        horizontal: 15,
        vertical: 8
      }
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {deviceHeathDataChart ? (
          <ApexPieDonutChart
            titleX={intl.formatMessage({ id: 'date-in-month' })}
            titleY={intl.formatMessage({ id: 'percentage-of-device-heath' })}
            labels={deviceHeathDataChart.categories}
            series={deviceHeathDataChart.series[0].data}
            chartOptions={chartConfig}
          />
        ) : (
          <p>
            <FormattedMessage id="no-data-available" />
          </p>
        )}
      </Grid>
      <Grid item xs={12}>
        <MainCard content={false}>
          <ScrollX>
            <GeneralizedTable
              isReload={isReload}
              columns={columns}
              data={data}
              handleAdd={handleAdd}
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

export default ListSessionPage;
