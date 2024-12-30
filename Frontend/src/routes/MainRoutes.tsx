import { lazy } from 'react';

// project-imports
import MainLayout from 'layout/MainLayout';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import { ProtectedRoute } from 'hooks/useAccessCheck';

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/error/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon2')));

//Dashboard
const Dashboard = Loadable(lazy(() => import('pages/apps/dashboard')));
const AircraftPage = Loadable(lazy(() => import('pages/apps/aircraft-dashboard')));

//Performance
const ServicePage = Loadable(lazy(() => import('pages/apps/performance-group/service-performance')));
const SessionPage = Loadable(lazy(() => import('pages/apps/performance-group/session-performance')));
const RetailPage = Loadable(lazy(() => import('pages/apps/performance-group/retail-performance')));
const DataUsagePage = Loadable(lazy(() => import('pages/apps/performance-group/data-usage')));

//Management
//--Device
const ListDevicesPage = Loadable(lazy(() => import('pages/optimize-network-management/DeviceListPage')));
const DeviceMonitoringPage = Loadable(lazy(() => import('pages/optimize-network-management/device-monitoring')));

const DeviceProfilePage = Loadable(lazy(() => import('pages/apps/profiles/device')));
const DeviceProfileTab = Loadable(lazy(() => import('pages/apps/profiles/device/TabProfileDevice')));
const DeviceMaintenanceScheduleTab = Loadable(lazy(() => import('pages/apps/profiles/device/TabMaintenanceSchedule')));
const ListSessionDeviceTab = Loadable(lazy(() => import('pages/apps/profiles/device/TabSessionDevice')));
const DeviceHealthTab = Loadable(lazy(() => import('pages/apps/profiles/device/TabDeviceHealth')));

//--Plan
const ListPackagesProductPage = Loadable(lazy(() => import('pages/sales-support/packages-wifi-management')));
const ListPackagesTelecomPage = Loadable(lazy(() => import('pages/sales-support/bundle-telecom-management')));
const ListPackagesAirfarePage = Loadable(lazy(() => import('pages/sales-support/bundle-airfare-management')));

const PackageProfilePage = Loadable(lazy(() => import('pages/apps/profiles/package')));
const PackageProfileTab = Loadable(lazy(() => import('pages/apps/profiles/package/TabProfilePackage')));
const PackageOrderTab = Loadable(lazy(() => import('pages/apps/profiles/package/TabOrderPackages')));

//--Provider
const ListTelecomProviderPage = Loadable(lazy(() => import('pages/apps/management/supplier/list-telecommunications')));
const ListDeviceProviderPage = Loadable(lazy(() => import('pages/apps/management/supplier/list-device-provider')));

const ProviderProfilePage = Loadable(lazy(() => import('pages/apps/profiles/provider')));
const ProviderProfileTab = Loadable(lazy(() => import('pages/apps/profiles/provider/TabProfileProvider')));
const ProviderProductTab = Loadable(lazy(() => import('pages/apps/profiles/provider/TabProductProvider')));

//--Account
const ListAdminPage = Loadable(lazy(() => import('pages/apps/management/user/list-admin')));
const ListCustomerPage = Loadable(lazy(() => import('pages/sales-support/customer-management')));
const ListRolePage = Loadable(lazy(() => import('pages/service-management/list-role')));

//--Session
const ListSessionPage = Loadable(lazy(() => import('pages/apps/management/session/list-session')));
const SessionProfilePage = Loadable(lazy(() => import('pages/apps/profiles/session')));

//--Voucher
const ListVouchersPublishedPage = Loadable(lazy(() => import('pages/sales-support/VoucherDiscountManagement')));
const ListVouchersRedemptionPage = Loadable(lazy(() => import('pages/sales-support/VoucherRedemptionManagement')));
const ListLogsPage = Loadable(lazy(() => import('pages/apps/management/systems/list-logs')));
const CampaignListPage = Loadable(lazy(() => import('pages/sales-support/CampaignManagement')));

//--Aviation
const FlightProfilePage = Loadable(lazy(() => import('pages/apps/profiles/flight')));
const FlightProfileTab = Loadable(lazy(() => import('pages/apps/profiles/flight/TabProfileFlight')));
const ListSessionTab = Loadable(lazy(() => import('pages/apps/profiles/flight/TabSessionAircraft')));
const HistoryActivitiesIFCTab = Loadable(lazy(() => import('pages/apps/profiles/flight/TabHistoryIFC')));
const FlightReportTab = Loadable(lazy(() => import('pages/apps/profiles/flight/TabReport')));
const FlightListPage = Loadable(lazy(() => import('pages/service-management/FlightManagement')));

//Airline
const AirlineListPage = Loadable(lazy(() => import('pages/service-management/AirlineManagement')));

//Aircraft
const ListAircraftPage = Loadable(lazy(() => import('pages/service-management/list-aircraft')));
const AircraftProfilePage = Loadable(lazy(() => import('pages/apps/profiles/aircraft')));
const AircraftProfileTab = Loadable(lazy(() => import('pages/apps/profiles/aircraft/TabProfileAircraft')));
const HistoryFlightTab = Loadable(lazy(() => import('pages/apps/profiles/aircraft/TabFlightHistory')));
const InstalledDeviceTab = Loadable(lazy(() => import('pages/apps/profiles/aircraft/TabInstalledDevice')));
const MaintenanceScheduleTab = Loadable(lazy(() => import('pages/apps/profiles/aircraft/TabMaintenanceSchedule')));

//--Payment gateway
const ListGatewayPage = Loadable(lazy(() => import('pages/apps/management/payment/list-gateway')));
const ListSaleChannelPage = Loadable(lazy(() => import('pages/sales-support/SaleChannelManagement')));
const ListPaymentMethodPage = Loadable(lazy(() => import('pages/sales-support/payment-method-management')));

//--Order
const ListOrderPage = Loadable(lazy(() => import('pages/service-management/order/list-order')));
const CreateOrderPage = Loadable(lazy(() => import('pages/service-management/order/create-order/create')));
const EditOrderPage = Loadable(lazy(() => import('pages/service-management/order/edit-order/edit')));
const DetailsOrderPage = Loadable(lazy(() => import('pages/service-management/order/details-order/details')));

//Billing
const ListBillingPage = Loadable(lazy(() => import('pages/service-management/BillingManagement')));
const ListTransactionPage = Loadable(lazy(() => import('pages/service-management/TransactionManagement')));

//Profile
const AccountProfile = Loadable(lazy(() => import('pages/apps/profiles/account')));
const AccountTabProfile = Loadable(lazy(() => import('pages/apps/profiles/account/TabProfile')));
// const AccountTabEditProfile = Loadable(lazy(() => import('pages/apps/profiles/account/TabEditProfile')));
const AccountTabHistoryOrder = Loadable(lazy(() => import('pages/apps/profiles/account/TabHistoryOrder')));
const AccountTabUsedInternetHistory = Loadable(lazy(() => import('pages/apps/profiles/account/TabUsedInternetHistory')));

// const AccountTabAccount = Loadable(lazy(() => import('sections/profiles/account/TabAccount')));
const AccountTabPassword = Loadable(lazy(() => import('pages/apps/profiles/account/TabPassword')));
const AccountTabRole = Loadable(lazy(() => import('pages/apps/profiles/account/TabRole')));
const AccountTabSettings = Loadable(lazy(() => import('pages/apps/profiles/account/TabSettings')));

//Statistical report
// const ReportDataUsagePage = Loadable(lazy(() => import('pages/apps/statistical-report/report-data-usage')));
// const ReportRetailSalesPage = Loadable(lazy(() => import('pages/apps/statistical-report/report-retail-performance')));
const ReportDeviceHealthPage = Loadable(lazy(() => import('pages/apps/statistical-report/report-devices-health')));
// const StatisticalReportPage = Loadable(lazy(() => import('pages/apps/statistical-report')));

//Customer Services
const CustomerServicesPage = Loadable(lazy(() => import('pages/apps/customer-services')));

//Restriction
const ListRestrictionDevices = Loadable(lazy(() => import('pages/ifc-services/RestrictionDevice')));
const ListRestrictionDomain = Loadable(lazy(() => import('pages/ifc-services/RestrictionDomain')));
const ListRestrictionUser = Loadable(lazy(() => import('pages/ifc-services/RestrictionUser')));

//Vendor
const ListVendorPage = Loadable(lazy(() => import('pages/sales-support/vendor-management')));

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'dashboard',
          element: <Dashboard />
        },
        {
          path: 'aircraft-dashboard',
          element: <AircraftPage />
        },
        {
          path: 'ifc-services',
          children: [
            {
              path: 'restriction-user-management',
              element: <ProtectedRoute path="ifc-services/restriction-user-management" element={ListRestrictionUser} />
            },
            {
              path: 'restriction-device-management',
              element: <ProtectedRoute path="ifc-services/restriction-device-management" element={ListRestrictionDevices} />
            },
            {
              path: 'restriction-domain-management',
              element: <ProtectedRoute path="ifc-services/restriction-domain-management" element={ListRestrictionDomain} />
            }
          ]
        },
        {
          path: 'sale-support',
          children: [
            {
              path: 'wifi-package-management',
              element: <ProtectedRoute path="sale-support/wifi-package-management" element={ListPackagesProductPage} />
            },
            {
              path: 'telecommunication-bundle-management',
              element: <ProtectedRoute path="sale-support/telecommunication-bundle-management" element={ListPackagesTelecomPage} />
            },
            {
              path: 'airfare-bundle-management',
              element: <ProtectedRoute path="sale-support/airfare-bundle-management" element={ListPackagesAirfarePage} />
            },
            {
              path: 'customer-management',
              element: <ProtectedRoute path="sale-support/customer-management" element={ListCustomerPage} />
            },
            {
              path: 'sale-channel-management',
              element: <ProtectedRoute path="sale-support/sale-channel-management" element={ListSaleChannelPage} />
            },
            {
              path: 'vendor-management',
              element: <ProtectedRoute path="sale-support/vendor-management" element={ListVendorPage} />
            },
            {
              path: 'request-support-management',
              element: <ProtectedRoute path="sale-support/request-support-management" element={CustomerServicesPage} />
            },
            {
              path: 'voucher-discount-management',
              element: <ProtectedRoute path="sale-support/voucher-discount-management" element={ListVouchersPublishedPage} />
            },
            {
              path: 'voucher-redemp-management',
              element: <ProtectedRoute path="sale-support/voucher-redemp-management" element={ListVouchersRedemptionPage} />
            },
            {
              path: 'campaign-management',
              element: <ProtectedRoute path="sale-support/campaign-management" element={CampaignListPage} />
            }
          ]
        },
        {
          path: 'services-management',
          children: [
            {
              path: 'aircraft-management',
              element: <ProtectedRoute path="services-management/aircraft-management" element={ListAircraftPage} />
            },
            {
              path: 'flight-management',
              element: <ProtectedRoute path="services-management/flight-management" element={FlightListPage} />
            },
            {
              path: 'airline-management',
              element: <ProtectedRoute path="services-management/airline-management" element={AirlineListPage} />
            },
            {
              path: 'admin-management',
              element: <ProtectedRoute path="services-management/admin-management" element={ListAdminPage} />
            },
            {
              path: 'role-management',
              element: <ProtectedRoute path="services-management/role-management" element={ListRolePage} />
            },
            {
              path: 'billing-management',
              element: <ProtectedRoute path="services-management/billing-management" element={ListBillingPage} />
            },
            {
              path: 'transaction-management',
              element: <ProtectedRoute path="services-management/transaction-management" element={ListTransactionPage} />
            }
          ]
        },
        {
          path: 'management-optimize-network',
          children: [
            {
              path: 'session-performance',
              element: <ProtectedRoute path="management-optimize-network/session-performance" element={SessionPage} />
            },
            {
              path: 'service-performance',
              element: <ProtectedRoute path="management-optimize-network/service-performance" element={ServicePage} />
            },
            {
              path: 'retail-performance',
              element: <ProtectedRoute path="management-optimize-network/retail-performance" element={RetailPage} />
            },
            {
              path: 'data-usage',
              element: <ProtectedRoute path="management-optimize-network/data-usage" element={DataUsagePage} />
            },
            {
              path: 'device-management',
              element: <ProtectedRoute path="management-optimize-network/device-management" element={ListDevicesPage} />
            },
            {
              path: 'device-monitoring',
              element: <ProtectedRoute path="management-optimize-network/device-monitoring" element={DeviceMonitoringPage} />
            },
            {
              path: 'device-health',
              element: <ProtectedRoute path="management-optimize-network/device-health" element={ReportDeviceHealthPage} />
            },
            {
              path: 'telecom-provider',
              element: <ProtectedRoute path="management-optimize-network/telecom-provider" element={ListTelecomProviderPage} />
            },
            {
              path: 'device-provider',
              element: <ProtectedRoute path="management-optimize-network/device-provider" element={ListDeviceProviderPage} />
            },
            {
              path: 'session-management',
              element: <ProtectedRoute path="management-optimize-network/session-management" element={ListSessionPage} />
            },
            {
              path: 'session-detail/:sessionID',
              element: <SessionProfilePage />
            }
          ]
        },
        {
          path: 'order-management',
          children: [
            {
              path: 'order-list',
              element: <ListOrderPage />
            },
            {
              path: 'create-order',
              element: <CreateOrderPage />
            },
            {
              path: 'edit-order',
              element: <EditOrderPage />
            },
            {
              path: 'details-order/:orderNumber',
              element: <DetailsOrderPage />
            }
          ]
        },
        {
          path: 'logs-list',
          element: <ListLogsPage />
        },
        {
          path: 'payment-management',
          children: [
            {
              path: 'gateway-list',
              element: <ListGatewayPage />
            },
            {
              path: 'payment-method-list',
              element: <ListPaymentMethodPage />
            }
          ]
        },
        //Profile
        {
          path: 'flight',
          element: <FlightProfilePage />,
          children: [
            {
              path: 'profile/:flightNumber',
              element: <FlightProfileTab />
            },
            {
              path: 'session-list/:flightNumber',
              element: <ListSessionTab />
            },
            {
              path: 'history-activities-ifc/:flightNumber',
              element: <HistoryActivitiesIFCTab />
            },
            {
              path: 'report/:flightNumber',
              element: <FlightReportTab />
            }
          ]
        },
        {
          path: 'package',
          element: <PackageProfilePage />,
          children: [
            {
              path: 'profile/:params',
              element: <PackageProfileTab />
            },
            {
              path: 'order-list/:params',
              element: <PackageOrderTab />
            }
          ]
        },
        {
          path: 'provider',
          element: <ProviderProfilePage />,
          children: [
            {
              path: 'profile/:providerID',
              element: <ProviderProfileTab />
            },
            {
              path: 'provider-product-list/:providerID',
              element: <ProviderProductTab />
            }
          ]
        },
        {
          path: 'device',
          element: <DeviceProfilePage />,
          children: [
            {
              path: 'profile/:deviceID',
              element: <DeviceProfileTab />
            },
            {
              path: 'maintenance-schedule/:deviceID',
              element: <DeviceMaintenanceScheduleTab />
            },
            {
              path: 'session-list/:deviceID',
              element: <ListSessionDeviceTab />
            },
            {
              path: 'device-health/:deviceID',
              element: <DeviceHealthTab />
            }
          ]
        },
        {
          path: 'aircraft',
          element: <AircraftProfilePage />,
          children: [
            {
              path: 'profile/:tailNumber',
              element: <AircraftProfileTab />
            },
            {
              path: 'history-flight/:tailNumber',
              element: <HistoryFlightTab />
            },
            {
              path: 'installed-device/:tailNumber',
              element: <InstalledDeviceTab />
            },
            {
              path: 'maintenance-schedule/:tailNumber',
              element: <MaintenanceScheduleTab />
            }
          ]
        },
        {
          path: 'account/',
          element: <AccountProfile />,
          children: [
            {
              path: 'basic/:id',
              element: <AccountTabProfile />
            },
            // {
            //   path: 'edit-profile/:id',
            //   element: <AccountTabEditProfile />
            // },
            {
              path: 'history-used-internet/:id',
              element: <AccountTabUsedInternetHistory />
            },
            {
              path: 'history-order/:id',
              element: <AccountTabHistoryOrder />
            },
            {
              path: 'change-password/:id',
              element: <AccountTabPassword />
            },
            {
              path: 'role',
              element: <AccountTabRole />
            },
            {
              path: 'settings',
              element: <AccountTabSettings />
            }
          ]
        },
        {
          path: 'page-demo'
          // element: <DemoPage />
        }
      ]
    },
    //Maintenance
    {
      path: '/maintenance',
      element: <CommonLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    },
    {
      path: '*',
      element: <MaintenanceError />
    }
  ]
};

export default MainRoutes;
