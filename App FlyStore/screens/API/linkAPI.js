const api = 'https://api-authbeta.vtctelecom.com.vn/v1/';
const api_smart_sim = 'https://api-simcard.vtctelecom.com.vn/v1';
export const url_api = {
  sync: 'https://api-flywifibeta.vtctelecom.com.vn/v1/sync',
  login: api + 'login',
  api_get_listphone: api_smart_sim + '/common/get?action=listphone',
  api_get_sync: api_smart_sim + '/common/get?action=sync',
  api_get_list_goicuoc: api_smart_sim + '/common/get?action=list_goicuoc',
  api_post_image: api_smart_sim + '/sim/sync/image',
  api_post_register: api_smart_sim + '/sim/sync/register',
  api_change_password: api_smart_sim + '/sim/sync/register',
};
