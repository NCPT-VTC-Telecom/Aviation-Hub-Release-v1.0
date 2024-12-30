import axios from 'utils/axios';
import { API_PATH_PAYMENT_METHOD, API_PATH_HANDLE_EXCEL } from 'utils/constant';
import Cookies from 'universal-cookie';
import { NewPaymentMethod } from 'types/order';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getPaymentMethod(pageIndex: number, pageSize: number, searchValue?: string) {
  try {
    const res = await axios.get(`${API_PATH_PAYMENT_METHOD.dataPaymentMethod}`, {
      headers: { Authorization: accessToken },
      params: {
        pageSize: pageSize,
        page: pageIndex,
        filters: searchValue
      }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function postEditPaymentMethod(id: number, newRecord: NewPaymentMethod) {
  try {
    const res = await axios.post(
      `${API_PATH_PAYMENT_METHOD.editPaymentMethod}`,
      { ...newRecord },
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

export async function postAddPaymentMethod(newRecord: NewPaymentMethod) {
  try {
    const res = await axios.post(
      `${API_PATH_PAYMENT_METHOD.addPaymentMethod}`,
      {
        ...newRecord
      },
      { headers: { Authorization: `${accessToken}` } }
    );
    return res.data;
  } catch (err) {}
}

export async function postDeletePaymentMethod(id: number) {
  try {
    const res = await axios.post(
      `${API_PATH_PAYMENT_METHOD.deletePaymentMethod}`,
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

export async function postImportExcel(type: string, data: NewPaymentMethod[]) {
  try {
    const res = await axios.post(
      `${API_PATH_HANDLE_EXCEL.importExcel}`,
      {
        data
      },
      {
        headers: { Authorization: `${accessToken}` },
        params: {
          type
        }
      }
    );
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

export async function getExportExcel(type: string) {
  try {
    const res = await axios.get(`${API_PATH_HANDLE_EXCEL.exportExcel}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        type
      }
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
}
