import axios from 'utils/axios';
import { API_PATH_VENDOR } from 'utils/constant';
import Cookies from 'universal-cookie';
//types
import { NewGateway } from 'types/order';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getDataVendor(pageIndex: number, pageSize: number, searchValue?: string) {
  try {
    const res = await axios.get(`${API_PATH_VENDOR.dataVendor}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        pageSize,
        pageIndex,
        filters: searchValue
      }
    });
    return res.data;
  } catch {}
}

export async function postActionVendor(action: 'add' | 'edit' | 'delete', data: NewGateway | {}, id?: string) {
  try {
    const res = await axios.post(
      `${API_PATH_VENDOR.action}`,
      {
        data: {
          ...data
        }
      },
      {
        headers: { Authorization: `${accessToken}` },
        params: {
          action,
          id
        }
      }
    );
    return res.data;
  } catch {}
}
