import axios from 'utils/axios';
import { API_PATH_GATEWAY, API_PATH_HANDLE_EXCEL } from 'utils/constant';
import Cookies from 'universal-cookie';
//types
import { NewGateway } from 'types/order';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getGateway(pageIndex: number, pageSize: number, searchValue?: string) {
  try {
    const res = await axios.get(`${API_PATH_GATEWAY.dataGateway}`, {
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

export async function postEditGateway(id: number, newRecord: NewGateway) {
  try {
    const res = await axios.post(
      `${API_PATH_GATEWAY.editGateway}`,
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

export async function postAddGateway(newRecord: NewGateway) {
  try {
    const res = await axios.post(
      `${API_PATH_GATEWAY.addGateway}`,
      {
        ...newRecord
      },
      { headers: { Authorization: `${accessToken}` } }
    );
    return res.data;
  } catch (err) {}
}

export async function postDeleteGateway(id: number) {
  try {
    const res = await axios.post(
      `${API_PATH_GATEWAY.deleteGateway}`,
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

export async function postImportExcel(type: string, data: NewGateway[]) {
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
