import {
  API_PATH_END_USER,
  // API_PATH_AIRCRAFT,
  API_PATH_FLIGHT,
  API_PATH_GATEWAY,
  API_PATH_ORDER,
  API_PATH_PAYMENT_METHOD,
  API_PATH_PLAN
} from 'utils/constant';
import axios from 'utils/axios';
import Cookies from 'universal-cookie';
import { format } from 'date-fns';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getProduct(type: string) {
  try {
    const res = await axios.get(`${API_PATH_PLAN.dataProduct}`, {
      headers: { Authorization: `${accessToken}` },
      params: { type }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getGateway() {
  try {
    const res = await axios.get(`${API_PATH_GATEWAY.dataGateway}`, {
      headers: { Authorization: `${accessToken}` }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getPaymentMethod() {
  try {
    const res = await axios.get(`${API_PATH_PAYMENT_METHOD.dataPaymentMethod}`, {
      headers: { Authorization: `${accessToken}` }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getAircraft(departureTime: Date) {
  try {
    const timeDeparture = format(departureTime, 'yyyy/MM/dd');

    const res = await axios.get(`${API_PATH_FLIGHT.dataFlight}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        departureTime: timeDeparture
      }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getAllUser() {
  try {
    const res = await axios.get(`${API_PATH_END_USER.dataEndUser}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        pageSize: 100,
        groupId: 2
      }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getUserInfo(userID: string) {
  try {
    const res = await axios.get(`${API_PATH_END_USER.dataEndUser}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        filters: userID,
        groupId: 2
      }
    });
    return res.data;
  } catch {
    return [];
  }
}

export async function postCreateOrder(record: any) {
  try {
    const res = await axios.post(
      `${API_PATH_ORDER.addOrder}`,
      { data: { ...record } },
      {
        headers: { Authorization: `${accessToken}` }
      }
    );
    return res.data;
  } catch (err) {}
}
