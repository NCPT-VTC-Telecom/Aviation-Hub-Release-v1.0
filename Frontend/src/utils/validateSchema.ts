import * as Yup from 'yup';
import { useIntl } from 'react-intl';

function useValidationSchemas(isEditMode?: boolean) {
  const intl = useIntl();

  const EndUserSchema = Yup.object().shape({
    fullname: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'full-name-required' })),
    email: Yup.string()
      .max(255)
      .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
      .email(intl.formatMessage({ id: 'email-invalid' }))
      .required(intl.formatMessage({ id: 'email-required' })),
    phoneNumber: Yup.string()
      .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
      .matches(/^\d+$/, intl.formatMessage({ id: 'numbers-only-allowed' }))
      .required(intl.formatMessage({ id: 'phone-number-required' }))
      .length(10, intl.formatMessage({ id: 'phone-number-max-10' })),
    address: Yup.string().required(intl.formatMessage({ id: 'address-required' })),
    citizenId: Yup.string().matches(/^\d+$/, intl.formatMessage({ id: 'numbers-only-allowed' })),
    ward: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'ward-required' })),
    district: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'district-required' })),
    province: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'province-required' })),
    country: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'country-required' })),
    username: Yup.string().when([], {
      is: () => !isEditMode,
      then: (schema) =>
        schema.matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' })).required(intl.formatMessage({ id: 'username-required' })),
      otherwise: (schema) => schema
    }),
    password: Yup.string().when([], {
      is: () => !isEditMode,
      then: (schema) =>
        schema.required(intl.formatMessage({ id: 'password-required' })).min(8, intl.formatMessage({ id: 'at-least-8-characters' })),
      otherwise: (schema) => schema
    })
  });

  const DeviceSchema = Yup.object().shape({
    name: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'name-model-required' })),
    ipAddress: Yup.string()
      .required(intl.formatMessage({ id: 'ipv4-invalid' }))
      .matches(
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        intl.formatMessage({ id: 'ipv4-invalid' })
      ),
    macAddress: Yup.string().required(intl.formatMessage({ id: 'mac-address-required' })),
    firmware: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'firmware-required' })),
    wifiStandard: Yup.string().required(intl.formatMessage({ id: 'select-wifi-standard-required' })),
    supplier: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'supplier-name-required' })),
    placementLocation: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'placement-location-required' })),
    idTypeDevice: Yup.number().test('is-not-zero', intl.formatMessage({ id: 'select-type-device-required' }), function (value) {
      const { idTypeDevice } = this.parent; // Lấy giá trị của idTypeDevice từ schema cha
      return idTypeDevice !== 0
        ? true
        : this.createError({ path: 'idTypeDevice', message: intl.formatMessage({ id: 'select-type-device-required' }) });
    }),
    idAircraft: Yup.number().test('is-not-zero', intl.formatMessage({ id: 'select-tail-number-required' }), function (value) {
      const { idAircraft } = this.parent; // Lấy giá trị của idAircraft từ schema cha
      return idAircraft !== 0
        ? true
        : this.createError({ path: 'idAircraft', message: intl.formatMessage({ id: 'select-tail-number-required' }) });
    })
  });

  const TelecommunicationSchema = Yup.object().shape({
    name: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'telecom-name-required' })),
    contact: Yup.string()
      .required(intl.formatMessage({ id: 'phone-number-required' }))
      .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
      .matches(/^\d+$/, intl.formatMessage({ id: 'numbers-only-allowed' }))
      .length(10, intl.formatMessage({ id: 'phone-number-max-10' })),
    address: Yup.string().required(intl.formatMessage({ id: 'address-supplier-required' }))
  });

  const DeviceModelSchema = Yup.object().shape({
    name: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'name-model-required' })),
    wifi_standard: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'wifi-standard-required' })),
    firmware: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'firmware-required' })),
    supplier: Yup.string().required(intl.formatMessage({ id: 'supplier-name-required' })),
    warranty: Yup.string().required(intl.formatMessage({ id: 'warranty-required' })),
    date_of_manufacture: Yup.string().required(intl.formatMessage({ id: 'date-of-manufacture-required' }))
  });

  const CampaignSchema = Yup.object().shape({
    name: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'name-campaign-required' })),
    budget: Yup.number().required(intl.formatMessage({ id: 'budget-required' })),
    startDate: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'start-date-campaign-required' })),
    endDate: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'end-date-campaign-required' }))
  });

  const SupplierSchema = Yup.object().shape({
    name: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'supplier-name-required' })),
    contact: Yup.string()
      .required(intl.formatMessage({ id: 'phone-number-required' }))
      .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
      .matches(/^\d+$/, intl.formatMessage({ id: 'numbers-only-allowed' }))
      .length(10, intl.formatMessage({ id: 'phone-number-max-10' })),
    address: Yup.string().required(intl.formatMessage({ id: 'address-supplier-required' }))
  });

  const PlanSchema = Yup.object()
    .shape({
      // imageLink: Yup.string().url(intl.formatMessage({ id: 'invalid-url' })),
      title: Yup.string()
        .max(255)
        .required(intl.formatMessage({ id: 'plan-name-required' })),
      description: Yup.string().max(500),
      totalTime: Yup.number()
        .min(1, intl.formatMessage({ id: 'total-time-required' }))
        .positive(intl.formatMessage({ id: 'positive-number-required' }))
        .required(intl.formatMessage({ id: 'total-time-required' })),
      bandwidthUpload: Yup.number()
        .min(1, intl.formatMessage({ id: 'bandwidth-upload-required' }))
        .positive(intl.formatMessage({ id: 'positive-number-required' }))
        .required(intl.formatMessage({ id: 'bandwidth-upload-required' })),
      bandwidthDownload: Yup.number()
        .min(1, intl.formatMessage({ id: 'bandwidth-download-required' }))
        .positive(intl.formatMessage({ id: 'positive-number-required' }))
        .required(intl.formatMessage({ id: 'bandwidth-download-required' })),
      dataTotal: Yup.number()
        .min(1, intl.formatMessage({ id: 'data-total-required' }))
        .positive(intl.formatMessage({ id: 'positive-number-required' }))
        .required(intl.formatMessage({ id: 'data-total-required' })),
      dataUpload: Yup.number()
        .min(1, intl.formatMessage({ id: 'data-upload-required' }))
        .positive(intl.formatMessage({ id: 'positive-number-required' }))
        .required(intl.formatMessage({ id: 'data-upload-required' })),
      dataDownload: Yup.number()
        .min(1, intl.formatMessage({ id: 'data-download-required' }))
        .positive(intl.formatMessage({ id: 'positive-number-required' }))
        .required(intl.formatMessage({ id: 'data-download-required' })),
      dataPrice: Yup.object().shape({
        originalPrice: Yup.number()
          .min(1, intl.formatMessage({ id: 'original-price-required' }))
          .positive(intl.formatMessage({ id: 'positive-number-required' }))
          .required(intl.formatMessage({ id: 'original-price-required' })),
        newPrice: Yup.number()
          .min(1, intl.formatMessage({ id: 'new-price-required' }))
          .positive(intl.formatMessage({ id: 'positive-number-required' }))
          .required(intl.formatMessage({ id: 'new-price-required' }))
          .test('is-greater-than-original', intl.formatMessage({ id: 'new-price-greater-than-original' }), function (value) {
            return value > this.parent.originalPrice;
          })
      })
    })
    .test('data-total-match', intl.formatMessage({ id: 'data-total-mismatch' }), function (value) {
      const { dataUpload, dataDownload, dataTotal } = value;
      const sum = dataUpload + dataDownload;
      if (sum < dataTotal) {
        return this.createError({
          path: 'dataTotal',
          message: intl.formatMessage({ id: 'data-total-too-high' })
        });
      } else if (sum > dataTotal) {
        return this.createError({
          path: 'dataTotal',
          message: intl.formatMessage({ id: 'data-total-too-low' })
        });
      }
      return true;
    });

  const VoucherRedemptionSchema = Yup.object().shape({
    productId: Yup.number().test('is-not-zero', intl.formatMessage({ id: 'select-plan-attached-required' }), function (value) {
      const { productId } = this.parent;
      return productId !== 0
        ? true
        : this.createError({ path: 'productId', message: intl.formatMessage({ id: 'select-plan-attached-required' }) });
    }),
    fromDate: Yup.string().required(intl.formatMessage({ id: 'start-date-required' })),
    endDate: Yup.string().required(intl.formatMessage({ id: 'end-date-required' }))
  });

  const VoucherDiscountSchema = Yup.object().shape({
    name: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'voucher-discount-name-required' })) // Tên Discount
    // Loại discount
    // dateFrom: Yup.string().required(intl.formatMessage({ id: 'period-start-required' })), // Ngày bắt đầu
    // dateEnd: Yup.string().required(intl.formatMessage({ id: 'period-end-required' })) // Ngày hết hạn
  });

  const AircraftSchema = Yup.object().shape({
    flightNumber: Yup.string()
      .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
      .max(255)
      .required(intl.formatMessage({ id: 'flight-number-required' })),
    tailNumber: Yup.string()
      .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
      .max(255)
      .required(intl.formatMessage({ id: 'tail-number-required' })),
    capacity: Yup.number()
      .min(1, intl.formatMessage({ id: 'capacity-required' }))
      .required(intl.formatMessage({ id: 'capacity-required' })),
    model: Yup.string()
      .max(255)
      .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
      .required(intl.formatMessage({ id: 'model-aircraft-required' })),
    modelType: Yup.string()
      .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
      .max(255)
      .required(intl.formatMessage({ id: 'model-type-aircraft-required' })),
    manufacturer: Yup.string().required(intl.formatMessage({ id: 'manufacturer-required' })),
    ownership: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'ownership-required' })),
    yearManufactured: Yup.date().required(intl.formatMessage({ id: 'year-manufactured-required' }))
  });

  const GatewaySchema = Yup.object().shape({
    code: Yup.string()
      .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
      .max(255)
      .required(intl.formatMessage({ id: 'code-gateway-required' })),
    title: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'name-gateway-required' })),
    value: Yup.string()
      .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
      .max(255)
      .required(intl.formatMessage({ id: 'service-parameters-required' })),
    description: Yup.string().required(intl.formatMessage({ id: 'gateway-desc-required' }))
  });

  const SaleChannelSchema = Yup.object().shape({
    code: Yup.string()
      .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
      .max(255)
      .required(intl.formatMessage({ id: 'code-sale-channel-required' })),
    title: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'name-sale-channel-required' })),
    value: Yup.string()
      .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
      .max(255)
      .required(intl.formatMessage({ id: 'service-parameters-required' })),
    description: Yup.string().required(intl.formatMessage({ id: 'sale-channel-desc-required' }))
  });

  const PaymentMethodSchema = Yup.object().shape({
    code: Yup.string()
      .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
      .max(255)
      .required(intl.formatMessage({ id: 'code-payment-method-required' })),
    title: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'name-payment-method-required' })),
    value: Yup.string()
      .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
      .max(255)
      .required(intl.formatMessage({ id: 'service-parameters-required' })),
    description: Yup.string().required(intl.formatMessage({ id: 'payment-method-desc-required' }))
  });

  const RoleUserSchema = Yup.object().shape({
    title: Yup.string()
      .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
      .max(255)
      .required(intl.formatMessage({ id: 'name-role-required' })),
    permission: Yup.array()
      .of(Yup.string())
      .min(1, intl.formatMessage({ id: 'choose-permission-required' })) // Ensure at least one permission is selected
      .required(intl.formatMessage({ id: 'choose-permission-required' })),
    description: Yup.string().required(intl.formatMessage({ id: 'role-desc-required' }))
  });

  const OrderSchema = Yup.object().shape({
    date: Yup.date().required(intl.formatMessage({ id: 'date-required' })),
    itemList: Yup.array().of(
      Yup.object().shape({
        productId: Yup.number()
          .min(1, intl.formatMessage({ id: 'product-required' }))
          .required(intl.formatMessage({ id: 'product-required' })),
        quantity: Yup.number()
          .min(1, intl.formatMessage({ id: 'quantity-min' }))
          .required(intl.formatMessage({ id: 'quantity-required' })),
        type: Yup.string().required(intl.formatMessage({ id: 'type-product-required' }))
      })
    ),
    idGateway: Yup.number()
      .min(1, intl.formatMessage({ id: 'gateway-required' }))
      .required(intl.formatMessage({ id: 'gateway-required' })),
    idPaymentMethod: Yup.number()
      .min(1, intl.formatMessage({ id: 'payment-method-required' }))
      .required(intl.formatMessage({ id: 'payment-method-required' })),
    idFlight: Yup.number()
      .min(1, intl.formatMessage({ id: 'flight-required' }))
      .required(intl.formatMessage({ id: 'flight-required' })),
    idUser: Yup.string().required(intl.formatMessage({ id: 'user-required' }))
  });

  const RoleGroupSchema = Yup.object().shape({
    userGroupIdLv2: Yup.array()
      .of(Yup.string())
      .min(1, intl.formatMessage({ id: 'choose-permission-required' })) // Ensure at least one permission is selected
      .required(intl.formatMessage({ id: 'choose-permission-required' })),
    userGroupIdLv3: Yup.array()
      .of(Yup.string())
      .min(1, intl.formatMessage({ id: 'choose-permission-required' })) // Ensure at least one permission is selected
      .required(intl.formatMessage({ id: 'choose-permission-required' }))
  });

  const VendorSchema = Yup.object().shape({
    fullname: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'full-name-required' })),
    email: Yup.string()
      .max(255)
      .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
      .email(intl.formatMessage({ id: 'email-invalid' }))
      .required(intl.formatMessage({ id: 'email-required' })),
    phoneNumber: Yup.string()
      .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
      .matches(/^\d+$/, intl.formatMessage({ id: 'numbers-only-allowed' }))
      .required(intl.formatMessage({ id: 'phone-number-required' }))
      .length(10, intl.formatMessage({ id: 'phone-number-max-10' })),
    address: Yup.string().required(intl.formatMessage({ id: 'address-required' })),
    ward: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'ward-required' })),
    district: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'district-required' })),
    province: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'province-required' })),
    username: Yup.string().when([], {
      is: () => !isEditMode,
      then: (schema) =>
        schema.matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' })).required(intl.formatMessage({ id: 'username-required' })),
      otherwise: (schema) => schema
    }),
    password: Yup.string().when([], {
      is: () => !isEditMode,
      then: (schema) =>
        schema.required(intl.formatMessage({ id: 'password-required' })).min(8, intl.formatMessage({ id: 'at-least-8-characters' })),
      otherwise: (schema) => schema
    })
  });

  const BundleTelecomSchema = Yup.object().shape({
    name: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'bundle-service-name-required' })),
    productId: Yup.number()
      .min(1, intl.formatMessage({ id: 'product-required' }))
      .required(intl.formatMessage({ id: 'product-required' }))
  });

  const BundleAirlineSchema = Yup.object().shape({
    name: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'bundle-service-name-required' })),
    ticketPlan: Yup.string()
      .max(255)
      .required(intl.formatMessage({ id: 'bundle-service-name-required' })),
    productId: Yup.number()
      .min(1, intl.formatMessage({ id: 'product-required' }))
      .required(intl.formatMessage({ id: 'product-required' }))
  });

  const RestrictionDomainSchema = Yup.object().shape({
    name: Yup.string().required(intl.formatMessage({ id: 'domain-name-required' })),
    // categoryId: Yup.string().required(intl.formatMessage({ id: 'category-required' })),
    url: Yup.string()
      .required(intl.formatMessage({ id: 'url-required' }))
      .url(intl.formatMessage({ id: 'url-invalid' })),
    ipAddress: Yup.string()
      .required(intl.formatMessage({ id: 'ipv4-invalid' }))
      .matches(
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        intl.formatMessage({ id: 'ipv4-invalid' })
      ),
    dnsAddress: Yup.string().required(intl.formatMessage({ id: 'dns-required' })),
    reason: Yup.string().required(intl.formatMessage({ id: 'restriction-reason' }))
  });

  const RestrictionDeviceSchema = Yup.object().shape({
    deviceName: Yup.string().required(intl.formatMessage({ id: 'device-name-required' })),
    // categoryId: Yup.string().required(intl.formatMessage({ id: 'category-required' })),
    ipAddress: Yup.string()
      .required(intl.formatMessage({ id: 'ipv4-invalid' }))
      .matches(
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        intl.formatMessage({ id: 'ipv4-invalid' })
      ),
    macAddress: Yup.string().required(intl.formatMessage({ id: 'mac-address-required' })),
    reason: Yup.string().required(intl.formatMessage({ id: 'restriction-reason' }))
  });

  const AirlineSchema = Yup.object().shape({
    name: Yup.string().required(intl.formatMessage({ id: 'name-airline-required' })),
    code: Yup.string()
      .matches(/^\S*$/, intl.formatMessage({ id: 'no-spaces-allowed' }))
      .required(intl.formatMessage({ id: 'code-airline-required' })),
    country: Yup.string().required(intl.formatMessage({ id: 'country-required' })),
    email: Yup.string()
      .email(intl.formatMessage({ id: 'email-invalid' }))
      .required(intl.formatMessage({ id: 'email-required' })),
    phoneNumber: Yup.string()
      .required(intl.formatMessage({ id: 'phone-number-required' }))
      .matches(/^[0-9]+$/, intl.formatMessage({ id: 'phone-number-must-be-number' }))
      .min(10, intl.formatMessage({ id: 'phone-number-max-10' }))
      .max(10, intl.formatMessage({ id: 'phone-number-max-10' }))
  });

  return {
    EndUserSchema,
    TelecommunicationSchema,
    CampaignSchema,
    DeviceSchema,
    DeviceModelSchema,
    PlanSchema,
    VoucherRedemptionSchema,
    VoucherDiscountSchema,
    SupplierSchema,
    AircraftSchema,
    GatewaySchema,
    PaymentMethodSchema,
    RoleUserSchema,
    OrderSchema,
    VendorSchema,
    RoleGroupSchema,
    SaleChannelSchema,
    BundleTelecomSchema,
    BundleAirlineSchema,
    RestrictionDomainSchema,
    RestrictionDeviceSchema,
    AirlineSchema
  };
}

export default useValidationSchemas;
