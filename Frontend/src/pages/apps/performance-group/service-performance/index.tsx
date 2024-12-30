import { useState } from 'react';
import { useIntl } from 'react-intl';

//project-import
// import Filter from '../../common-components/Filter';
import FilterCollapse from 'pages/apps/common-components/Filter/FilterCollapse';
import { filterServicePerformance } from 'pages/apps/common-components/Filter/filter-item';
import ApexColumnChart from 'components/organisms/chart/ApexColumn';

//config
import useConfig from 'hooks/useConfig';
import { chartConfigSLA, chartConfigBandwidth, chartAvailability, chartBandwidth } from './model';

//mui
import { Grid } from '@mui/material';
import MainCard from 'components/MainCard';

function ServicesPerformancePage() {
  const [filterValue, setFilterValue] = useState();
  const { i18n } = useConfig();
  const intl = useIntl();

  function checkLang(langChart: any, filterValue: any) {
    if (i18n === 'vi') {
      return langChart.vi;
    } else {
      return langChart.en;
    }
  }

  const langChartAvailability = checkLang(chartAvailability, filterValue);
  const langChartBandwidth = checkLang(chartBandwidth, filterValue);

  const getFilterValue = (value: any) => {
    setFilterValue(value);
  };
  return (
    <Grid container rowSpacing={2} columnSpacing={2}>
      <Grid item xs={12}>
        <MainCard>
          <FilterCollapse filtersConfig={filterServicePerformance} getFilterValue={getFilterValue}></FilterCollapse>
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <MainCard>
          <ApexColumnChart
            columnChartOptions={chartConfigSLA}
            categories={langChartAvailability.categories}
            series={langChartAvailability.series}
            title={intl.formatMessage({ id: 'availability-sla' })}
            titleX={intl.formatMessage({ id: 'date-in-month' })}
            titleY={intl.formatMessage({ id: 'percentage-of-services-provided' })}
          ></ApexColumnChart>
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <MainCard>
          <ApexColumnChart
            columnChartOptions={chartConfigBandwidth}
            series={langChartBandwidth.series}
            categories={langChartBandwidth.categories}
            title={intl.formatMessage({ id: 'bandwidth-sla' })}
            titleX={intl.formatMessage({ id: 'date-in-month' })}
            titleY={intl.formatMessage({ id: 'bandwidth-gb' })}
          ></ApexColumnChart>
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default ServicesPerformancePage;
