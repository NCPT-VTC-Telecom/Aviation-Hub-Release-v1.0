import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Tooltip } from '@mui/material';
import { SkeletonDonutChart } from 'components/organisms/skeleton';

// third-party
import { ThemeMode } from 'types/config';
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';

//assets
import { InfoCircle } from 'iconsax-react';
// ==============================|| APEXCHART - PIE/DONUT ||============================== //

const ApexPieDonutChart = ({
  chartOptions,
  series,
  title,
  labels,
  titleY,
  titleX,
  desc
}: {
  chartOptions: any;
  series: any;
  title?: string;
  labels: any;
  titleY?: string;
  titleX?: string;
  desc?: string;
}) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const line = theme.palette.divider;
  const { primary } = theme.palette.text;

  const successDark = theme.palette.success.main;

  const [options, setOptions] = useState<ChartProps>(chartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [
        '#89D7AE',
        '#FF8FCF',
        '#FFE6AD',
        '#D7BFEA',
        '#D9E7ED',
        '#FFD68C',
        '#A3DAB4',
        '#ED88B6',
        '#EFDEA5',
        '#B5A3D4',
        '#B4D3C8',
        '#FFEDB0',
        '#B8D1A5'
      ],
      labels: labels,
      chart: {
        toolbar: {
          show: false
        }
      },
      xaxis: {
        labels: {
          style: {
            colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary]
          }
        },
        title: {
          text: titleX,
          style: {
            color: '#000',
            fontSize: '12px',
            fontFamily: 'Inter var',
            fontWeight: 400,
            cssClass: 'apexcharts-yaxis-title'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        },
        title: {
          text: titleY,
          style: {
            color: '#000',
            fontSize: '12px',
            fontFamily: 'Inter var',
            fontWeight: 400,
            cssClass: 'apexcharts-yaxis-title'
          }
        }
      },
      grid: {
        borderColor: line
      },
      legend: {
        labels: {
          colors: 'secondary.main'
        }
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, line, successDark, labels, titleX, titleY]);

  return (
    <div id="chart">
      <h2 className="flex gap-2">
        {title}
        {desc && (
          <Tooltip title={desc} arrow>
            <InfoCircle className="h-5 w-5 cursor-pointer" />
          </Tooltip>
        )}
      </h2>
      {series && series.length > 0 ? <ReactApexChart options={options} series={series} type="donut" height={350} /> : SkeletonDonutChart()}
    </div>
  );
};

export default ApexPieDonutChart;
