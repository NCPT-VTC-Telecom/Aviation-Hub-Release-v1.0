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
  CardCoin,
  DirectboxReceive,
  Receipt21
} from 'iconsax-react';
import { IconCampaign, IconVendor, IconPackageWifi, IconPackageAirfare } from 'components/atoms/icons';

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
  transactionManagement: CardCoin,
  requestSupportPage: DirectboxReceive,
  billingManagement: Receipt21,
  campaign: IconCampaign,
  vendor: IconVendor,
  packageWifi: IconPackageWifi,
  packageAirfare: IconPackageAirfare
};

const salesSupport: NavItemType = {
  id: 'sale-support',
  title: <FormattedMessage id="sales-support" />,
  type: 'group',
  children: [
    {
      id: 'customer-management',
      title: <FormattedMessage id="customer-management" />,
      type: 'item',
      url: '/sale-support/customer-management',
      icon: icons.userManagement
    },
    {
      id: 'vendor-management',
      title: <FormattedMessage id="vendor-management" />,
      type: 'item',
      url: '/sale-support/vendor-management',
      icon: icons.vendor
    },
    {
      id: 'sale-channel-management',
      title: <FormattedMessage id="sale-channels-management" />,
      type: 'item',
      url: '/sale-support/sale-channel-management',
      icon: icons.saleChannelManagement
    },
    {
      id: 'wifi-package-management',
      title: <FormattedMessage id="wifi-packages-management" />,
      type: 'item',
      url: '/sale-support/wifi-package-management',
      icon: icons.packageWifi
    },
    // {
    //   id: 'telecommunication-bundle-management',
    //   title: <FormattedMessage id="telecommunication-bundle-management" />,
    //   type: 'item',
    //   url: '/sale-support/telecommunication-bundle-management'
    // },
    {
      id: 'airfare-bundle-management',
      title: <FormattedMessage id="airfare-bundle-management" />,
      type: 'item',
      url: '/sale-support/airfare-bundle-management',
      icon: icons.packageAirfare
    },
    {
      id: 'campaign-management',
      title: <FormattedMessage id="campaign-management" />,
      type: 'item',
      url: '/sale-support/campaign-management',
      icon: icons.campaign
    },
    {
      id: 'voucher-discount-management',
      title: <FormattedMessage id="vouchers-discount-management" />,
      type: 'item',
      url: '/sale-support/voucher-discount-management',
      icon: icons.promotionManagement
    },
    {
      id: 'voucher-redemp-management',
      title: <FormattedMessage id="vouchers-redemption-management" />,
      type: 'item',
      url: '/sale-support/voucher-redemp-management'
    },
    {
      id: 'request-support-management',
      title: <FormattedMessage id="request-support" />,
      type: 'item',
      url: '/sale-support/request-support-management',
      icon: icons.requestSupportPage
    }
  ]
};

export default salesSupport;
