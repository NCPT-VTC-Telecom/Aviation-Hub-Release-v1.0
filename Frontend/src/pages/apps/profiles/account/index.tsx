import { useState, SyntheticEvent, useEffect } from 'react';
import { useLocation, Link, Outlet, useParams } from 'react-router-dom';

// material-ui
import { Box, Tab, Tabs } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// assets
import {
  DocumentText,
  Profile,
  TableDocument
  //  Edit
} from 'iconsax-react';
import { useIntl } from 'react-intl';

// ==============================|| PROFILE - ACCOUNT ||============================== //

const AccountProfile = () => {
  const intl = useIntl();
  const { id } = useParams();
  const { pathname } = useLocation();

  let selectedTab = 0;
  switch (pathname) {
    // case `/account/edit-profile/${id}`:
    //   selectedTab = 1;
    //   break;
    case `/account/history-used-internet/${id}`:
      selectedTab = 1;
      break;
    case `/account/history-order/${id}`:
      selectedTab = 2;
      break;
    case `/account/change-password/${id}`:
      selectedTab = 3;
      break;
    // case `/apps/profiles/account/settings/${id}`:
    //   selectedTab = 4;
    //   break;
    case `/account/basic/${id}`:
    default:
      selectedTab = 0;
  }

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
            to={`/account/basic/${id}`}
            icon={<Profile />}
            iconPosition="start"
          />
          {/* <Tab
            label={intl.formatMessage({ id: 'edit' })}
            component={Link}
            to={`/account/edit-profile/${id}`}
            icon={<Edit />}
            iconPosition="start"
          /> */}
          <Tab
            label={intl.formatMessage({ id: 'network-activities' })}
            component={Link}
            to={`/account/history-used-internet/${id}`}
            icon={<DocumentText />}
            iconPosition="start"
          />
          <Tab
            label={intl.formatMessage({ id: 'history-order' })}
            component={Link}
            to={`/account/history-order/${id}`}
            icon={<TableDocument />}
            iconPosition="start"
          />
          {/* <Tab
            label={intl.formatMessage({ id: 'change-password' })}
            component={Link}
            to={`/account/change-password/${id}`}
            icon={<TableDocument />}
            iconPosition="start"
          /> */}
        </Tabs>
      </Box>
      <Box sx={{ mt: 2.5 }}>
        <Outlet />
      </Box>
    </MainCard>
  );
};

export default AccountProfile;
