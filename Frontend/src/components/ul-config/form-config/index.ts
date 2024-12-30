import { FieldConfig } from 'types';

export const endUserFields: FieldConfig[] = [
  { name: 'fullname', label: 'Full Name', type: 'text', placeholder: 'Enter full name', required: true, md: 6 },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter email', required: true, md: 6 },
  { name: 'phoneNumber', label: 'Phone Number', type: 'text', placeholder: 'Enter phone number', required: true, md: 6 },
  { name: 'citizenId', label: 'Citizen ID', type: 'text', placeholder: 'Enter citizen ID', md: 6 },
  { name: 'address', label: 'Address', type: 'text', placeholder: 'Enter address', required: true, md: 6 },
  { name: 'ward', label: 'Ward', type: 'text', placeholder: 'Enter ward', required: true, md: 6 },
  { name: 'district', label: 'District', type: 'text', placeholder: 'Enter district', required: true, md: 6 },
  { name: 'province', label: 'Province', type: 'text', placeholder: 'Enter province', required: true, md: 6 },
  { name: 'country', label: 'Country', type: 'text', placeholder: 'Enter country', required: true, md: 6 },
  { name: 'postcode', label: 'Postcode', type: 'text', placeholder: 'Enter postcode', md: 6 },
  { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter username', required: true, md: 6 },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter password', required: true, md: 6 }
];

// Example configuration for device form
export const deviceFields: FieldConfig[] = [
  { name: 'name', label: 'device-name', type: 'text', placeholder: 'enter-device-name', required: true, md: 6 },
  { name: 'firmware', label: 'firmware', type: 'text', placeholder: 'enter-firmware', required: true, md: 6 },
  {
    name: 'wifiStandard',
    label: 'wifi-standard',
    type: 'select',
    placeholder: 'enter-wifi-standard',
    required: true,
    md: 6,
    options: [
      {
        label: '802.11a',
        value: '802.11a'
      },
      {
        label: '802.11b',
        value: '802.11b'
      },
      {
        label: '802.11g',
        value: '802.11g'
      },
      {
        label: '802.11n',
        value: '802.11n'
      },
      {
        label: '802.11ac',
        value: '802.11ac'
      },
      {
        label: '802.11ax',
        value: '802.11ax'
      },
      {
        label: '802.11be',
        value: '802.11be'
      }
    ]
  },
  { name: 'ipAddress', label: 'ip-address', type: 'text', placeholder: 'enter-ip-address', md: 6 },
  { name: 'ipv6Address', label: 'ipv6-address', type: 'text', placeholder: 'enter-ipv6-address', md: 6 },
  { name: 'port', label: 'port', type: 'text', placeholder: 'enter-port', md: 6 },
  { name: 'macAddress', label: 'mac-address', type: 'text', placeholder: 'enter-mac-address', md: 6, required: true },
  { name: 'cpuType', label: 'cpu-type', type: 'text', placeholder: 'enter-cpu-type', md: 6 },
  { name: 'model', label: 'model', type: 'text', placeholder: 'enter-model', md: 6 },
  { name: 'idTypeDevice', label: 'device-type', type: 'select', options: [], required: true, md: 6, placeholder: 'select-device-type' },
  { name: 'manufacturer', label: 'manufacturer', type: 'text', placeholder: 'enter-manufacturer', md: 6 },
  { name: 'dateOfManufacture', label: 'date-of-manufacture', type: 'date', md: 6, placeholder: 'select-date-of-manufacture', past: true },
  { name: 'placementLocation', label: 'placement-location', type: 'text', placeholder: 'enter-placement-location', required: true, md: 6 },
  { name: 'idAircraft', label: 'tail-number', type: 'select', options: [], required: true, md: 6, placeholder: 'select-tail-number' },
  { name: 'supplier', label: 'supplier', type: 'select', options: [], required: true, md: 12, placeholder: 'select-supplier' },
  { name: 'activationDate', label: 'activation-date', type: 'date', md: 6, placeholder: 'select-date-activation' },
  { name: 'deactivationDate', label: 'deactivation-date', type: 'date', md: 6, placeholder: 'select-date-deactivation' },
  { name: 'description', label: 'desc', type: 'text', placeholder: 'enter-desc', md: 12 }
];

export const voucherFields: FieldConfig[] = [
  { name: 'productId', label: 'package-attached', type: 'select', placeholder: 'select-product', required: true, md: 12, options: [] }, // options will be set in the component
  // { name: 'campaignId', label: 'campaign', type: 'select', placeholder: 'select-campaign', md: 12, options: [] }, // options will be set in the component
  { name: 'fromDate', secondField: 'endDate', label: 'time', type: 'RangeDatePicker', required: true, md: 12 }
];

export const discountInfoFields: FieldConfig[] = [
  { name: 'name', label: 'name-voucher', type: 'text', placeholder: 'enter-voucher-name', required: true, md: 6 },
  { name: 'type', label: 'discount-type', type: 'select', placeholder: 'select-discount-type', required: true, md: 6, options: [] }, // options need to be filled later
  { name: 'quantity', label: 'quantity', type: 'text', placeholder: 'enter-quantity', md: 6 },
  { name: 'quantityPerUser', label: 'voucher-per-person', type: 'number', placeholder: 'enter-quantity-per-person', md: 6 },
  { name: 'minimal', label: 'discount-minimal', type: 'number', placeholder: 'enter-discount-minimal', md: 6 },
  { name: 'maximal', label: 'discount-maximal', type: 'number', placeholder: 'enter-discount-maximal', md: 6 },
  { name: 'dateFrom', secondField: 'dateEnd', label: 'time', type: 'RangeDatePicker', required: true, md: 12 }
];

export const supplierFields: FieldConfig[] = [
  { name: 'name', label: 'name-supplier', type: 'text', placeholder: 'enter-name-supplier', required: true, md: 12 },
  { name: 'address', label: 'address-supplier', type: 'text', placeholder: 'enter-supplier-address', required: true, md: 12 },
  { name: 'contact', label: 'contact', type: 'text', placeholder: 'enter-supplier-contact', required: true, md: 12 },
  { name: 'description', label: 'desc', type: 'text', placeholder: 'enter-desc', required: false, md: 12 }
];

export const planFields: FieldConfig[] = [
  { name: 'plan-info', label: 'product-information', type: 'categories', md: 12 },
  { name: 'title', label: 'product-name', type: 'text', placeholder: 'enter-product-name', required: true, md: 12 },
  { name: 'description', label: 'desc', type: 'text', placeholder: 'enter-desc', required: false, md: 12, row: 2 },
  { name: 'product-detail', label: 'product-details', type: 'categories', md: 12 },
  {
    name: 'bandwidthUpload',
    unit: 'Mbps',
    label: 'bandwidth-upload-mbps',
    type: 'number',
    placeholder: 'enter-bandwidth-upload',
    required: true,
    md: 6
  },
  {
    name: 'bandwidthDownload',
    unit: 'Mbps',
    label: 'bandwidth-download-mbps',
    type: 'number',
    placeholder: 'enter-bandwidth-download',
    required: true,
    md: 6
  },
  { name: 'dataUpload', label: 'data-upload-mb', unit: 'MB', type: 'number', placeholder: 'enter-data-upload', required: true, md: 6 },
  {
    name: 'dataDownload',
    label: 'data-download-mb',
    unit: 'MB',
    type: 'number',
    placeholder: 'enter-data-download',
    required: true,
    md: 6
  },
  {
    name: 'dataTotal',
    label: 'data-total-mb',
    unit: 'MB',
    type: 'number',
    placeholder: 'enter-data-total',
    required: true,
    md: 6
    // readOnly: true
  },
  {
    name: 'totalTime',
    label: 'total-time-minutes',
    unit: 'minutes',
    type: 'number',
    placeholder: 'enter-total-time-minutes',
    required: true,
    md: 6
  },
  { name: 'price', label: 'product-price', type: 'categories', md: 12 },
  {
    name: 'dataPrice.originalPrice',
    label: 'original-price',
    unit: 'VND',
    type: 'number',
    placeholder: 'enter-original-price',
    required: true,
    md: 6
  },
  { name: 'dataPrice.newPrice', label: 'new-price', unit: 'VND', type: 'number', placeholder: 'enter-new-price', required: true, md: 6 }
];

export const bundleTelecomFields: FieldConfig[] = [
  { name: 'name', label: 'bundle-service-name', type: 'text', placeholder: 'enter-bundle-service-name', md: 12, required: true },
  {
    name: 'productId',
    label: 'product-attached',
    placeholder: 'select-product-attached-name',
    type: 'select',
    options: [],
    required: true,
    md: 12
  }, // options to be filled later
  {
    name: 'productType',
    label: 'product-type',
    type: 'text',
    placeholder: 'enter-product-type',
    md: 12,
    required: true
  },
  {
    name: 'description',
    label: 'desc',
    type: 'text',
    placeholder: 'enter-desc',
    md: 12
  }
];

export const bundleAirlineFields: FieldConfig[] = [
  { name: 'name', label: 'bundle-service-name', type: 'text', placeholder: 'enter-bundle-service-name', md: 12, required: true },
  { name: 'ticketPlan', label: 'ticket-attached-name', type: 'text', placeholder: 'enter-ticket-attached-name', required: true, md: 12 },
  {
    name: 'productId',
    label: 'select-product-attached-name',
    type: 'select',
    placeholder: 'select-product-attached-name',
    options: [],
    required: true,
    md: 12
  }, // options to be filled later
  {
    name: 'description',
    label: 'desc',
    type: 'text',
    placeholder: 'enter-desc',
    md: 12
  }
];

export const gatewayFields: FieldConfig[] = [
  { name: 'code', label: 'code', type: 'text', placeholder: 'enter-code', required: true, md: 12, readOnly: true },
  { name: 'title', label: 'name-gateway', type: 'text', placeholder: 'enter-name-gateway', required: true, md: 12 },
  { name: 'value', label: 'service-parameters', type: 'text', placeholder: 'enter-value', required: true, md: 12 },
  { name: 'description', label: 'desc', type: 'text', placeholder: 'enter-desc', required: true, md: 12, row: 2 }
];

export const saleChannelFields: FieldConfig[] = [
  { name: 'code', label: 'code', type: 'text', placeholder: 'enter-code-sale-channel', required: true, md: 12, readOnly: true },
  { name: 'title', label: 'name-sale-channel', type: 'text', placeholder: 'enter-name-sale-channel', required: true, md: 12 },
  { name: 'value', label: 'service-parameters', type: 'text', placeholder: 'enter-value', required: true, md: 12 },
  { name: 'description', label: 'desc', type: 'text', placeholder: 'enter-desc', required: true, md: 12, row: 2 }
];

export const paymentMethodFields: FieldConfig[] = [
  { name: 'code', label: 'code', type: 'text', placeholder: 'enter-code-payment-method', required: true, md: 12, readOnly: true },
  { name: 'title', label: 'name-payment-method', type: 'text', placeholder: 'enter-name-payment-method', required: true, md: 12 },
  { name: 'value', label: 'service-parameters', type: 'text', placeholder: 'enter-value', required: true, md: 12 },
  { name: 'description', label: 'desc', type: 'text', placeholder: 'enter-desc', required: false, md: 12 }
];

export const roleFields: FieldConfig[] = [
  {
    name: 'title',
    label: 'name-role',
    type: 'text',
    placeholder: 'enter-name-role',
    required: true,
    md: 6
  },
  {
    name: 'permission',
    label: 'permission',
    type: 'select',
    options: [
      { value: 'get', label: 'read-only' },
      { value: 'sync', label: 'sync' }
    ],
    placeholder: 'select-permission',
    required: true,
    md: 6
  },
  {
    name: 'description',
    label: 'desc',
    type: 'text',
    placeholder: 'enter-desc',
    required: true,
    md: 12,
    row: 2
  }
];

export const aircraftFields: FieldConfig[] = [
  {
    name: 'flightNumber',
    label: 'flight-number',
    type: 'text',
    placeholder: 'enter-flight-number',
    required: true,
    md: 6
  },
  {
    name: 'tailNumber',
    label: 'tail_number',
    type: 'text',
    placeholder: 'enter-tail-number',
    required: true,
    md: 6
  },
  {
    name: 'model',
    label: 'model',
    type: 'text',
    placeholder: 'enter-model',
    required: true,
    md: 6
  },
  {
    name: 'modelType',
    label: 'aircraft-model-type',
    type: 'text',
    placeholder: 'enter-aircraft-model-type',
    required: true,
    md: 6
  },
  {
    name: 'capacity',
    label: 'passengers-capacity',
    unit: 'passengers',
    type: 'number',
    placeholder: 'enter-passengers-capacity',
    required: true,
    md: 6
  },
  {
    name: 'leasedAircraftStatus',
    label: 'leased-aircraft-status',
    type: 'text',
    placeholder: 'enter-leased-aircraft-status',
    required: false,
    md: 6
  },
  {
    name: 'manufacturer',
    label: 'manufacturer',
    type: 'text',
    placeholder: 'enter-manufacturer',
    required: true,
    md: 6
  },
  {
    name: 'yearManufactured',
    label: 'year-manufactured',
    type: 'text',
    placeholder: 'enter-year-manufactured',
    required: true,
    md: 6
  },
  {
    name: 'ownership',
    label: 'aircraft-owners',
    type: 'text',
    placeholder: 'enter-aircraft-owners',
    required: false,
    md: 6
  },
  {
    name: 'maintenanceSchedule',
    label: 'maintenance-schedule',
    type: 'date',
    placeholder: 'select-maintenance-schedule',
    required: true,
    md: 6
  },
  {
    name: 'lastMaintenanceDate',
    label: 'last-maintenance-date',
    type: 'date',
    placeholder: 'select-last-maintenance-date',
    required: true,
    md: 6
  }
];

export const restrictionDevicesFields: FieldConfig[] = [
  { name: 'deviceName', label: 'device-name', type: 'text', placeholder: 'enter-device-name', required: true },
  { name: 'ipAddress', label: 'ip-address', type: 'text', placeholder: 'enter-ip-address', required: true },
  { name: 'ipv6Address', label: 'ipv6-address', type: 'text', placeholder: 'enter-ip-address', required: true },
  { name: 'macAddress', label: 'mac-address', type: 'text', placeholder: 'enter-mac-address', required: true },
  { name: 'reason', label: 'restriction-reason', type: 'text', placeholder: 'enter-restriction-reason', required: true, md: 12 }
];

export const airlineFields: FieldConfig[] = [
  { name: 'name', label: 'airline-name', type: 'text', placeholder: 'enter-airline-name', required: true },
  { name: 'code', label: 'code', type: 'text', placeholder: 'enter-code-airline', required: true },
  { name: 'country', label: 'country', type: 'text', placeholder: 'enter-country', required: true },
  { name: 'email', label: 'email-address', type: 'text', placeholder: 'enter-email-address', required: true },
  { name: 'phoneNumber', label: 'phone-number', type: 'text', placeholder: 'enter-phone-number', required: true },
  { name: 'description', label: 'desc', type: 'text', placeholder: 'enter-desc', md: 12, row: 2 }
];

export const restrictionDomainFields: FieldConfig[] = [
  { name: 'name', label: 'domain', type: 'text', placeholder: 'enter-domain-name', required: true, md: 12 },
  {
    name: 'categoryId',
    label: 'category',
    type: 'select',
    placeholder: 'choose-category-web',
    required: true,
    md: 12,
    options: []
  },
  { name: 'url', label: 'url', type: 'text', placeholder: 'enter-url', required: true, md: 12 },
  { name: 'ipAddress', label: 'ip-address', type: 'text', placeholder: 'enter-ip-address', required: true, md: 12 },
  { name: 'ipv6Address', label: 'ipv6-address', type: 'text', placeholder: 'enter-ipv6-address', required: true, md: 12 },
  { name: 'dnsAddress', label: 'dns-address', type: 'text', placeholder: 'enter-restriction-reason', required: true, md: 12 },
  { name: 'reason', label: 'restriction-reason', type: 'text', placeholder: 'enter-restriction-reason', required: true, md: 12 }
];

export const vendorFields: FieldConfig[] = [
  { name: 'name', label: 'fullname', type: 'text', placeholder: 'enter-full-name', required: true, md: 6 },
  { name: 'email', label: 'email-address', type: 'email', placeholder: 'enter-email', required: true, md: 6 },
  { name: 'phone_number', label: 'phone-number', type: 'text', placeholder: 'enter-phone-number', required: true, md: 6 },
  { name: 'address', label: 'address', type: 'text', placeholder: 'enter-address', required: true, md: 6 },
  { name: 'region', label: 'region-vendor', type: 'text', placeholder: 'enter-region-vender', required: true, md: 6 },
  { name: 'start_date', label: 'date-start', type: 'date', placeholder: 'period-start-required', required: true, md: 6 },
  { name: 'notes', label: 'desc', type: 'text', placeholder: 'enter-desc', md: 12, row: 3 }
];

export const campaignFields: FieldConfig[] = [
  { name: 'name', label: 'name-campaign', type: 'text', placeholder: 'enter-name-campaign', required: true, md: 12 },
  { name: 'budget', label: 'budget', type: 'number', placeholder: 'enter-budget', required: true, md: 12 },
  { name: 'startDate', secondField: 'endDate', label: 'time', type: 'RangeDatePicker', required: true, md: 12 },
  { name: 'description', label: 'desc', type: 'text', placeholder: 'enter-desc', md: 12 }
];
