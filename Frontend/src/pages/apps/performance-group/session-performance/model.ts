//third party
import axios from 'utils/axios';
//constant
import { API_PATH_CHART } from 'utils/constant';
//third-party
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getDataChartBrowser(fromDate: string | null, endDate: string | null) {
  try {
    const res = await axios.get(`${API_PATH_CHART.dataSessionBrowser}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        fromDate: fromDate,
        endDate: endDate
      }
    });
    return res.data;
  } catch (err) {}
}

export async function getDataChartDevices(fromDate: string | null, endDate: string | null) {
  try {
    const res = await axios.get(`${API_PATH_CHART.dataSessionDevice}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        fromDate: fromDate,
        endDate: endDate
      }
    });
    return res.data;
  } catch (err) {}
}

export async function getDataChartSessionDuration(fromDate: string | null, endDate: string | null) {
  try {
    const res = await axios.get(`${API_PATH_CHART.dataSessionDurationDay}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        fromDate: fromDate,
        endDate: endDate
      }
    });
    return res.data;
  } catch (err) {}
}

export async function getDataChartSessionPerDate(fromDate: string | null, endDate: string | null) {
  try {
    const res = await axios.get(`${API_PATH_CHART.dataSessionPerDate}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        fromDate: fromDate,
        endDate: endDate
      }
    });
    return res.data;
  } catch (err) {}
}
