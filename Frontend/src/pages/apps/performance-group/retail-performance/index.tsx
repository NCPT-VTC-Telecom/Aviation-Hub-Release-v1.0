import { useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import useMapStatus from 'utils/mapStatus';

//mui
import { Grid } from '@mui/material';

//project-import
import ApexBarChart from 'components/organisms/chart/ApexBarChart';
// import ApexColumnChart from 'pages/apps/common-components/chart/ApexColumn';
import ApexLineChart from 'components/organisms/chart/ApexLineChart';
import ApexPieDonutChart from 'components/organisms/chart/ApexPieDonutChart';
import { filterRetailPerformance } from 'pages/apps/common-components/Filter/filter-item';
import MainCard from 'components/MainCard';
// import Filter from '../../common-components/Filter';
import FilterCollapse from 'pages/apps/common-components/Filter/FilterCollapse';

//config
import {
  chartConfigTotalPlan,
  // chartConfigCampaign,
  chartConfigPaymentMethod,
  chartConfigPlans
} from './configChart';

//model
import { getDataChartPaymentMethod, getDataChartPlan, getDataChartPlanPerDate } from './model';
// import { getAllVouchersRedeemed } from 'pages/apps/management/vouchers/list-vouchers-redeemed/model';

//types
import { FilterRetailPerformance } from 'types/filter';
import { ChartData } from 'types/general';

//utils
import { getInitialDate } from 'utils/handleData';

function RetailPerformancePage() {
  const [isInitialized, setIsInitialized] = useState(false);

  const [dataChartPlan, setDataChartPlan] = useState<ChartData>({ categories: [], series: [] });
  const [totalPlanOverTime, setTotalPlanOverTime] = useState<ChartData>({ categories: [], series: [{ name: '', data: [] }] });
  const [dataChartPayment, setDataChartPayment] = useState<ChartData>({ categories: [], series: [{ name: '', data: [] }] });

  const { getStatusMessage } = useMapStatus();

  const [filterValue, setFilterValue] = useState<FilterRetailPerformance>({
    start_date: '',
    end_date: '',
    departure_airport: '',
    arrival_airport: '',
    tail_number: '',
    flight_number: '',
    flight_length: '',
    dpi_profile: '',
    device_type: '',
    slot: ''
  });
  // const [dataVoucherRedeemed, setDataVoucherRedeemed] = useState<VoucherRedeemed[]>([]);
  const intl = useIntl();
  useEffect(() => {
    getInitialDate(setFilterValue, filterValue);
    setIsInitialized(true);
    //eslint-disable-next-line
  }, []);

  // const getDataVoucherRedeemed = async () => {
  //   try {
  //     const data = await getAllVouchersRedeemed();
  //     const formatDate = formatDateTesting(data, ['date_used']);
  //     setDataVoucherRedeemed(formatDate);
  //   } catch (err) {
  //   }
  // };

  useEffect(() => {
    if (isInitialized) {
      getDataChart();
    }
    //eslint-disable-next-line
  }, [filterValue, isInitialized]);

  const getDataChart = async () => {
    const dataPlanPromise = getDataChartPlan(filterValue.start_date, filterValue.end_date);
    const dataPlanPerDatePromise = getDataChartPlanPerDate(filterValue.start_date, filterValue.end_date);
    const dataPaymentMethod = getDataChartPaymentMethod(filterValue.start_date, filterValue.end_date);

    const results = await Promise.allSettled([dataPlanPromise, dataPlanPerDatePromise, dataPaymentMethod]);

    let hasError = false;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        const { data, code } = result.value;

        if (code === 0) {
          switch (index) {
            case 0:
              setDataChartPlan(data);
              break;
            case 1:
              setTotalPlanOverTime(data);
              break;
            case 2:
              setDataChartPayment(data);
              break;
          }
        } else if (!hasError) {
          hasError = true;
          alert(getStatusMessage('general', code));
          window.location.href = '/login';
        }
      } else if (!hasError) {
        hasError = true;
        if (index === 0) setDataChartPlan({ categories: [], series: [] });
        if (index === 1) setTotalPlanOverTime({ categories: [], series: [] });
        if (index === 2) setDataChartPayment({ categories: [], series: [] });
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
          <FilterCollapse filtersConfig={filterRetailPerformance} getFilterValue={getFilterValue}></FilterCollapse>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <MainCard>
          {dataChartPlan ? (
            <ApexBarChart
              barChartOptions={chartConfigPlans}
              series={dataChartPlan.series}
              categories={dataChartPlan.categories}
              title={intl.formatMessage({ id: 'number-of-purchased-by-plan-type' })}
              titleY={intl.formatMessage({ id: 'service-plan' })}
              titleX={intl.formatMessage({ id: 'number-of-purchases' })}
              desc={intl.formatMessage({ id: 'desc-chart-plan-type' })}
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
          {totalPlanOverTime ? (
            <ApexLineChart
              chartOptions={chartConfigTotalPlan}
              series={totalPlanOverTime.series}
              categories={totalPlanOverTime.categories}
              title={intl.formatMessage({ id: 'total-in-selected-period' })}
              titleY={intl.formatMessage({ id: 'total-purchases-plan' })}
              titleX={intl.formatMessage({ id: 'date-in-month' })}
              desc={intl.formatMessage({ id: 'desc-chart-total-plan-per-date' })}
            />
          ) : (
            <p>
              <FormattedMessage id="no-data-available" />
            </p>
          )}
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <MainCard>
          {dataChartPayment ? (
            <ApexPieDonutChart
              chartOptions={chartConfigPaymentMethod}
              labels={dataChartPayment.categories}
              series={dataChartPayment.series[0].data}
              title={intl.formatMessage({ id: 'number-of-plans-purchased-by-payment-method' })}
              titleY={intl.formatMessage({ id: 'payment-method-time' })}
              titleX={intl.formatMessage({ id: 'number-of-purchases' })}
              desc={intl.formatMessage({ id: 'desc-chart-payment-method' })}
            />
          ) : (
            <p>
              <FormattedMessage id="no-data-available" />
            </p>
          )}
        </MainCard>
      </Grid>
      {/* <Grid item xs={12} md={6}>
        <MainCard>
          {dataChartVoucherRedeemed ? (
            <ApexBarChart
              barChartOptions={chartConfigCampaign}
              series={dataChartVoucherRedeemed.series}
              categories={dataChartVoucherRedeemed.categories}
              title={intl.formatMessage({ id: 'top-10-vouchers-redeemed-by-campaign-name' })}
              titleY={intl.formatMessage({ id: 'campaign' })}
              titleX={intl.formatMessage({ id: 'number-of-vouchers-redeemed' })}
              desc={intl.formatMessage({ id: 'desc-voucher-redeemed' })}
            ></ApexBarChart>
          ) : (
            <p>
              <FormattedMessage id="no-data-available" />
            </p>
          )}
        </MainCard>
      </Grid> */}
    </Grid>
  );
}

export default RetailPerformancePage;
