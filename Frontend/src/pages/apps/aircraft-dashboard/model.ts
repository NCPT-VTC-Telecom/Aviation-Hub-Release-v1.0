import axios from 'utils/axios';
import { API_PATH_FLIGHT } from 'utils/constant';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getFlight(departureTime?: string, arrivalTime?: string) {
  try {
    const res = await axios.get(`${API_PATH_FLIGHT.dataFlight}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        departureTime: departureTime,
        arrivalTime: arrivalTime
      }
    });

    return res.data;
  } catch (err) {
    return [];
  }
}
