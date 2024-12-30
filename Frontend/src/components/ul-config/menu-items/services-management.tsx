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
  Receipt21
} from 'iconsax-react';
import { IconPermission, IconDeviceHealth, IconFlight, IconTailAirplane } from 'components/atoms/icons';

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
  billingManagement: Receipt21,
  deviceHeath: IconDeviceHealth,
  permission: IconPermission,
  flight: IconFlight,
  airline: IconTailAirplane
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const serviceManagement: NavItemType = {
  id: 'services-management',
  title: <FormattedMessage id="services-management" />,
  type: 'group',
  children: [
    {
      id: 'flight-management',
      title: <FormattedMessage id="flight-management" />,
      type: 'item',
      url: '/services-management/flight-management',
      icon: icons.flight
    },
    {
      id: 'aircraft-management',
      title: <FormattedMessage id="aircraft-management" />,
      type: 'item',
      url: '/services-management/aircraft-management',
      icon: icons.aviationManagement
    },
    {
      id: 'airline-management',
      title: <FormattedMessage id="airline-management" />,
      type: 'item',
      url: '/services-management/airline-management',
      icon: icons.airline
    },

    {
      id: 'role-management',
      title: <FormattedMessage id="role-management" />,
      type: 'item',
      url: '/services-management/role-management',
      icon: icons.permission
    },
    {
      id: 'order-management',
      title: <FormattedMessage id="order-management" />,
      type: 'item',
      url: '/order-management/order-list',
      icon: icons.orderManagement
    },
    {
      id: 'billing-management',
      title: <FormattedMessage id="billing-management" />,
      type: 'item',
      url: '/services-management/billing-management',
      icon: icons.billingManagement
    },
    {
      id: 'transaction-management',
      title: <FormattedMessage id="transaction-management" />,
      type: 'item',
      url: '/services-management/transaction-management',
      icon: icons.transactionManagement
    }
  ]
};

export default serviceManagement;
