import { FormattedMessage } from 'react-intl';

import useFlightPhaseTooltip from 'hooks/useFlightPhase';
import { formatYear, limitTextToWords } from 'utils/handleData';
import { getLeasedAircraft, getTypePackages, getPlacementLocation } from 'utils/getData';

import FieldView from 'components/molecules/view-modal/DetailRow';
import ChipView from 'components/molecules/view-modal/StatusRow';

interface FieldConfig {
  key: string;
  label: string;
  transform?: (value: any) => string | React.ReactNode | null;
  unit?: string;
  md?: number;
}

export const deviceViewConfig: FieldConfig[] = [
  { key: 'name', label: 'device-name' },
  { key: 'firmware', label: 'firmware' },
  { key: 'type', label: 'type' },
  { key: 'model', label: 'model' },
  { key: 'wifi_standard', label: 'wifi-standard' },
  { key: 'port', label: 'port' },
  { key: 'ip_address', label: 'ip-address' },
  { key: 'mac_address', label: 'mac-address' },
  { key: 'ipv6_address', label: 'ipv6-address' },
  { key: 'supplier', label: 'supplier' },
  { key: 'tail_number', label: 'tail-number' },
  {
    key: 'placement_location',
    label: 'placement-location',
    transform: (value: string) => getPlacementLocation(value)
  },
  {
    key: 'status_id',
    label: 'status',
    transform: (value: number) => (
      <ChipView key={'status_id'} name={<FormattedMessage id="status" />} id={value} successLabel="active" errorLabel="inactive" />
    )
  },
  { key: 'activation_date', label: 'activation-date' },
  { key: 'deactivation_date', label: 'deactivation-date' },
  { key: 'description', label: 'desc', md: 12 }
];

export const deviceHealthViewConfig: FieldConfig[] = [
  { key: 'name', label: 'device-name' },
  { key: 'type', label: 'type' },
  { key: 'model', label: 'model' },
  { key: 'supplier', label: 'supplier' },
  {
    key: 'placement_location',
    label: 'placement-location',
    transform: (value: string) => getPlacementLocation(value)
  },
  {
    key: 'status_id',
    label: 'status',
    transform: (value: number) => (
      <ChipView key={'status'} name={<FormattedMessage id="status" />} id={value} successLabel="healthy" errorLabel="unhealthy" />
    )
  },
  { key: 'health_check_time', label: 'last-check-time' }
];

export const flightViewConfig: FieldConfig[] = [
  {
    key: 'aircraft.flight_number',
    label: 'flight-number'
  },
  {
    key: 'aircraft.tail_number',
    label: 'tail-number'
  },
  {
    key: 'aircraft.model',
    label: 'model'
  },
  {
    key: 'airline',
    label: 'airline'
  },
  {
    key: 'departure_airport',
    label: 'departure-airport'
  },
  {
    key: 'arrival_airport',
    label: 'arrival-airport'
  },
  {
    key: 'departure_time',
    label: 'departure-time'
  },
  {
    key: 'arrival_time',
    label: 'arrival-time'
  },
  {
    key: 'flight_phase',
    label: 'flight-phase',
    transform: useFlightPhaseTooltip
  },
  {
    key: 'lat_location',
    label: 'lat-location'
  },
  {
    key: 'long_location',
    label: 'long-location'
  }
];

export const aircraftViewConfig: FieldConfig[] = [
  {
    key: 'flight_number',
    label: 'flight_number'
  },
  {
    key: 'tail_number',
    label: 'tail_number'
  },
  {
    key: 'model',
    label: 'model'
  },
  {
    key: 'model_type',
    label: 'aircraft-model-type'
  },
  {
    key: 'manufacturer',
    label: 'manufacturer'
  },
  {
    key: 'year_manufactured',
    label: 'year-manufactured',
    transform: (value: string) => formatYear(value)
  },
  {
    key: 'maintenance_schedule',
    label: 'maintenance-schedule'
  },
  {
    key: 'last_maintenance_date',
    label: 'last-maintenance-date'
  },
  {
    key: 'leased_aircraft_status',
    label: 'leased-aircraft-status',
    transform: getLeasedAircraft
  },
  {
    key: 'status_id',
    label: 'aircraft-operational-status',
    transform: (value: number) => (
      <ChipView
        key={'aircraft-operational-status'}
        name={<FormattedMessage id="ifc-status" />}
        id={value}
        successLabel="active"
        errorLabel="inactive"
      />
    )
  },
  {
    key: 'ownership',
    label: 'aircraft-owners'
  }
];

export const bundleAirfareViewConfig = [
  {
    key: 'sku',
    label: 'SKU'
  },
  {
    key: 'name',
    label: 'plan-name'
  },
  {
    key: 'ticket_plan',
    label: 'ticket-class'
  },
  {
    key: 'product_sold',
    label: 'units-sold'
  },
  {
    key: 'status_id',
    label: 'status',
    transform: (value: number) => (
      <ChipView key={'status'} name={<FormattedMessage id="status" />} id={value} successLabel="active" errorLabel="inactive" />
    )
  },
  {
    key: 'description',
    label: 'desc',
    md: 12
  }
];

export const bundleTelecomViewConfig = [
  {
    key: 'sku',
    label: 'SKU'
  },
  {
    key: 'name',
    label: 'plan-name'
  },
  {
    key: 'product_type',
    label: 'type'
  },
  {
    key: 'product_sold',
    label: 'units-sold'
  },
  {
    key: 'status_id',
    label: 'status',
    transform: (value: number) => (
      <ChipView key={'status'} name={<FormattedMessage id="status" />} id={value} successLabel="active" errorLabel="inactive" />
    )
  },
  {
    key: 'description',
    label: 'desc',
    md: 12
  }
];

export const packageWifiViewConfig = [
  {
    key: 'title',
    label: 'plan-name'
  },
  {
    key: 'type',
    label: 'type',
    transform: (value: string) => {
      return <FieldView key={'type'} name={<FormattedMessage id="type" />} field={getTypePackages(value)} />;
    } // Function to translate type codes to descriptions
  },
  {
    key: 'total_time',
    label: 'total-time-minutes',
    transform: (value: number) => `${value} minutes` // Directly append 'minutes' to the value
  },
  {
    key: 'data_total',
    label: 'data-total-mb',
    transform: (value: number) => `${value} MB`
  },
  {
    key: 'bandwidth_upload',
    label: 'bandwidth-upload-mbps',
    transform: (value: number) => `${value} Mbps`
  },
  {
    key: 'bandwidth_download',
    label: 'bandwidth-download-mbps',
    transform: (value: number) => `${value} Mbps`
  },
  {
    key: 'data_upload',
    label: 'data-upload-mb',
    transform: (value: number) => `${value} MB`
  },
  {
    key: 'data_download',
    label: 'data-download-mb',
    transform: (value: number) => `${value} MB`
  },
  {
    key: 'price.original_price',
    label: 'original-price',
    transform: (value: number) => `${value.toLocaleString('vi-VN')} VND`
  },
  {
    key: 'price.new_price',
    label: 'new-price',
    transform: (value: number) => `${value.toLocaleString('vi-VN')} VND`
  },
  {
    key: 'status_id',
    label: 'status',
    transform: (value: number) => (
      <ChipView key={'status'} name={<FormattedMessage id="status" />} id={value} successLabel="active" errorLabel="inactive" />
    )
  },
  {
    key: 'description',
    label: 'desc',
    md: 12
  }
];

export const gatewayViewConfig = [
  {
    key: 'code',
    label: 'code'
  },
  {
    key: 'title',
    label: 'name'
  },
  {
    key: 'value',
    label: 'service-parameters'
  },
  {
    key: 'income',
    label: 'income',
    transform: (value: number) => `${value.toLocaleString('vi-VN')} VND`
  },
  {
    key: 'description',
    label: 'desc'
  }
];

export const campaignViewConfig = [
  {
    key: 'name',
    label: 'name-campaign'
  },
  {
    key: 'budget',
    label: 'budget'
  },
  {
    key: 'start_date',
    label: 'start-date'
  },
  {
    key: 'end_date',
    label: 'end-date'
  },
  {
    key: 'description',
    label: 'desc'
  }
];

export const voucherDiscountViewConfig = [
  { key: 'name', label: 'name-voucher' },
  { key: 'code', label: 'code' },
  {
    key: 'type',
    label: 'voucher-type',
    transform: (type: string) => {
      const label = type === 'cash' ? 'direct-discount' : 'percentage-discount';
      return <FieldView key={'type'} md={12} name={<FormattedMessage id={'voucher-type'} />} field={<FormattedMessage id={label} />} />;
    }
  },
  { key: 'minimal', label: 'discount-minimal' },
  { key: 'maximal', label: 'discount-maximal' },
  { key: 'quantity', label: 'total-voucher-published' },
  { key: 'quantity_per_user', label: 'voucher-per-person' },
  { key: 'date_from', label: 'date-start' },
  { key: 'date_end', label: 'date-end' }
];

export const voucherRedeemViewFields = [
  { key: 'voucher_code', label: 'code' },
  { key: 'product.title', label: 'product-attached' },
  { key: 'from_date', label: 'start-date' },
  { key: 'end_date', label: 'end-date' },
  {
    key: 'status_id',
    label: 'status',
    transform: (status: number) => {
      return <ChipView key={'status'} name={<FormattedMessage id="status" />} id={status} successLabel="active" errorLabel="inactive" />;
    }
  }
];

export const restrictionDeviceViewFields = [
  { key: 'device_name', label: 'device-name' },
  { key: 'mac_address', label: 'mac-address' },
  { key: 'ip_address', label: 'ip-address' },
  { key: 'ipv6_address', label: 'ipv6-address' },
  { key: 'created_date', label: 'restriction-date' },
  { key: 'reason', label: 'reason', md: 12 }
];

export const restrictionDomainViewFields = [
  { key: 'name', label: 'domain' },
  { key: 'category.name', label: 'category' },
  { key: 'url', label: 'url' },
  { key: 'dns-address', label: 'dns-address' },
  { key: 'ip_address', label: 'ip-address' },
  { key: 'ipv6_address', label: 'ipv6-address' },
  { key: 'created_date', label: 'restriction-date' },
  { key: 'reason', label: 'reason', md: 12 }
];

export const sessionViewConfig = [
  { key: 'user.username', label: 'username' },
  { key: 'product.title', label: 'plan-name' },
  { key: 'user_device', label: 'user-device' },
  { key: 'user_ip_address', label: 'ip-address' },
  { key: 'user_mac_address', label: 'mac-address' },
  { key: 'device.name', label: 'wifi-device' },
  { key: 'total_data_usage', label: 'data-usage-mb', transform: (value: number) => `${value} MB` },
  { key: 'total_time_usage_hour', label: 'time-usage', transform: (value: number) => `${value || 0} hours` },
  { key: 'flight.aircraft.flight_number', label: 'flight-number' },
  { key: 'flight.aircraft.tail_number', label: 'tail-number' },
  { key: 'flight.departure_airport', label: 'departure-airport' },
  { key: 'flight.arrival_airport', label: 'arrival-airport' },
  { key: 'flight.departure_time', label: 'departure-time' },
  { key: 'flight.arrival_time', label: 'arrival-time' },
  {
    key: 'session_status',
    label: 'status-online',
    transform: (status: string) => (
      <ChipView
        key={'status-online'}
        name={<FormattedMessage id="status" />}
        id={status === 'Active' ? 14 : 19}
        successLabel="active"
        errorLabel="inactive"
      />
    )
  },
  { key: 'terminate_reason', label: 'desc', md: 12 }
];

export const providerViewConfig = [
  { key: 'name', label: 'name-supplier' },
  { key: 'address', label: 'address' },
  { key: 'contact', label: 'contact' },
  {
    key: 'status_id',
    label: 'status',
    transform: (value: number) => (
      <ChipView key={'status'} name={<FormattedMessage id="status" />} id={value} successLabel="active" errorLabel="inactive" />
    )
  },
  { key: 'description', label: 'desc' }
];

export const userViewConfig = [
  { key: 'fullname', label: 'name_user' },
  { key: 'username', label: 'username' },
  { key: 'email', label: 'email' },
  { key: 'gender', label: 'gender' },
  { key: 'phone_number', label: 'phone-number' },
  { key: 'citizen_id', label: 'citizen-id' },
  { key: 'address', label: 'address' },
  { key: 'ward', label: 'ward' },
  { key: 'district', label: 'district' },
  { key: 'province', label: 'province' },
  { key: 'country', label: 'country' },
  { key: 'postcode', label: 'postcode' },
  {
    key: 'status_id',
    label: 'status-online',
    transform: (value: number) => (
      <ChipView key={'status-online'} name={<FormattedMessage id="status" />} id={value} successLabel="online" errorLabel="offline" />
    )
  }
];

export const vendorViewConfig = [
  { key: 'fullname', label: 'fullname' },
  { key: 'email', label: 'email-address' },
  { key: 'phone_number', label: 'phone-number' },
  {
    key: 'token',
    label: 'code',
    transform: (value: string) => limitTextToWords(value, 40)
  },
  { key: 'address', label: 'address', md: 12 },
  { key: 'ward', label: 'ward' },
  { key: 'district', label: 'district' },
  { key: 'province', label: 'province' },
  { key: 'expired_date', label: 'expired-date' },
  { key: 'description', label: 'desc', md: 12 }
];

export const roleViewConfig = [
  { key: 'title', label: 'name-role' },
  { key: 'permission', label: 'permission' },
  {
    key: 'status_id',
    label: 'status',
    transform: (value: number) => (
      <ChipView key={'status'} name={<FormattedMessage id="status" />} id={value} successLabel="online" errorLabel="offline" />
    )
  },
  { key: 'description', label: 'desc', md: 12 }
];

export const airlineViewConfig = [
  { key: 'name', label: 'name' },
  { key: 'code', label: 'code' },
  { key: 'email', label: 'email' },
  { key: 'phone_number', label: 'phone_number' },
  { key: 'country', label: 'country' },
  { key: 'token_code', label: 'code', transform: (value: string) => limitTextToWords(value, 40) },
  {
    key: 'status_id',
    label: 'status',
    transform: (value: number) => (
      <ChipView key={'status-online'} name={<FormattedMessage id="status" />} id={value} successLabel="online" errorLabel="offline" />
    )
  },
  { key: 'description', label: 'desc', md: 12 }
];
