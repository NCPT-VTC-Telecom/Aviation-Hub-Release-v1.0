//third-party
import axios from 'utils/axios';
//constant
import { API_PATH_SUPPLIER, API_PATH_HANDLE_EXCEL } from 'utils/constant';
//types
import { NewProvider } from 'types/provider';
//third-party
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getAllSuppliers(pageIndex: number, pageSize: number, searchValue?: string) {
  try {
    const res = await axios.get(`${API_PATH_SUPPLIER.dataSupplier}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        filters: searchValue,
        pageSize: pageSize,
        page: pageIndex,
        type: 'device'
      }
    });
    return res.data;
  } catch (error: any) {
    return [];
  }
}

export async function postAddSupplier(newRecord: NewProvider) {
  try {
    const res = await axios.post(`${API_PATH_SUPPLIER.addSupplier}`, { ...newRecord }, { headers: { Authorization: `${accessToken}` } });
    return res.data;
  } catch (err) {}
}

export async function postEditSupplier(id: string, record: NewProvider) {
  try {
    const res = await axios.post(
      `${API_PATH_SUPPLIER.editSupplier}`,
      {
        ...record
      },
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

export async function postDeleteSupplier(id: string) {
  try {
    const res = await axios.post(
      `${API_PATH_SUPPLIER.deleteSupplier}`,
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

export async function postImportExcel(type: string, data: NewProvider[]) {
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
          typeSupplier: 'device'
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
        typeSupplier: 'device'
      }
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
}
