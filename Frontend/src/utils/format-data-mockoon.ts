export function formatIsOnline(array: any) {
  return array.map((item: any) => {
    if (item.is_active === false) {
      return { ...item, is_online: false, installation_date: '' };
    } else {
      return { ...item };
    }
  });
}

export function formatUsersOnline(array: []) {
  return array.map((item: any) => {
    if (item.is_online === false) {
      return { ...item, users_online: 0 };
    } else {
      return { ...item };
    }
  });
}

export function formatSessionOnline(array: []) {
  return array.map((item: any) => {
    if (item.ifc_status === 'Offline') {
      return { ...item, session_active: 0 };
    } else {
      return { ...item };
    }
  });
}

export function formatDateWarranty(array: any) {
  return array.map((item: any) => {
    if (item.installation_date === '') {
      return { ...item, warranty: '' };
    } else {
      return { ...item };
    }
  });
}

export function formatMapCampaign(array: any) {
  return array.map((item: any) => {
    switch (item.name_voucher) {
      case 'Discount 25%':
        return { ...item, from_campaign: 'Campaign 3' };
      case 'Discount 30%':
        return { ...item, from_campaign: 'Campaign 2' };
      default:
        return { ...item, from_campaign: 'Campaign 1' };
    }
  });
}
