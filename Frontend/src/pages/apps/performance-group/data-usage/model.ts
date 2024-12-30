//API
import { API_PATH_CHART } from 'utils/constant';

//third-party
import axios from 'utils/axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getTotalDataUsage(fromDate: string | null, endDate: string | null) {
  try {
    const res = await axios.get(`${API_PATH_CHART.dataUsageRole}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        fromDate: fromDate,
        endDate: endDate
      }
    });
    return res.data;
  } catch (err) {}
}

export async function getTotalRolePerDate(fromDate: string | null, endDate: string | null) {
  try {
    const res = await axios.get(`${API_PATH_CHART.dataUsageRoleDate}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        fromDate: fromDate,
        endDate: endDate
      }
    });
    return res.data;
  } catch (err) {}
}

export async function getTotalPAXCategories(fromDate: string | null, endDate: string | null) {
  try {
    const res = await axios.get(`${API_PATH_CHART.dataUsagePAXByCategories}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        fromDate: fromDate,
        endDate: endDate
      }
    });
    return res.data;
  } catch (err) {}
}

export async function getTotalPAXCategoriesPerDate(fromDate: string | null, endDate: string | null) {
  try {
    const res = await axios.get(`${API_PATH_CHART.dataUsagePAXCategoriesPerDate}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        fromDate: fromDate,
        endDate: endDate
      }
    });
    return res.data;
  } catch (err) {}
}
