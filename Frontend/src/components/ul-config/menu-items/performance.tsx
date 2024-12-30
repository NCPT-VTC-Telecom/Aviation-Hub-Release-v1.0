// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Cards, Data, CloudConnection, HomeWifi, DocumentText1 } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  sessionPerformance: CloudConnection,
  servicesPerformance: HomeWifi,
  dataUsage: Data,
  retailPerformance: Cards,
  statisticalReports: DocumentText1
};

const performance: NavItemType = {
  id: 'performance',
  title: <FormattedMessage id="performance" />,
  type: 'group',
  children: [
    {
      id: 'service-performance',
      title: <FormattedMessage id="service-performance" />,
      type: 'item',
      url: '/service-performance',
      icon: icons.servicesPerformance
    },
    {
      id: 'session-performance',
      title: <FormattedMessage id="session-performance" />,
      type: 'item',
      url: '/session-performance',
      icon: icons.sessionPerformance
    },
    {
      id: 'retail-performance',
      title: <FormattedMessage id="retail-performance" />,
      type: 'item',
      url: '/retail-performance',
      icon: icons.retailPerformance
    },
    {
      id: 'data-usage',
      title: <FormattedMessage id="data-usage" />,
      type: 'item',
      url: '/data-usage',
      icon: icons.dataUsage
    },
    {
      id: 'statistical-report',
      title: <FormattedMessage id="statistical-report" />,
      type: 'collapse',
      icon: icons.statisticalReports,
      children: [
        // {
        //   id: 'total-retail-sales',
        //   title: <FormattedMessage id="total-retail-sales" />,
        //   type: 'item',
        //   url: '/statistical-report/total-retail-sales'
        // },
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

export default performance;
