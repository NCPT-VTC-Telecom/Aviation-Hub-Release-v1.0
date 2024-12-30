import axios from 'utils/axios';
import { API_PATH_SYSTEM } from 'utils/constant';
//third-party
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getLogs(pageIndex: number, pageSize: number, searchValue?: string) {
  try {
    const res = await axios.get(`${API_PATH_SYSTEM.dataLog}`, {
      headers: {
        Authorization: `${accessToken}`
      },
      params: {
        pageSize: pageSize,
        page: pageIndex,
        filters: searchValue
      }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}
