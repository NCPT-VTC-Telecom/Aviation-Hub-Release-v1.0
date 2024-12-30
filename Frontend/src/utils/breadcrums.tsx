import { FormattedMessage } from 'react-intl';

interface BreadcrumbConfig {
  breadcrumbs: JSX.Element[];
  urls: string[];
}

const breadcrumbsConfig: { [key: string]: BreadcrumbConfig } = {
  //aircraft
  '/aircraft/profile': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="list-aircraft" />, <FormattedMessage id="aircraft-profile" />],
    urls: ['/', '/aviation-management/aircraft-list', '']
  },
  '/aircraft/history-flight': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="list-aircraft" />, <FormattedMessage id="aircraft-profile" />],
    urls: ['/', '/aviation-management/aircraft-list', '']
  },
  '/aircraft/maintenance-schedule': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="list-aircraft" />, <FormattedMessage id="aircraft-profile" />],
    urls: ['/', '/aviation-management/aircraft-list', '']
  },
  '/aircraft/installed-device': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="list-aircraft" />, <FormattedMessage id="aircraft-profile" />],
    urls: ['/', '/aviation-management/aircraft-list', '']
  },
  //flight
  '/flight/profile': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="list-flight" />, <FormattedMessage id="flight-profile" />],
    urls: ['/', '/aviation-management/flight-list', '']
  },
  '/flight/session-list': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="list-flight" />, <FormattedMessage id="flight-profile" />],
    urls: ['/', '/aviation-management/flight-list', '']
  },
  '/flight/history-activities-ifc': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="list-flight" />, <FormattedMessage id="flight-profile" />],
    urls: ['/', '/aviation-management/flight-list', '']
  },
  '/flight/report': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="list-flight" />, <FormattedMessage id="flight-profile" />],
    urls: ['/', '/aviation-management/flight-list', '']
  },
  //device
  '/device/profile': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="installed-device" />, <FormattedMessage id="device-profile" />],
    urls: ['/', '/devices-management/installed-device-list', '']
  },
  '/device/session-list': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="installed-device" />, <FormattedMessage id="device-profile" />],
    urls: ['/', '/devices-management/installed-device-list', '']
  },
  '/device/device-health': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="installed-device" />, <FormattedMessage id="device-profile" />],
    urls: ['/', '/devices-management/installed-device-list', '']
  },
  '/device/maintenance-schedule': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="installed-device" />, <FormattedMessage id="device-profile" />],
    urls: ['/', '/devices-management/installed-device-list', '']
  },
  //session
  '/session-management/session-detail': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="list-session" />, <FormattedMessage id="session-detail" />],
    urls: ['/', '/session-management/session-list', '']
  },
  '/account/basic': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="list-customer" />, <FormattedMessage id="customer-profile" />],
    urls: ['/', '/user-management/customer-list', '']
  },
  '/account/history-used-internet': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="list-customer" />, <FormattedMessage id="customer-profile" />],
    urls: ['/', '/user-management/customer-list', '']
  },
  '/account/history-flight': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="list-customer" />, <FormattedMessage id="customer-profile" />],
    urls: ['/', '/user-management/customer-list', '']
  },
  '/account/history-order': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="list-customer" />, <FormattedMessage id="customer-profile" />],
    urls: ['/', '/user-management/customer-list', '']
  },

  //provider
  '/package/profile': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="wifi-packages-list" />, <FormattedMessage id="package-profile" />],
    urls: ['/', '/packages-management/wifi-packages-list', '']
  },
  '/package/order-list': {
    breadcrumbs: [<FormattedMessage id="home" />, <FormattedMessage id="wifi-packages-list" />, <FormattedMessage id="package-profile" />],
    urls: ['/', '/packages-management/wifi-packages-list', '']
  },
  '/provider/profile': {
    breadcrumbs: [
      <FormattedMessage id="home" />,
      <FormattedMessage id="device-provider" />,
      <FormattedMessage id="device-provider-profile" />
    ],
    urls: ['/', '/provider-management/devices-provider-list', '']
  },
  '/provider/provider-product-list': {
    breadcrumbs: [
      <FormattedMessage id="home" />,
      <FormattedMessage id="device-provider" />,
      <FormattedMessage id="device-provider-profile" />
    ],
    urls: ['/', '/provider-management/devices-provider-list', '']
  }
};

export const getBreadcrumbs = (pathname: string) => {
  const matchingPath = Object.keys(breadcrumbsConfig).find((path) => pathname.includes(path));
  return matchingPath ? breadcrumbsConfig[matchingPath] : null;
};
