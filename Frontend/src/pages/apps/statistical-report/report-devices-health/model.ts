import axios from 'utils/axios';
import { API_PATH_DEVICES } from 'utils/constant';
//third-party
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getDevicesHealth(pageIndex: number, pageSize: number) {
  try {
    const res = await axios.get(`${API_PATH_DEVICES.dataDevice}`, {
      headers: {
        Authorization: `${accessToken}`
      },
      params: {
        pageSize: pageSize,
        page: pageIndex,
        type: 'device_health'
      }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getChartDeviceHealth(fromDate: string, endDate: string) {
  try {
    const res = await axios.get(`${API_PATH_DEVICES.chartDeviceHealth}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        fromDate: fromDate,
        endDate: endDate
      }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}
