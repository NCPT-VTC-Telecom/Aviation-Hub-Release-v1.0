// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  DocumentText,
  Box1,
  Shop,
  HomeWifi,
  ShieldSecurity,
  Devices,
  CloudConnection,
  Profile2User,
  TicketDiscount,
  Cards,
  ShoppingCart,
  TableDocument,
  Airplane,
  Data,
  Buildings,
  MonitorRecorder
} from 'iconsax-react';
import { IconSatellite, IconServer, IconDeviceHealth } from 'components/atoms/icons';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  listLogs: DocumentText,
  servicesPerformance: HomeWifi,
  restrictionManagement: ShieldSecurity,
  devicesManagement: Devices,
  sessionManagement: CloudConnection,
  userManagement: Profile2User,
  retailPerformance: Cards,
  promotionManagement: TicketDiscount,
  saleChannelManagement: Shop,
  packagesManagement: Box1,
  orderManagement: ShoppingCart,
  transactionManagement: TableDocument,
  aviationManagement: Airplane,
  sessionPerformance: CloudConnection,
  dataUsage: Data,
  supplierManagement: Buildings,
  devicesMonitoring: MonitorRecorder,
  servicesSatelliteProvider: IconSatellite,
  server: IconServer,
  deviceHeath: IconDeviceHealth
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const managementOptimizeNetwork: NavItemType = {
  id: 'management-optimize-network',
  title: <FormattedMessage id="management-optimize-network" />,
  type: 'group',
  children: [
    {
      id: 'aaa-server',
      title: <FormattedMessage id="aaa-server" />,
      type: 'item',
      url: '/management-optimize-network/aaa-server',
      icon: icons.server
    },
    {
      id: 'service-performance',
      title: <FormattedMessage id="service-performance" />,
      type: 'item',
      url: '/management-optimize-network/service-performance',
      icon: icons.servicesPerformance
    },
    {
      id: 'session-performance',
      title: <FormattedMessage id="session-performance" />,
      type: 'item',
      url: '/management-optimize-network/session-performance',
      icon: icons.sessionPerformance
    },
    {
      id: 'data-usage',
      title: <FormattedMessage id="data-usage" />,
      type: 'item',
      url: '/management-optimize-network/data-usage',
      icon: icons.dataUsage
    },
    {
      id: 'retail-performance',
      title: <FormattedMessage id="retail-performance" />,
      type: 'item',
      url: '/management-optimize-network/retail-performance',
      icon: icons.retailPerformance
    },
    {
      id: 'device-health',
      title: <FormattedMessage id="device-health" />,
      type: 'item',
      url: '/management-optimize-network/device-health',
      icon: icons.deviceHeath
    },
    {
      id: 'device-management',
      title: <FormattedMessage id="device-installed-management" />,
      type: 'item',
      url: '/management-optimize-network/device-management',
      icon: icons.devicesManagement
    },
    {
      id: 'device-monitoring',
      title: <FormattedMessage id="device-monitoring" />,
      type: 'item',
      url: '/management-optimize-network/device-monitoring',
      icon: icons.devicesMonitoring
    },
    {
      id: 'session-management',
      title: <FormattedMessage id="session-management" />,
      type: 'item',
      url: '/management-optimize-network/session-management',
      icon: icons.sessionManagement
    },
    {
      id: 'device-provider',
      title: <FormattedMessage id="services-provider-management" />,
      type: 'item',
      url: '/management-optimize-network/device-provider',
      icon: icons.servicesSatelliteProvider
    },
    {
      id: 'telecom-provider',
      title: <FormattedMessage id="telecom-provider-management" />,
      type: 'item',
      url: '/management-optimize-network/telecom-provider',
      icon: icons.supplierManagement
    }
  ]
};

export default managementOptimizeNetwork;
