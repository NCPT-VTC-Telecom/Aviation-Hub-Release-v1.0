// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { DirectboxReceive } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  requestSupportPage: DirectboxReceive
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const support: NavItemType = {
  id: 'customer-services',
  title: <FormattedMessage id="customer-services" />,
  type: 'group',
  children: [
    {
      id: 'request-support-list',
      title: <FormattedMessage id="request-support" />,
      type: 'item',
      icon: icons.requestSupportPage,
      url: '/customer-services/request-support'
    }
  ]
};

export default support;
