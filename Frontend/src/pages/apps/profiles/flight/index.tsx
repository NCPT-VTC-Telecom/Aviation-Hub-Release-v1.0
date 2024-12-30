import { useState, SyntheticEvent, useMemo, useEffect } from 'react';
import { useLocation, Link, Outlet, useParams } from 'react-router-dom';

// material-ui
import { Box, Tab, Tabs } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { Airplane, TableDocument, DocumentText } from 'iconsax-react';
import { useIntl } from 'react-intl';

const FlightProfilePage = () => {
  const intl = useIntl();
  const { flightNumber } = useParams();
  const { pathname } = useLocation();

  const selectedTab = useMemo(() => {
    switch (pathname) {
      case `/flight/report/${flightNumber}`:
        return 3;
      case `/flight/history-activities-ifc/${flightNumber}`:
        return 2;
      case `/flight/session-list/${flightNumber}`:
        return 1;
      case `/flight/profile/${flightNumber}`:
      default:
        return 0;
    }
  }, [pathname, flightNumber]);

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
            to={`/flight/profile/${flightNumber}`}
            icon={<Airplane />}
            iconPosition="start"
          />
          <Tab
            label={intl.formatMessage({ id: 'list-session' })}
            component={Link}
            to={`/flight/session-list/${flightNumber}`}
            icon={<TableDocument />}
            iconPosition="start"
          />
          <Tab
            label={intl.formatMessage({ id: 'list-activities-ifc' })}
            component={Link}
            to={`/flight/history-activities-ifc/${flightNumber}`}
            icon={<TableDocument />}
            iconPosition="start"
          />
          <Tab
            label={intl.formatMessage({ id: 'report' })}
            component={Link}
            to={`/flight/report/${flightNumber}`}
            icon={<DocumentText />}
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

export default FlightProfilePage;
