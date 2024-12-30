import Cookies from 'universal-cookie';
import axios from 'utils/axios';
import { API_PATH_DEVICES, API_PATH_AIRCRAFT, API_PATH_SESSION, API_PATH_PLAN } from 'utils/constant';

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

export async function getSession(deviceID: string, pageIndex: number, pageSize: number, idProduct?: number | undefined) {
  try {
    const res = await axios.get(`${API_PATH_SESSION.dataSession}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        filters: deviceID,
        pageSize: pageSize || 2,
        page: pageIndex || 1,
        productId: idProduct
      }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getDevice(deviceID: string) {
  try {
    const res = await axios.get(`${API_PATH_DEVICES.dataDevice}`, {
      headers: { Authorization: `${accessToken}` },
      params: { filters: deviceID, type: 'device' }
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

export async function getDeviceHealth(pageSize: number, pageIndex: number, deviceID: string) {
  try {
    const res = await axios.get(`${API_PATH_DEVICES.dataDeviceHealth}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        page: pageIndex,
        pageSize,
        filters: deviceID,
        type: 'device_health'
      }
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

export async function getMaintenanceSchedule(type: 'hist' | 'list') {
  try {
    const res = await axios.get(`${API_PATH_DEVICES.maintenanceSchedule}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        type
      }
    });
    return res.data;
  } catch {}
}

export async function postActionMaintenanceSchedule(action: 'add' | 'edit' | 'delete', id: string) {
  try {
    const res = await axios.post(
      `${API_PATH_DEVICES.actionMaintenance}`,
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
