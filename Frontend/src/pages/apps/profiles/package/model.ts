import Cookies from 'universal-cookie';
import axios from 'utils/axios';
import { API_PATH_ORDER, API_PATH_PLAN } from 'utils/constant';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getPackage(id: string | number, type: string) {
  try {
    const res = await axios.get(`${API_PATH_PLAN.dataProduct}`, {
      headers: { Authorization: `${accessToken}` },
      params: { filters: id, type }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getOrder(pageSize: number, pageIndex: number, productID: number) {
  try {
    const res = await axios.get(`${API_PATH_ORDER.dataOrder}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        pageSize,
        page: pageIndex,
        filters: productID
      }
    });
    return res.data;
  } catch (err: any) {
    return [];
  }
}

export async function getRevenue(productID: number) {
  try {
    const res = await axios.get(`${API_PATH_ORDER.totalRevenue}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        productId: productID
      }
    });
    return res.data;
  } catch {}
}
