// third-party
import { FormattedMessage } from 'react-intl';

// type
import { NavItemType } from 'types/menu';

//icon
import { AirplaneSquare, HomeTrendUp, DocumentCode } from 'iconsax-react';

const icons = {
  dashboard: HomeTrendUp,
  dashboardAircraft: AirplaneSquare,
  demoPage: DocumentCode
};

const dashboard: NavItemType = {
  id: 'dashboard',
  title: <FormattedMessage id="dashboard" />,
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="dashboard" />,
      url: '/dashboard',
      type: 'item',
      icon: icons.dashboard
    }
    // {
    //   id: 'aircraft-dashboard',
    //   title: <FormattedMessage id="aircraft-dashboard" />,
    //   url: '/aircraft-dashboard',
    //   type: 'item',
    //   icon: icons.dashboardAircraft
    // }
  ]
};

export default dashboard;
