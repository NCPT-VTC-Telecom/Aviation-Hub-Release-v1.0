import Cookies from 'universal-cookie';
import axios from 'utils/axios';
import { API_PATH_DEVICES, API_PATH_AIRCRAFT, API_PATH_SESSION, API_PATH_FLIGHT } from 'utils/constant';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getAircraft(tailNumber: string) {
  try {
    const res = await axios.get(`${API_PATH_AIRCRAFT.dataAircraft}`, {
      headers: { Authorization: `${accessToken}` },
      params: { filters: tailNumber }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getFlight(pageIndex: number, pageSize: number, tailNumber: string) {
  try {
    const res = await axios.get(`${API_PATH_FLIGHT.dataFlight}`, {
      headers: { Authorization: `${accessToken}` },
      params: { filters: tailNumber, page: pageIndex, pageSize: pageSize }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}
export async function getSession(flightNumber: string, pageIndex?: number, pageSize?: number) {
  try {
    const res = await axios.get(`${API_PATH_SESSION.dataSession}`, {
      headers: { Authorization: `${accessToken}` },
      params: { filters: flightNumber, pageSize: pageSize || 2, page: pageIndex || 1 }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getDevice(pageIndex: number, pageSize: number, tailNumber: string) {
  try {
    const res = await axios.get(`${API_PATH_DEVICES.dataDevice}`, {
      headers: { Authorization: `${accessToken}` },
      params: { filters: tailNumber, page: pageIndex, pageSize: pageSize, type: 'device' }
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

export async function getDataMaintenance(type: 'hist' | 'list') {
  try {
    const res = await axios.get(`${API_PATH_AIRCRAFT.maintenance}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        type
      }
    });
    return res.data;
  } catch {}
}

export async function postActionAircraftMaintenance(action: 'add' | 'edit' | 'delete', id: string) {
  try {
    const res = await axios.post(
      `${API_PATH_AIRCRAFT.actionMaintenance}`,
      {},
      {
        headers: { Authorization: `${accessToken}` },
        params: {
          action,
          id
        }
      }
    );
    return res.data;
  } catch (err) {}
}
