import { useState, SyntheticEvent, useMemo, useEffect } from 'react';
import { useLocation, Link, Outlet, useParams } from 'react-router-dom';

// material-ui
import { Box, Tab, Tabs } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { Devices, TableDocument } from 'iconsax-react';
import { useIntl } from 'react-intl';

const DeviceProfilePage = () => {
  const intl = useIntl();
  const { deviceID } = useParams();
  const { pathname } = useLocation();

  const selectedTab = useMemo(() => {
    switch (pathname) {
      case `/device/maintenance-schedule/${deviceID}`:
        return 3;
      case `/device/device-health/${deviceID}`:
        return 2;
      case `/device/session-list/${deviceID}`:
        return 1;
      case `/device/profile/${deviceID}`:
      default:
        return 0;
    }
  }, [pathname, deviceID]);

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
            to={`/device/profile/${deviceID}`}
            icon={<Devices />}
            iconPosition="start"
          />
          <Tab
            label={intl.formatMessage({ id: 'list-session' })}
            component={Link}
            to={`/device/session-list/${deviceID}`}
            icon={<TableDocument />}
            iconPosition="start"
          />
          <Tab
            label={intl.formatMessage({ id: 'device-health' })}
            component={Link}
            to={`/device/device-health/${deviceID}`}
            icon={<TableDocument />}
            iconPosition="start"
          />
          <Tab
            label={intl.formatMessage({ id: 'maintenance-schedule' })}
            component={Link}
            to={`/device/maintenance-schedule/${deviceID}`}
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

export default DeviceProfilePage;
