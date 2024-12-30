import { useState, useEffect } from 'react';
import useMapStatus from 'utils/mapStatus';

//mui
import { Grid } from '@mui/material';

//project import
import MainCard from 'components/MainCard';
import ApexBarChart from 'components/organisms/chart/ApexBarChart';
import ApexColumnChart from 'components/organisms/chart/ApexColumn';
import ApexLineChart from 'components/organisms/chart/ApexLineChart';
import ApexPieDonutChart from 'components/organisms/chart/ApexPieDonutChart';
import { filterSessionPerformance } from 'pages/apps/common-components/Filter/filter-item';
import FilterCollapse from 'pages/apps/common-components/Filter/FilterCollapse';

//config
import {
  chartConfigDevice,
  chartConfigBrowser,
  chartConfigAverageSessionPerFlight,
  chartConfigAverageSessionsDuration
} from './configChart';

//model
import { getDataChartBrowser, getDataChartDevices, getDataChartSessionDuration, getDataChartSessionPerDate } from './model';

//utils
import { getInitialDate, addDays } from 'utils/handleData';

//types
// import { EndUser } from 'types/end-user';
import { FilterSessionPerformance } from 'types/filter';
import { FormattedMessage, useIntl } from 'react-intl';
import { ChartData } from 'types/general';

function SessionPerformancePage() {
  const { getStatusMessage } = useMapStatus();
  const [isInitialized, setIsInitialized] = useState(false);

  const [filterValue, setFilterValue] = useState<FilterSessionPerformance>({
    start_date: null,
    end_date: null,
    departure_airport: '',
    arrival_airport: '',
    tail_number: '',
    flight_number: '',
    flight_length: '',
    dpi_profile: '',
    device_type: '',
    slot: ''
  });
  // const [dataEndUser, setDataEndUser] = useState<EndUser[]>([]);
  const [dataChartBrowser, setDataChartBrowser] = useState<ChartData>({ categories: [], series: [{ name: '', data: [] }] });
  const [dataChartDevices, setDataChartDevices] = useState<ChartData>({ categories: [], series: [] });
  const [dataChartSessionDuration, setDataChartSessionDuration] = useState<ChartData>({ categories: [], series: [] });
  const [dataChartSessionPerDate, setDataChartSessionPerDate] = useState<ChartData>({ categories: [], series: [] });
  const intl = useIntl();

  useEffect(() => {
    getInitialDate(setFilterValue, filterValue);
    setIsInitialized(true);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isInitialized) {
      getDataChart(filterValue);
    }
    //eslint-disable-next-line
  }, [filterValue, isInitialized]);

  const getDataChart = async (filterValue: FilterSessionPerformance) => {
    const adjustedEndDate = addDays(filterValue.end_date as string, 1);

    const promises = [
      getDataChartBrowser(filterValue.start_date, adjustedEndDate),
      getDataChartDevices(filterValue.start_date, adjustedEndDate),
      getDataChartSessionDuration(filterValue.start_date, adjustedEndDate),
      getDataChartSessionPerDate(filterValue.start_date, adjustedEndDate)
    ];

    const results = await Promise.allSettled(promises);

    let hasError = false; // Đánh dấu nếu có lỗi

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        const { data, code } = result.value;
        if (code === 0) {
          switch (index) {
            case 0:
              setDataChartBrowser(data);
              break;
            case 1:
              setDataChartDevices(data);
              break;
            case 2:
              setDataChartSessionDuration(data);
              break;
            case 3:
              setDataChartSessionPerDate(data);
              break;
          }
        } else if (!hasError) {
          hasError = true;
          alert(getStatusMessage('general', code));
          window.location.href = '/login';
        }
      } else if (!hasError) {
        hasError = true;
        if (index === 0) setDataChartBrowser({ categories: [], series: [{ name: '', data: [] }] });
        if (index === 1) setDataChartDevices({ categories: [], series: [] });
        if (index === 2) setDataChartSessionDuration({ categories: [], series: [] });
        if (index === 3) setDataChartSessionPerDate({ categories: [], series: [] });
      }
    });
  };

  const getFilterValue = (value: any) => {
    setFilterValue(value);
  };

  return (
    <Grid container rowSpacing={2} columnSpacing={2}>
      <Grid item xs={12}>
        <MainCard>
          <FilterCollapse filtersConfig={filterSessionPerformance} getFilterValue={getFilterValue}></FilterCollapse>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <MainCard>
          {dataChartDevices ? (
            <ApexBarChart
              barChartOptions={chartConfigDevice}
              series={dataChartDevices?.series}
              categories={dataChartDevices?.categories}
              title={intl.formatMessage({ id: 'number-of-sessions-by-device-type' })}
              titleX={intl.formatMessage({ id: 'number-of-session' })}
              titleY={intl.formatMessage({ id: 'device-type' })}
              desc={intl.formatMessage({ id: 'desc-chart-session-device' })}
            ></ApexBarChart>
          ) : (
            <p>
              <FormattedMessage id="no-data-available" />
            </p>
          )}
        </MainCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <MainCard>
          {dataChartBrowser ? (
            <ApexPieDonutChart
              chartOptions={chartConfigBrowser}
              series={dataChartBrowser?.series[0].data}
              labels={dataChartBrowser?.categories}
              title={intl.formatMessage({ id: 'number-of-sessions-by-browser-type' })}
              titleX={intl.formatMessage({ id: 'number-of-session' })}
              titleY={intl.formatMessage({ id: 'browser' })}
              desc={intl.formatMessage({ id: 'desc-chart-session-browser' })}
            />
          ) : (
            <p>
              <FormattedMessage id="no-data-available" />
            </p>
          )}
        </MainCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <MainCard>
          {dataChartSessionPerDate ? (
            <ApexLineChart
              chartOptions={chartConfigAverageSessionPerFlight}
              series={dataChartSessionPerDate?.series}
              categories={dataChartSessionPerDate?.categories}
              title={intl.formatMessage({ id: 'average-number-of-sessions-per-day' })}
              titleY={intl.formatMessage({ id: 'average-number-of-sessions' })}
              titleX={intl.formatMessage({ id: 'date-in-month' })}
              desc={intl.formatMessage({ id: 'desc-chart-session-per-day' })}
            />
          ) : (
            // <ApexColumnChart
            //   columnChartOptions={chartConfigAverageSessionPerFlight}
            //   series={dataChartSessionPerDate?.series}
            //   categories={dataChartSessionPerDate?.categories}
            //   title="average-number-of-sessions-per-day"
            //   titleY={intl.formatMessage({ id: 'average-number-of-sessions' })}
            //   titleX={intl.formatMessage({ id: 'date-in-month' })}
            //   desc="desc-chart-session-per-day"
            // ></ApexColumnChart>
            <p>
              <FormattedMessage id="no-data-available" />
            </p>
          )}
        </MainCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <MainCard>
          {dataChartSessionDuration ? (
            <ApexColumnChart
              columnChartOptions={chartConfigAverageSessionsDuration}
              series={dataChartSessionDuration?.series}
              categories={dataChartSessionDuration?.categories}
              title={intl.formatMessage({ id: 'average-sessions-duration' })}
              titleY={intl.formatMessage({ id: 'session-duration-hours' })}
              titleX={intl.formatMessage({ id: 'date-in-month' })}
              desc={intl.formatMessage({ id: 'desc-chart-average-session-per-day' })}
            ></ApexColumnChart>
          ) : (
            <p>
              <FormattedMessage id="no-data-available" />
            </p>
          )}
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default SessionPerformancePage;
