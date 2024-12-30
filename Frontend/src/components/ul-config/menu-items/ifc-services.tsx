// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { DocumentText, HomeWifi, ShieldSecurity, Devices, CloudConnection, Profile2User } from 'iconsax-react';
import { IconDeviceHealth, IconRestrictionDomain, IconLogs, IconBlockDevice, IconBlockUser } from 'components/atoms/icons';

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
  deviceHealth: IconDeviceHealth,
  restrictionDomain: IconRestrictionDomain,
  logs: IconLogs,
  restrictionDevice: IconBlockDevice,
  restrictionUser: IconBlockUser
};

const ifcServices: NavItemType = {
  id: 'ifc-services',
  title: <FormattedMessage id="ifc-services" />,
  type: 'group',
  children: [
    // {
    //   id: 'restriction-user-management',
    //   title: <FormattedMessage id="restriction-users-management" />,
    //   type: 'item',
    //   url: '/ifc-services/restriction-user-management',
    //   icon: icons.restrictionUser
    // },
    {
      id: 'restriction-device-management',
      title: <FormattedMessage id="restriction-devices-management" />,
      type: 'item',
      url: '/ifc-services/restriction-device-management',
      icon: icons.restrictionDevice
    },
    {
      id: 'restriction-domain-management',
      title: <FormattedMessage id="restriction-domain-management" />,
      type: 'item',
      url: '/ifc-services/restriction-domain-management',
      icon: icons.restrictionDomain
    }
    // {
    //   id: 'security-management',
    //   title: <FormattedMessage id="security-management" />,
    //   type: 'item',
    //   url: '/maintenance/coming-soon',
    //   icon: icons.servicesPerformance
    // },
    // {
    //   id: 'services-monitoring',
    //   title: <FormattedMessage id="services-monitoring" />,
    //   type: 'collapse',
    //   icon: icons.deviceHealth,
    //   children: [
    //     {
    //       id: 'monitor-network-performance',
    //       title: <FormattedMessage id="monitor-network-performance" />,
    //       type: 'item',
    //       url: '/maintenance/coming-soon'
    //     },
    //     {
    //       id: 'quality-of-service-monitoring',
    //       title: <FormattedMessage id="quality-of-service-monitoring" />,
    //       type: 'item',
    //       url: '/maintenance/coming-soon'
    //     },
    //     {
    //       id: 'monitor-security-indicators',
    //       title: <FormattedMessage id="monitor-security-indicators" />,
    //       type: 'item',
    //       url: '/maintenance/coming-soon'
    //     },
    //     {
    //       id: 'track-users-and-devices',
    //       title: <FormattedMessage id="track-users-and-devices" />,
    //       type: 'item',
    //       url: '/maintenance/coming-soon'
    //     },
    //     {
    //       id: 'monitor-system-and-device-indicators',
    //       title: <FormattedMessage id="monitor-system-and-device-indicators" />,
    //       type: 'item',
    //       url: '/maintenance/coming-soon'
    //     }
    //   ]
    // },
    // {
    //   id: 'logs-management',
    //   title: <FormattedMessage id="service-log" />,
    //   type: 'collapse',
    //   icon: icons.logs,
    //   children: [
    //     {
    //       id: 'user-access-log',
    //       title: <FormattedMessage id="user-access-log" />,
    //       type: 'item',
    //       url: '/maintenance/coming-soon'
    //     },
    //     {
    //       id: 'user-activity-log',
    //       title: <FormattedMessage id="user-activity-log" />,
    //       type: 'item',
    //       url: '/maintenance/coming-soon'
    //     },
    //     {
    //       id: 'network-performance-log',
    //       title: <FormattedMessage id="network-performance-log" />,
    //       type: 'item',
    //       url: '/maintenance/coming-soon'
    //     },
    //     {
    //       id: 'event-server-log',
    //       title: <FormattedMessage id="event-server-log" />,
    //       type: 'item',
    //       url: '/maintenance/coming-soon'
    //     },
    //     {
    //       id: 'security-log',
    //       title: <FormattedMessage id="security-log" />,
    //       type: 'item',
    //       url: '/maintenance/coming-soon'
    //     },
    //     {
    //       id: 'account-log',
    //       title: <FormattedMessage id="account-log" />,
    //       type: 'item',
    //       url: '/maintenance/coming-soon'
    //     }
    //   ]
    // }
  ]
};

export default ifcServices;
