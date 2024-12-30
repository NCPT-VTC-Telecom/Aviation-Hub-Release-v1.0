import { useState, SyntheticEvent } from 'react';

// material-ui
import { Box, FormControl, Grid, MenuItem, Select, SelectChangeEvent, Stack, Tab, Tabs } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import ApexColumnChart from '../../../components/organisms/chart/ApexColumn';
import { useIntl } from 'react-intl';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

interface ChartConfig {
  categories: string[];
  series: { name: string; data: number[] }[];
  config: any;
}

interface Props {
  chartData: ChartConfig[];
  tabList: string[];
}

function TabReport({ chartData, tabList }: Props) {
  const [value, setValue] = useState(0);
  const [age, setAge] = useState('30');
  const [data, setData] = useState(chartData[0]);
  const intl = useIntl();

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setData(chartData[newValue]);
  };

  return (
    <MainCard content={false}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{ px: 3, pt: 1, '& .MuiTab-root': { mb: 0.5 } }}>
            {tabList.map((tabItem, index) => (
              <Tab label={intl.formatMessage({ id: tabItem })} {...a11yProps(index)} />
            ))}
          </Tabs>
        </Box>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <Select id="demo-simple-select" value={age} onChange={handleChangeSelect}>
                        <MenuItem value={10}>{intl.formatMessage({ id: 'today' })}</MenuItem>
                        <MenuItem value={20}>{intl.formatMessage({ id: 'weekly' })}</MenuItem>
                        <MenuItem value={30}>{intl.formatMessage({ id: 'monthly' })}</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Stack>
                <ApexColumnChart
                  titleX=""
                  titleY=""
                  columnChartOptions={data.config}
                  series={data.series}
                  categories={data.categories}
                ></ApexColumnChart>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </MainCard>
  );
}

export default TabReport;
