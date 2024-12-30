import { useState, SyntheticEvent, useMemo, useEffect } from 'react';
import { useLocation, Link, Outlet, useParams } from 'react-router-dom';

// material-ui
import { Box, Tab, Tabs } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { Airplane, TableDocument } from 'iconsax-react';
import { useIntl } from 'react-intl';

const PackageProfilePage = () => {
  const intl = useIntl();
  const { params } = useParams();
  const { pathname } = useLocation();

  const selectedTab = useMemo(() => {
    switch (pathname) {
      case `/package/order-list/${params}`:
        return 1;
      case `/package/profile/${params}`:
      default:
        return 0;
    }
  }, [pathname, params]);

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
            to={`/package/profile/${params}`}
            icon={<Airplane />}
            iconPosition="start"
          />
          <Tab
            label={intl.formatMessage({ id: 'list-order' })}
            component={Link}
            to={`/package/order-list/${params}`}
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

export default PackageProfilePage;
