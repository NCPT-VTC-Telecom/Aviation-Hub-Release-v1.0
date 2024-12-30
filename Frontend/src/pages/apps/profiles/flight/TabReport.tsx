import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useConfig from 'hooks/useConfig';
import { useTheme } from '@mui/material/styles';
import { useIntl } from 'react-intl';

// project-imports
import { Grid } from '@mui/material';
import { HoverSocialCard } from 'components/organisms/statistics';
import { ApexPieDonutChart, ApexLineChart } from 'components/organisms/chart';

//utils
import { formatDataUsage } from 'utils/handleData';
import { getSession, getDataUsageFlight, getRevenue } from './model';

//assets
import { CloudConnection, DollarCircle, Data } from 'iconsax-react';

//third-party
import { enqueueSnackbar } from 'notistack';

const chartPlanConfig = {
  chart: {
    type: 'donut'
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
  xaxis: {
    labels: {
      formatter: function (value: number) {
        if (value >= 1000000) {
          return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
          return (value / 1000).toFixed(1) + 'K';
        } else {
          return value;
        }
      }
    }
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

const chartSpeedConfig = {
  chart: {
    type: 'line',
    height: 350
  },
  tooltip: {
    x: {
      format: 'HH:mm'
    }
  }
};

const dataChartPlan = {
  categories: ['VNA Web Basic', 'VNA Premium'],
  series: [{ name: 'Plan', data: [] }]
};

const chartDataSpeed = {
  categories: ['14:20', '15:20', '16:20', '17:20', '18:20', '19:00'],
  series: [
    {
      name: 'Tốc độ mạng (Mbps)',
      data: [100, 110, 115, 130, 140, 125]
    }
  ]
};

const TabReportFlight = () => {
  const [totalSession, setTotalSession] = useState<number>(0);
  const [totalDataUsage, setTotalDataUsage] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);
  const [flightID, setFlightID] = useState<number>();
  const { flightNumber } = useParams();
  const { i18n } = useConfig();
  const theme = useTheme();
  const intl = useIntl();

  const getTotalSession = async (flightNumber: string) => {
    try {
      const res = await getSession(flightNumber);
      setTotalSession(res.total || 0);
      setFlightID(res.data[0].flight_id);
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  };

  const getDataUsageByFlight = async (flightID: number) => {
    try {
      const res = await getDataUsageFlight(flightID);
      setTotalDataUsage(res.total);
    } catch {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  };

  const getRevenueByFlight = async (flightID: number) => {
    try {
      const res = await getRevenue(flightID);
      setRevenue(res.total);
    } catch {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  };

  useEffect(() => {
    if (flightNumber) {
      getTotalSession(flightNumber);
    }
    if (flightID) {
      getDataUsageByFlight(flightID);
      getRevenueByFlight(flightID);
    }
    //eslint-disable-next-line
  }, [flightNumber, flightID, i18n]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container spacing={1.25}>
          <Grid item xs={12} md={4}>
            <HoverSocialCard
              primary={intl.formatMessage({ id: 'income-plan' })}
              secondary={`${revenue.toLocaleString('vi-VN')} VND`}
              iconPrimary={DollarCircle}
              color="#32CD32"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <HoverSocialCard
              primary={intl.formatMessage({ id: 'total-session' })}
              secondary={totalSession}
              iconPrimary={CloudConnection}
              color="#008B8B"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <HoverSocialCard
              primary={intl.formatMessage({ id: 'data-usage' })}
              secondary={formatDataUsage(totalDataUsage)}
              iconPrimary={Data}
              color={theme.palette.secondary.main}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={4}>
        <ApexPieDonutChart chartOptions={chartPlanConfig} labels={dataChartPlan.categories} series={dataChartPlan.series[0].data} />
      </Grid>

      <Grid item xs={12} md={8}>
        <ApexLineChart
          title={intl.formatMessage({ id: 'in_flight_network_speed' })}
          titleY={intl.formatMessage({ id: 'average_network_speed_mbps' })}
          titleX={intl.formatMessage({ id: 'time' })}
          chartOptions={chartSpeedConfig}
          categories={chartDataSpeed.categories}
          series={chartDataSpeed.series}
        />
      </Grid>
    </Grid>
  );
};

export default TabReportFlight;
