import Cookies from 'universal-cookie';
import { API_PATH_BILLING, API_PATH_ORDER, API_PATH_TRANSACTION } from 'utils/constant';
import axios from 'utils/axios';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

interface EditBillingData {
  total: number;
  TotalQuantity: number;
}

interface EditTransactionData {
  total: number;
  subTotal: number;
}

export async function getOrder(orderNumber: string) {
  try {
    const res = await axios.get(`${API_PATH_ORDER.dataOrder}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        filters: orderNumber
      }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function postAddBilling(idOrder: string) {
  try {
    const res = await axios.post(
      `${API_PATH_BILLING.addBill}`,
      {},
      {
        headers: { Authorization: `${accessToken} ` },
        params: {
          idOrder
        }
      }
    );
    return res.data;
  } catch (err) {}
}

export async function postAddTransaction(idOrder: string) {
  try {
    const res = await axios.post(
      `${API_PATH_TRANSACTION.addTransaction}`,
      {},
      {
        headers: { Authorization: `${accessToken} ` },
        params: {
          idOrder
        }
      }
    );
    return res.data;
  } catch (err) {}
}

export async function postEditBilling(idOrder: string, dataEdit: EditBillingData) {
  try {
    const res = await axios.post(
      `${API_PATH_BILLING.editBill}`,
      { ...dataEdit },
      {
        headers: { Authorization: `${accessToken}` },
        params: {
          idOrder
        }
      }
    );
    return res.data;
  } catch (err) {}
}

export async function postEditTransaction(idOrder: string, dataEdit: EditTransactionData) {
  try {
    const res = await axios.post(
      `${API_PATH_TRANSACTION.editTransaction}`,
      { ...dataEdit },
      {
        headers: { Authorization: `${accessToken}` },
        params: {
          idOrder
        }
      }
    );
    return res.data;
  } catch (err) {}
}
