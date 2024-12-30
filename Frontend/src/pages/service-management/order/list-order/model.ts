//third-party
import axios from 'utils/axios';
//constant
import { API_PATH_ORDER } from 'utils/constant';
//third-party
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getAllOrder(pageIndex: number, pageSize: number, searchValue?: string) {
  try {
    const res = await axios.get(`${API_PATH_ORDER.dataOrder}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        pageSize: pageSize,
        page: pageIndex,
        filters: searchValue
      }
    });
    return res.data;
  } catch (error: any) {
    return [];
  }
}
