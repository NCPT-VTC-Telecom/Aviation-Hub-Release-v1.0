import { useState, SyntheticEvent, useMemo, useEffect } from 'react';
import { useLocation, Link, Outlet, useParams } from 'react-router-dom';

// material-ui
import { Box, Tab, Tabs } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { Airplane, TableDocument } from 'iconsax-react';
import { useIntl } from 'react-intl';

const AircraftProfilePage = () => {
  const intl = useIntl();
  const { tailNumber } = useParams();
  const { pathname } = useLocation();

  const selectedTab = useMemo(() => {
    switch (pathname) {
      case `/aircraft/maintenance-schedule/${tailNumber}`:
        return 3;
      case `/aircraft/installed-device/${tailNumber}`:
        return 2;
      case `/aircraft/history-flight/${tailNumber}`:
        return 1;
      case `/aircraft/profile/${tailNumber}`:
      default:
        return 0;
    }
  }, [pathname, tailNumber]);

  const [value, setValue] = useState(selectedTab);

  useEffect(() => {
    setValue(selectedTab);
  }, [selectedTab]);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <MainCard border={false}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
        <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
          <Tab
            label={intl.formatMessage({ id: 'profile' })}
            component={Link}
            to={`/aircraft/profile/${tailNumber}`}
            icon={<Airplane />}
            iconPosition="start"
          />
          <Tab
            label={intl.formatMessage({ id: 'history-flight' })}
            component={Link}
            to={`/aircraft/history-flight/${tailNumber}`}
            icon={<TableDocument />}
            iconPosition="start"
          />
          <Tab
            label={intl.formatMessage({ id: 'device' })}
            component={Link}
            to={`/aircraft/installed-device/${tailNumber}`}
            icon={<TableDocument />}
            iconPosition="start"
          />
          <Tab
            label={intl.formatMessage({ id: 'maintenance-schedule' })}
            component={Link}
            to={`/aircraft/maintenance-schedule/${tailNumber}`}
            icon={<TableDocument />}
            iconPosition="start"
          />
        </Tabs>
      </Box>
      <Box sx={{ mt: 2.5 }}>
        <Outlet />
      </Box>
    </MainCard>
  );
};

export default AircraftProfilePage;
