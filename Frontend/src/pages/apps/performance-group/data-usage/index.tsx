import { useEffect, useState } from 'react';
import useMapStatus from 'utils/mapStatus';
import { useIntl, FormattedMessage } from 'react-intl';

//mui
import { Grid } from '@mui/material';

//project import
import ApexColumnChart from 'components/organisms/chart/ApexColumn';
import ApexBarChart from 'components/organisms/chart/ApexBarChart';
import ApexPieDonutChart from 'components/organisms/chart/ApexPieDonutChart';
import { filterDataUsage } from 'pages/apps/common-components/Filter/filter-item';
import MainCard from 'components/MainCard';
// import Filter from '../../common-components/Filter';
import FilterCollapse from 'pages/apps/common-components/Filter/FilterCollapse';

//model
import { getTotalDataUsage, getTotalPAXCategories, getTotalPAXCategoriesPerDate, getTotalRolePerDate } from './model';
import { getInitialDate, addDays } from 'utils/handleData';

//config chart
import { chartConfigTotalData, chartConfigTotalSelected, chartConfigTotalSelectedDataUse, chartConfigPaxData } from './configChart';

//types
import { FilterDataUsagePerformance } from 'types/filter';
import { ChartData } from 'types/general';

function DataUsagePage() {
  const [dataUsageRole, setDataUsageRole] = useState<ChartData>({ categories: [], series: [{ name: '', data: [0] }] });
  const [dataUsageRoleDate, setDataUsageRoleDate] = useState<ChartData>({ categories: [], series: [] });
  const [dataPAXUsage, setDataPAXUsage] = useState<ChartData>({ categories: [], series: [] });
  const [dataPAXUsageDate, setDataPAXUsageDate] = useState<ChartData>({ categories: [], series: [] });

  const [isInitialized, setIsInitialized] = useState(false);
  const { getStatusMessage } = useMapStatus();

  const [filterValue, setFilterValue] = useState<FilterDataUsagePerformance>({
    start_date: null,
    end_date: null,
    departure_airport: '',
    arrival_airport: '',
    tail_number: '',
    flight_number: '',
    flight_length: '',
    dpi_profile: '',
    slot: ''
  });

  const intl = useIntl();

  useEffect(() => {
    getInitialDate(setFilterValue, filterValue);
    setIsInitialized(true);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isInitialized) {
      getDataChart(filterValue);
    } //eslint-disable-next-line
  }, [filterValue, isInitialized]);

  const getDataChart = async (filterValue: FilterDataUsagePerformance) => {
    const adjustedEndDate = addDays(filterValue.end_date as string, 1);

    const promises = [
      getTotalDataUsage(filterValue.start_date, adjustedEndDate),
      getTotalRolePerDate(filterValue.start_date, adjustedEndDate),
      getTotalPAXCategories(filterValue.start_date, adjustedEndDate),
      getTotalPAXCategoriesPerDate(filterValue.start_date, adjustedEndDate)
    ];

    const results = await Promise.allSettled(promises);

    let hasError = false;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        const { data, code } = result.value;

        if (code === 0) {
          switch (index) {
            case 0:
              setDataUsageRole(data);
              break;
            case 1:
              setDataUsageRoleDate(data);
              break;
            case 2:
              setDataPAXUsage(data);
              break;
            case 3:
              setDataPAXUsageDate(data);
              break;
          }
        } else if (!hasError) {
          hasError = true;
          alert(getStatusMessage('general', code));
          window.location.href = '/login';
        }
      } else if (!hasError) {
        hasError = true;
        if (index === 0) setDataUsageRole({ categories: [], series: [] });
        if (index === 1) setDataUsageRoleDate({ categories: [], series: [] });
        if (index === 2) setDataPAXUsage({ categories: [], series: [] });
        if (index === 3) setDataPAXUsageDate({ categories: [], series: [] });
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
          <FilterCollapse filtersConfig={filterDataUsage} getFilterValue={getFilterValue} onFiltersChange={getFilterValue}></FilterCollapse>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <MainCard>
          {dataUsageRole ? (
            <ApexPieDonutChart
              title={intl.formatMessage({ id: 'total-data-usage' })}
              chartOptions={chartConfigTotalData}
              labels={dataUsageRole.categories}
              series={dataUsageRole.series[0].data}
              titleX={intl.formatMessage({ id: 'data-usage-gb' })}
              titleY={intl.formatMessage({ id: 'user-role' })}
              desc={intl.formatMessage({ id: 'desc-total-data-usage' })}
            />
          ) : (
            // <ApexBarChart
            //   title=""
            //   barChartOptions={chartConfigTotalData}
            //   series={}
            //   categories={}
            //   titleX={intl.formatMessage({ id: 'data-usage-gb' })}
            //   titleY={intl.formatMessage({ id: 'user-role' })}
            // ></ApexBarChart>
            <p>
              <FormattedMessage id="no-data-available" />
            </p>
          )}
        </MainCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <MainCard>
          {dataUsageRole ? (
            <ApexColumnChart
              title={intl.formatMessage({ id: 'total-in-selected-period' })}
              columnChartOptions={chartConfigTotalSelected}
              series={dataUsageRoleDate.series}
              categories={dataUsageRoleDate.categories}
              titleX={intl.formatMessage({ id: 'date-in-month' })}
              titleY={intl.formatMessage({ id: 'data-usage-gb' })}
            ></ApexColumnChart>
          ) : (
            <p>
              <FormattedMessage id="no-data-available" />
            </p>
          )}
        </MainCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <MainCard>
          {dataUsageRole ? (
            <ApexBarChart
              title={intl.formatMessage({ id: 'pax-data-usage' })}
              barChartOptions={chartConfigPaxData}
              series={dataPAXUsage.series}
              categories={dataPAXUsage.categories}
              titleX={intl.formatMessage({ id: 'data-usage-by-pax-gb' })}
              titleY={intl.formatMessage({ id: 'type-of-data-usage' })}
              desc="desc-pax-data-usage-categories"
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
          {dataUsageRole ? (
            <ApexColumnChart
              title={intl.formatMessage({ id: 'total-in-selected-period' })}
              columnChartOptions={chartConfigTotalSelectedDataUse}
              series={dataPAXUsageDate.series}
              categories={dataPAXUsageDate.categories}
              titleX={intl.formatMessage({ id: 'date-in-month' })}
              titleY={intl.formatMessage({ id: 'data-usage-by-pax-gb' })}
              desc="desc-pax-data-usage-categories-date"
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

export default DataUsagePage;
