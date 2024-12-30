// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { DocumentText1, HomeWifi } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

const icons = {
  statisticalReports: DocumentText1,
  servicesPerformance: HomeWifi
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const paymentManagement: NavItemType = {
  id: 'management',
  title: <FormattedMessage id="management" />,
  type: 'group',
  children: [
    {
      id: 'device-list',
      title: <FormattedMessage id="device-installed-list" />,
      type: 'item',
      url: '/devices-management/installed-device-list'
    },
    {
      id: 'device-monitoring',
      title: <FormattedMessage id="device-monitoring" />,
      type: 'item',
      url: '/devices-management/device-monitoring'
    },
    {
      id: 'device-provider',
      title: <FormattedMessage id="device-provider-list" />,
      type: 'item',
      url: '/provider-management/devices-provider-list'
    },
    {
      id: 'restriction-device-list',
      title: <FormattedMessage id="restriction-devices-list" />,
      type: 'item',
      url: '/restriction-management/restriction-devices-list'
    },
    {
      id: 'restriction-domain-list',
      title: <FormattedMessage id="restriction-domain-list" />,
      type: 'item',
      url: '/restriction-management/restriction-domain-list'
    },
    {
      id: 'statistical-report',
      title: <FormattedMessage id="statistical-report" />,
      type: 'collapse',
      icon: icons.statisticalReports,
      children: [
        {
          id: 'service-performance',
          title: <FormattedMessage id="service-performance" />,
          type: 'item',
          url: '/service-performance',
          icon: icons.servicesPerformance
        },
        {
          id: 'devices-health',
          title: <FormattedMessage id="device-health" />,
          type: 'item',
          url: '/statistical-report/device-health'
        }
      ]
    }
  ]
};

export default paymentManagement;
