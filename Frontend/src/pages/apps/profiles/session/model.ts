//third-party
import axios from 'utils/axios';
//constant
import { API_PATH_SESSION } from 'utils/constant';
//third-party
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getAllSessionDetail(pageIndex: number, pageSize: number, sessionID: string) {
  try {
    const res = await axios.get(`${API_PATH_SESSION.dataSessionDetail}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        pageSize: pageSize,
        page: pageIndex,
        filters: sessionID
      }
    });
    return res.data;
  } catch (error: any) {
    return [];
  }
}

export async function getSessionGeneral(sessionID: string) {
  try {
    const res = await axios.get(`${API_PATH_SESSION.dataSession}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        filters: sessionID
      }
    });
    return res.data;
  } catch (error: any) {
    return [];
  }
}
