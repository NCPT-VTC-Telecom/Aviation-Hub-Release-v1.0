// third-party
import { FormattedMessage } from 'react-intl';

// assets
// import {
//   Devices,
//   Box1,
//   Buildings,
//   Profile2User,
//   TicketDiscount,
//   SmartHome,
//   Airplane,
//   CloudConnection,
//   ShoppingCart,
//   Card,
//   TableDocument,
//   DocumentText,
//   ShieldSecurity,
//   Shop,
//   UserTag
// } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// icons
// const icons = {
//   supplierManagement: Buildings,
//   telecommunicationsManagement: SmartHome,
//   devicesManagement: Devices,
//   packagesManagement: Box1,
//   userManagement: Profile2User,
//   promotionManagement: TicketDiscount,
//   aviationManagement: Airplane,
//   sessionManagement: CloudConnection,
//   orderManagement: ShoppingCart,
//   paymentManagement: Card,
//   transactionManagement: TableDocument,
//   logsManagement: DocumentText,
//   restrictionManagement: ShieldSecurity,
//   saleChannelManagement: Shop,
//   vendorManagement: UserTag
// };

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const management: NavItemType = {
  id: 'aircraft-management',
  title: <FormattedMessage id="aircraft-management" />,
  type: 'group',
  children: [
    {
      id: 'flight-list',
      title: <FormattedMessage id="list-flight" />,
      type: 'item',
      url: '/aviation-management/flight-list'
    },
    {
      id: 'aircraft-list',
      title: <FormattedMessage id="list-aircraft" />,
      type: 'item',
      url: '/aviation-management/aircraft-list'
    },
    {
      id: 'airfare-list',
      title: <FormattedMessage id="airfare-list" />,
      type: 'item',
      url: '/aviation-management/airfare-list'
    }
  ]
};

export default management;
