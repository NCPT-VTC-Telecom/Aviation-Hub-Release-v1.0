import { API_PATH_AUTHENTICATE, API_PATH_END_USER, API_PATH_FLIGHT, API_PATH_ORDER, API_PATH_SESSION } from 'utils/constant';
import axios from 'utils/axios';
import Cookies from 'universal-cookie';
//types
import { ChangePasswordUser } from 'types/end-user';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getUser(userId: string) {
  try {
    const res = await axios.get(`${API_PATH_END_USER.dataEndUser}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        filters: userId,
        groupId: 2
      }
    });

    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getUserFlight() {
  try {
    const res = await axios.get(`${API_PATH_FLIGHT.dataFlight}`, {
      headers: { Authorization: `${accessToken}` }
    });

    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getUserOrder(id: string) {
  try {
    const res = await axios.get(`${API_PATH_ORDER.dataOrder}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        filters: id
      }
    });

    return res.data;
  } catch (err) {
    return [];
  }
}

export async function postChangePassword(id: string, record: ChangePasswordUser) {
  try {
    const res = await axios.post(
      `${API_PATH_AUTHENTICATE.changePassword}`,
      { ...record },
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

export async function getSessionUser(userID: string) {
  try {
    const res = await axios.get(`${API_PATH_SESSION.dataSession}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        filters: userID
      }
    });

    return res.data;
  } catch (err) {
    console.error(err);
  }
}
