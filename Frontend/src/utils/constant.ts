export class API_PATH_AUTHENTICATE {
  static loginUser = '/v1/auth_management/login_admin'; // done
  static loginOAuth = '/v1/auth_management/login_auth'; //done
  static logout = '/v1/auth_management/logout';

  static registerUser = '/v1/auth_management/register'; // done

  static verifyLogin = '/v1/auth_management/verify_login'; // done
  static verifyEmail = '/v1/auth_management/verify_email'; //done

  static changePassword = '/v1/auth_management/change_password';
  static resetPassword = '/v1/auth_management/reset_password'; // done
}

export class API_PATH_ROLE {
  static dataRole = '/v1/role_management/data_role'; // done
  static addRole = '/v1/role_management/add_role'; //done
  static editRole = '/v1/role_management/edit_role'; // done
  static deleteRole = '/v1/role_management/delete_role'; //done
}

export class API_PATH_ORDER {
  static dataOrder = '/v1/order_management/data_order'; //done
  static addOrder = '/v1/order_management/create_order'; //done
  static totalRevenue = '/v1/order_management/total_revenue';
}

export class API_PATH_FLIGHT {
  static dataFlight = '/v1/flight_management/data_flight'; //done
}

export class API_PATH_AIRCRAFT {
  static dataAircraft = '/v1/flight_management/data_aircraft'; // done
  static addAircraft = '/v1/flight_management/add_aircraft'; //done
  static editAircraft = '/v1/flight_management/edit_aircraft'; // done
  static deleteAircraft = '/v1/flight_management/delete_aircraft'; //done
  static maintenance = '/v1/flight_management/data_maintenance_schedule_aircraft';
  static actionMaintenance = '/v1/flight_management/handle_maintenance_aircraft';

  static actionAircraft = '/v1/flight_management/handle_aircraft';
}

export class API_PATH_DEVICES {
  static dataDevice = '/v1/device_management/data_device'; // done
  static actionDevice = '/v1/device_management/handle_device'; // done

  //maintenance
  static maintenanceSchedule = '/v1/device_management/data_maintenance_schedule';
  static actionMaintenance = '/v1/device_management/handle_maintenance_schedule';

  static dataDeviceHealth = '/v1/device_management/data_device_health'; // done
  static chartDeviceHealth = '/v1/session_management/chart_session?type=device_health'; // done
}

export class API_PATH_SUPPLIER {
  static dataSupplier = '/v1/supplier_management/data_supplier'; //done
  static addSupplier = '/v1/supplier_management/add_supplier'; //done
  static editSupplier = '/v1/supplier_management/edit_supplier'; //done
  static deleteSupplier = '/v1/supplier_management/delete_supplier'; //done
}

export class API_PATH_END_USER {
  static dataEndUser = '/v1/user_management/data_user'; //done
  static addEndUser = '/v1/user_management/add_user'; //done
  static editEndUser = '/v1/user_management/edit_user'; //done
  static deleteEndUser = '/v1/user_management/delete_user'; //done

  static dataUserOrder = '/v1/user_management/data_user_order';
  static dataUserFlight = '/v1/user_management/data_user_flight';
  static dataDevice = '/v1/device_management/data_device'; // done
}

export class API_PATH_SESSION {
  static dataSession = '/v1/session_management/data_session'; //done
  static dataSessionActivities = '/v1/session_management/user_activities_session'; //done
  static dataSessionDetail = '/v1/session_management/data_session_detail'; //done

  static terminateSession = '/v1/session_management/terminate_session'; //done

  static totalDataUsageSession = '/v1/session_management/total_session_detail';
  static totalDataUsageFlight = '/v1/session_management/total_session_flight'; //done
}

export class API_PATH_PLAN {
  static dataProduct = '/v1/product_management/data_product'; // done
  static addProduct = '/v1/product_management/add_product'; //done
  static editProduct = '/v1/product_management/edit_product'; //done
  static deleteProduct = '/v1/product_management/delete_product'; //done
}

export class API_PATH_CHART {
  //session
  static dataSessionDevice = '/v1/session_management/chart_session?type=session_devices'; //done
  static dataSessionBrowser = '/v1/session_management/chart_session?type=session_browser'; //done
  static dataSessionDurationDay = '/v1/session_management/chart_session?type=session_duration_average_date'; //done
  static dataSessionPerDate = '/v1/session_management/chart_session?type=session_per_date'; //done
  //retail
  static dataRetailPlan = '/v1/session_management/chart_session?type=number_purchases_plan'; //done
  static dataRetailPlanPerDate = '/v1/session_management/chart_session?type=number_purchases_plan_date'; //done
  static dataRetailSaleChannel = '/v1/session_management/chart_session?type=number_purchases_sale_channel'; //done
  static dataRetailVoucherRedeemed = '/v1/session_management/chart_session?type=number_voucher_redeemed_campaign'; //done
  //Data Usage
  static dataUsageRole = '/v1/session_management/chart_session?type=total_data_usage_role'; //done
  static dataUsageRoleDate = '/v1/session_management/chart_session?type=total_data_usage_role_date'; //done
  static dataUsagePAXByCategories = '/v1/session_management/chart_session?type=total_pax_data_usage_session_name'; //done
  static dataUsagePAXCategoriesPerDate = '/v1/session_management/chart_session?type=total_pax_data_usage_session_name_date'; //done
}

export class API_PATH_PAYMENT_METHOD {
  static dataPaymentMethod = '/v1/payment_method_management/data_method'; //done
  static addPaymentMethod = '/v1/payment_method_management/add_method'; //done
  static editPaymentMethod = '/v1/payment_method_management/edit_method'; //done
  static deletePaymentMethod = '/v1/payment_method_management/delete_method'; //done
}

export class API_PATH_GATEWAY {
  static dataGateway = '/v1/gateway_management/data_gateway'; //done
  static addGateway = '/v1/gateway_management/add_gateway'; //done
  static editGateway = '/v1/gateway_management/edit_gateway'; //done
  static deleteGateway = '/v1/gateway_management/delete_gateway'; //done
}

export class API_PATH_VOUCHERS {
  static dataVouchers = '/v1/vouchers_management/data_vouchers'; //done
  static addVoucher = '/v1/vouchers_management/add_vouchers'; //done
  static deleteVoucher = '/v1/vouchers_management/delete_vouchers'; //done
  static editVoucher = '/v1/vouchers_management/edit_vouchers'; //done
  static actionVoucherRedeemed = '/v1/vouchers_management/handle_voucher';

  static dataVoucherDiscount = '/v1/discount_management/data_discount'; //done
  static actionVoucherDiscount = '/v1/discount_management/handle_discount'; //done
}

export class API_PATH_BILLING {
  static dataBill = '/v1/billing_management/data_billing'; //done
  static addBill = '/v1/billing_management/add_billing'; // done
  static editBill = '/v1/billing_management/edit_billing';
}

export class API_PATH_TRANSACTION {
  static dataTransaction = '/v1/transaction_management/data_transaction'; // done
  static addTransaction = '/v1/transaction_management/add_transaction';
  static editTransaction = '/v1/transaction_management/edit_transaction';
}

export class API_PATH_CUSTOMER_SERVICES {
  static dataMail = '/v1/customer_service_management/data_customer_service'; // done
  static responseMail = '/v1/customer_service_management/edit_customer_service'; //done
}

export class API_PATH_SYSTEM {
  static dataLog = '/v1/log_system/data_system'; // done
}

export class API_PATH_SALE_CHANNEL {
  static dataSaleChannel = '/v1/sale_channels_management/data_sale_channels'; //done
  static actionSaleChannel = '/v1/sale_channels_management/handle_sale_channels'; //done
}

export class API_PATH_BLACKLIST {
  static dataBlackList = '/v1/blacklist_management/data_blacklist'; //done
  static actionDomain = '/v1/blacklist_management/handle_blacklist_domains'; //done
  static actionDevice = '/v1/blacklist_management/handle_blacklist_devices'; //done
  static actionCategory = '/v1/blacklist_management/handle_blacklist_category'; //done
}

export class API_PATH_VENDOR {
  static dataVendor = '/v1/vendor_management/data_vendor'; //done
  static action = '/v1/vendor_management/handle_vendor'; //done
}

export class API_PATH_AIRLINE {
  static dataAirline = '/v1/airlines_management/data_airlines'; // done
  static action = '/v1/airlines_management/handle_airlines'; //done
}

export class API_PATH_HANDLE_EXCEL {
  static exportExcel = '/v1/excel_management/export_excel'; //done
  static exportExcelBlank = '/v1/excel_management/export_excel_blank'; //done
  static importExcel = '/v1/excel_management/import_excel'; //done
}

export class API_PATH_CAMPAIGN {
  static dataCampaign = '/v1/campaign_management/data_campaign'; // done
  static action = '/v1/campaign_management/handle_campaign'; //done
}
