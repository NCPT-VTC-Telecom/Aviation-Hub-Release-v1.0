//types
import { EndUser } from 'types/end-user';
import axios from 'utils/axios';
import { API_PATH_FLIGHT, API_PATH_ORDER, API_PATH_SESSION } from 'utils/constant';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');
export interface StartOfMonth {
  start_of_current_month: Date;
  start_of_last_month: Date;
}

export const getTotalWidget = (records: EndUser[], key: keyof EndUser, startOfMonth: StartOfMonth) => {
  const totalCurrentMonth = calculateTotalDataUsage(records, key, startOfMonth.start_of_current_month);
  const totalLastMonth = calculateTotalDataUsage(records, key, startOfMonth.start_of_last_month);

  const isLoss = totalCurrentMonth < totalLastMonth;
  const percentageChange = isLoss
    ? (((totalLastMonth - totalCurrentMonth) / totalLastMonth) * 100).toFixed(2)
    : (((totalCurrentMonth - totalLastMonth) / totalLastMonth) * 100).toFixed(2);
  return {
    totalOfMonth: totalCurrentMonth,
    isLoss: isLoss,
    percentageChange: percentageChange
  };
};

function calculateTotalDataUsage(records: EndUser[], key: keyof EndUser, startOfMonth: Date): number {
  return records.filter((record) => new Date(record.date) >= startOfMonth).reduce((total, record) => total + (record[key] as number), 0);
}

export async function getFlight(filters?: string) {
  try {
    const res = await axios.get(`${API_PATH_FLIGHT.dataFlight}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        filters
      }
    });

    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getSession(filters?: string) {
  try {
    const res = await axios.get(`${API_PATH_SESSION.dataSession}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        sessionStatus: filters
      }
    });

    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getRevenue(startDate: string | Date, endDate: string | Date) {
  try {
    const res = await axios.get(`${API_PATH_ORDER.totalRevenue}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        startDate: startDate,
        endDate: endDate
      }
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

export async function getTotalDataUsage(startDate: string | Date, endDate: string | Date) {
  try {
    const res = await axios.get(`${API_PATH_SESSION.totalDataUsageFlight}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        startDate: startDate,
        endDate: endDate
      }
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
}
