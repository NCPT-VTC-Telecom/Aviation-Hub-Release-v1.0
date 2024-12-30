// import { useState, MouseEvent } from 'react';

// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import {
  // Edit2,
  Logout
  // , Profile
} from 'iconsax-react';
import { useIntl } from 'react-intl';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

interface Props {
  handleLogout: () => void;
}

const ProfileTab = ({ handleLogout }: Props) => {
  // const [selectedIndex, setSelectedIndex] = useState(0);
  const intl = useIntl();
  // const handleListItemClick = (event: MouseEvent<HTMLDivElement>, index: number) => {
  //   setSelectedIndex(index);
  // };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      {/* <ListItemButton selected={selectedIndex === 0} onClick={(event: MouseEvent<HTMLDivElement>) => handleListItemClick(event, 0)}>
        <ListItemIcon>
          <Edit2 variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary={intl.formatMessage({ id: 'edit-profile' })} />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 1} onClick={(event: MouseEvent<HTMLDivElement>) => handleListItemClick(event, 1)}>
        <ListItemIcon>
          <Profile variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary={intl.formatMessage({ id: 'view-profile' })} />
      </ListItemButton> */}

      {/* <ListItemButton selected={selectedIndex === 4} onClick={(event: MouseEvent<HTMLDivElement>) => handleListItemClick(event, 4)}>
        <ListItemIcon>
          <Card variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Billing" />
      </ListItemButton> */}

      <ListItemButton
        // selected={selectedIndex === 2}
        onClick={handleLogout}
      >
        <ListItemIcon>
          <Logout variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary={intl.formatMessage({ id: 'logout' })} />
      </ListItemButton>
    </List>
  );
};

export default ProfileTab;
