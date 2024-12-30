import axios from 'utils/axios';
//constant
import { API_PATH_SESSION } from 'utils/constant';
//third-party
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getAllSession(pageIndex: number, pageSize: number, searchValue?: string) {
  try {
    const res = await axios.get(`${API_PATH_SESSION.dataSession}`, {
      headers: { Authorization: `${accessToken}` },
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

export async function postTerminateSession(id: string) {
  try {
    const res = await axios.post(
      `${API_PATH_SESSION.terminateSession}`,
      {},
      {
        headers: { Authorization: `${accessToken}` },
        params: {
          id
        }
      }
    );
    return res.data;
  } catch (err) {}
}
