import { useState, SyntheticEvent, useEffect } from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';
import { useIntl } from 'react-intl';
// material-ui
import { Box, Grid, Tab, Tabs } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import FilterCollapse from 'pages/apps/common-components/Filter/FilterCollapse';
//utils
import { getInitialDate } from 'utils/handleData';
//types
import { FilterDeviceHealth } from 'types/filter';
import { FiltersConfig } from 'types/general';

// ==============================|| PROFILE - ACCOUNT ||============================== //

const StatisticalReportPage = () => {
  const { pathname } = useLocation();
  const intl = useIntl();
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

  let selectedTab = 0;
  switch (pathname) {
    case '/statistical-report/retail':
      selectedTab = 1;
      break;
    case '/apps/profiles/account/my-account':
      selectedTab = 2;
      break;
    case '/apps/profiles/account/password':
      selectedTab = 3;
      break;
    case '/apps/profiles/account/role':
      selectedTab = 4;
      break;
    case '/apps/profiles/account/settings':
      selectedTab = 5;
      break;
    case '/statistical-report/device-health':
    default:
      selectedTab = 0;
  }

  const [value, setValue] = useState(selectedTab);

  const filterList: FiltersConfig = {
    id: 'exampleFilters',
    haveDatePicker: true,
    filterItem: [
      {
        id: 'aircraft_type',
        optionList: [
          { value: 'A320', label: 'Airbus A320' },
          { value: 'A330', label: 'Airbus A330' },
          { value: 'B737', label: 'Airbus B737' },
          { value: 'B747', label: 'Airbus B747' }
        ]
      },
      {
        id: 'tail_number',
        optionList: [
          { value: 'VN-A123', label: 'VN A123' },
          { value: 'VN-B234', label: 'VN B234' },
          { value: 'VN-982', label: 'VN 924' }
        ]
      }
    ]
  };

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <MainCard>
            <FilterCollapse filtersConfig={filterList} getFilterValue={setFilterValues} />
          </MainCard>
        </Grid>
        <Grid item xs={12}>
          <MainCard border={false}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
              <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
                <Tab
                  label={intl.formatMessage({ id: 'device-health' })}
                  component={Link}
                  to="/statistical-report/device-health"
                  // icon={<Profile />}
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            <Box sx={{ mt: 2.5 }}>
              <Outlet context={{ filterValues }} />
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
};

export default StatisticalReportPage;
