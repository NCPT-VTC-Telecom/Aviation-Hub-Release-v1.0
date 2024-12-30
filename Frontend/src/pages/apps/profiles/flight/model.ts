import Cookies from 'universal-cookie';
import axios from 'utils/axios';
import { API_PATH_FLIGHT, API_PATH_ORDER, API_PATH_PLAN, API_PATH_SESSION } from 'utils/constant';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getFlight(flightNumber: string) {
  try {
    const res = await axios.get(`${API_PATH_FLIGHT.dataFlight}`, {
      headers: { Authorization: `${accessToken}` },
      params: { filters: flightNumber }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getSession(flightNumber: string, pageIndex?: number, pageSize?: number, productId?: number) {
  try {
    const res = await axios.get(`${API_PATH_SESSION.dataSession}`, {
      headers: { Authorization: `${accessToken}` },
      params: { filters: flightNumber, pageSize: pageSize || 2, page: pageIndex || 1, productId }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getProduct() {
  try {
    const res = await axios.get(`${API_PATH_PLAN.dataProduct}`, {
      headers: { Authorization: `${accessToken}` },
      params: { type: 'product', pageSize: 100 }
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

export async function getRevenue(flightID: number) {
  try {
    const res = await axios.get(`${API_PATH_ORDER.totalRevenue}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        flightId: flightID
      }
    });
    return res.data;
  } catch {}
}

export async function getDataUsageFlight(flightID: number) {
  try {
    const res = await axios.get(`${API_PATH_SESSION.totalDataUsageFlight}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        flightId: flightID
      }
    });
    return res.data;
  } catch {}
}
