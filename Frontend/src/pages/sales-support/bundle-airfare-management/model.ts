import axios from 'utils/axios';
import { API_PATH_PLAN, API_PATH_HANDLE_EXCEL } from 'utils/constant';

//third-party
import Cookies from 'universal-cookie';

//types
import { NewBundle } from 'types/product';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getAllPlans(pageIndex: number, pageSize: number, type: string, searchValue?: string) {
  try {
    const res = await axios.get(`${API_PATH_PLAN.dataProduct}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        pageSize: pageSize,
        page: pageIndex,
        type: type,
        filters: searchValue
      }
    });
    return res.data;
  } catch (error: any) {
    return [];
  }
}

export async function postAddProduct(record: NewBundle) {
  try {
    const res = await axios.post(
      `${API_PATH_PLAN.addProduct}`,
      { data: { ...record } },
      {
        headers: { Authorization: `${accessToken}` },
        params: {
          type: 'ticket'
        }
      }
    );
    return res.data;
  } catch (err) {}
}

export async function postEditProduct(id: number, record: NewBundle) {
  try {
    const res = await axios.post(
      `${API_PATH_PLAN.editProduct}`,
      { data: { ...record } },
      {
        headers: { Authorization: `${accessToken}` },
        params: {
          id,
          type: 'ticket'
        }
      }
    );
    return res.data;
  } catch (err) {}
}

export async function postDeleteProduct(id: number) {
  try {
    const res = await axios.post(
      `${API_PATH_PLAN.deleteProduct}`,
      {},
      {
        headers: { Authorization: `${accessToken}` },
        params: {
          id,
          type: 'ticket'
        }
      }
    );
    return res.data;
  } catch (err) {}
}

export async function postImportExcel(type: string, data: NewBundle[]) {
  try {
    const res = await axios.post(
      `${API_PATH_HANDLE_EXCEL.importExcel}`,
      {
        data
      },
      {
        headers: { Authorization: `${accessToken}` },
        params: {
          type,
          typeProduct: 'airline'
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
        type,
        typeProduct: 'airline'
      }
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
}
