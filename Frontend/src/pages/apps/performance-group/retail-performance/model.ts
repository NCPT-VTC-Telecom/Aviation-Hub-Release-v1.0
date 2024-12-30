import axios from 'utils/axios';
import Cookies from 'universal-cookie';

import { API_PATH_CHART } from 'utils/constant';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getDataChartPlan(fromDate: string, endDate: string) {
  try {
    const res = await axios.get(`${API_PATH_CHART.dataRetailPlan}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        fromDate: fromDate,
        endDate: endDate
      }
    });

    return res.data;
  } catch (err) {}
}

export async function getDataChartPlanPerDate(fromDate: string, endDate: string) {
  try {
    const res = await axios.get(`${API_PATH_CHART.dataRetailPlanPerDate}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        fromDate: fromDate,
        endDate: endDate
      }
    });

    return res.data;
  } catch (err) {}
}

export async function getDataChartPaymentMethod(fromDate: string, endDate: string) {
  try {
    const res = await axios.get(`${API_PATH_CHART.dataRetailSaleChannel}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        fromDate: fromDate,
        endDate: endDate
      }
    });
    return res.data;
  } catch (err) {}
}

export async function getDataChartVoucherRedeemed(fromDate: string, endDate: string) {
  try {
    const res = await axios.get(`${API_PATH_CHART.dataRetailVoucherRedeemed}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        fromDate: fromDate,
        endDate: endDate
      }
    });
    return res.data;
  } catch (err) {}
}
