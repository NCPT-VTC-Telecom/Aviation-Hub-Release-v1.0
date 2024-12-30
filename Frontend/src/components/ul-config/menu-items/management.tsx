// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  Devices,
  Box1,
  Buildings,
  Profile2User,
  TicketDiscount,
  SmartHome,
  Airplane,
  CloudConnection,
  ShoppingCart,
  Card,
  TableDocument,
  DocumentText,
  ShieldSecurity,
  Shop,
  UserTag
} from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  supplierManagement: Buildings,
  telecommunicationsManagement: SmartHome,
  devicesManagement: Devices,
  packagesManagement: Box1,
  userManagement: Profile2User,
  promotionManagement: TicketDiscount,
  aviationManagement: Airplane,
  sessionManagement: CloudConnection,
  orderManagement: ShoppingCart,
  paymentManagement: Card,
  transactionManagement: TableDocument,
  logsManagement: DocumentText,
  restrictionManagement: ShieldSecurity,
  saleChannelManagement: Shop,
  vendorManagement: UserTag
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const management: NavItemType = {
  id: 'management',
  title: <FormattedMessage id="management" />,
  type: 'group',
  children: [
    {
      id: 'aircraft-and-flight-management',
      title: <FormattedMessage id="aircraft-and-flight-management" />,
      type: 'collapse',
      icon: icons.aviationManagement,
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
        },
        {
          id: 'airline-list',
          title: <FormattedMessage id="airline-list" />,
          type: 'item',
          url: '/aviation-management/airline-list'
        }
      ]
    },
    {
      id: 'devices-management',
      title: <FormattedMessage id="devices-management" />,
      type: 'collapse',
      icon: icons.devicesManagement,
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
        }
      ]
    },
    {
      id: 'package-management',
      title: <FormattedMessage id="package-management" />,
      type: 'collapse',
      icon: icons.packagesManagement,
      children: [
        {
          id: 'wifi-package-list',
          title: <FormattedMessage id="wifi-packages-list" />,
          type: 'item',
          url: '/packages-management/wifi-packages-list'
        },
        {
          id: 'telecommunication-package-list',
          title: <FormattedMessage id="telecommunication-package-list" />,
          type: 'item',
          url: '/packages-management/telecommunication-package-list'
        },
        {
          id: 'airfare-package-list',
          title: <FormattedMessage id="airfare-package-list" />,
          type: 'item',
          url: '/packages-management/airfare-package-list'
        }
      ]
    },
    {
      id: 'supplier-management',
      title: <FormattedMessage id="supplier-management" />,
      type: 'collapse',
      icon: icons.supplierManagement,
      children: [
        {
          id: 'device-provider',
          title: <FormattedMessage id="device-provider-list" />,
          type: 'item',
          url: '/provider-management/devices-provider-list'
        },
        {
          id: 'telecommunications-provider',
          title: <FormattedMessage id="telecom-provider-list" />,
          type: 'item',
          url: '/provider-management/telecommunications-provider-list'
        }
      ]
    },
    {
      id: 'user-management',
      title: <FormattedMessage id="user-management" />,
      type: 'collapse',
      icon: icons.userManagement,
      children: [
        {
          id: 'customer-list',
          title: <FormattedMessage id="list-customer" />,
          type: 'item',
          url: '/user-management/customer-list'
        },
        {
          id: 'admin-list',
          title: <FormattedMessage id="list-admin" />,
          type: 'item',
          url: '/user-management/admin-list'
        },
        {
          id: 'role-list',
          title: <FormattedMessage id="list-role" />,
          type: 'item',
          url: '/user-management/role-list'
        }
      ]
    },
    {
      id: 'session-management',
      title: <FormattedMessage id="session-management" />,
      type: 'collapse',
      icon: icons.sessionManagement,
      children: [
        {
          id: 'session-list',
          title: <FormattedMessage id="list-session" />,
          type: 'item',
          url: '/session-management/session-list'
        }
        // {
        //   id: 'list-session-activities',
        //   title: <FormattedMessage id="list-session-activities" />,
        //   type: 'item',
        //   url: '/session-management/session-activities-list'
        // }
      ]
    },
    {
      id: 'order-management',
      title: <FormattedMessage id="order-management" />,
      type: 'collapse',
      icon: icons.orderManagement,
      children: [
        {
          id: 'order-list',
          title: <FormattedMessage id="list-order" />,
          type: 'item',
          url: '/order-management/order-list'
        }
      ]
    },
    {
      id: 'transaction-management',
      title: <FormattedMessage id="transaction-management" />,
      type: 'collapse',
      icon: icons.transactionManagement,
      children: [
        {
          id: 'billing-list',
          title: <FormattedMessage id="list-billing" />,
          type: 'item',
          url: '/transaction-management/billing-list'
        },
        {
          id: 'transaction-list',
          title: <FormattedMessage id="list-transaction" />,
          type: 'item',
          url: '/transaction-management/transaction-list'
        }
      ]
    },
    {
      id: 'payment-management',
      title: <FormattedMessage id="payment-management" />,
      type: 'collapse',
      icon: icons.paymentManagement,
      children: [
        {
          id: 'gateway-list',
          title: <FormattedMessage id="list-gateway" />,
          type: 'item',
          url: '/payment-management/gateway-list'
        },
        {
          id: 'list-payment-method',
          title: <FormattedMessage id="list-payment-method" />,
          type: 'item',
          url: '/payment-management/payment-method-list'
        }
      ]
    },
    {
      id: 'sale-channels-management',
      title: <FormattedMessage id="sale-channels-management" />,
      type: 'collapse',
      icon: icons.saleChannelManagement,
      children: [
        {
          id: 'sale-channel-list',
          title: <FormattedMessage id="sale-channels-list" />,
          type: 'item',
          url: '/sale-channel-management/sale-channels-list'
        }
      ]
    },
    {
      id: 'vendor-management',
      title: <FormattedMessage id="vendor-management" />,
      type: 'collapse',
      icon: icons.vendorManagement,
      children: [
        {
          id: 'vendor-list',
          title: <FormattedMessage id="vendor-list" />,
          type: 'item',
          url: '/vendor-management/vendor-list'
        }
      ]
    },
    {
      id: 'promotion-management',
      title: <FormattedMessage id="promotion-management" />,
      type: 'collapse',
      icon: icons.promotionManagement,
      children: [
        {
          id: 'voucher-discount-list',
          title: <FormattedMessage id="vouchers-discount-list" />,
          type: 'item',
          url: '/promotion-management/vouchers-discount-list'
        },
        {
          id: 'voucher-redemption-list',
          title: <FormattedMessage id="vouchers-redemption-list" />,
          type: 'item',
          url: '/promotion-management/vouchers-redemption-list'
        },
        {
          id: 'campaign-list',
          title: <FormattedMessage id="campaign-list" />,
          type: 'item',
          url: '/promotion-management/campaign-list'
        }
      ]
    },
    {
      id: 'restriction-management',
      title: <FormattedMessage id="restriction-management" />,
      type: 'collapse',
      icon: icons.restrictionManagement,
      children: [
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
        }
      ]
    }
  ]
};

export default management;
