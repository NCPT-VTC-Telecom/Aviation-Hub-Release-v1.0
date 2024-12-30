import axios from 'utils/axios';
import { API_PATH_END_USER, API_PATH_HANDLE_EXCEL } from 'utils/constant';
//third-party
import Cookies from 'universal-cookie';

//types
import { EditUser, NewUser } from 'types/end-user';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getEndUser(pageIndex: number, pageSize: number, searchValue?: string) {
  try {
    const res = await axios.get(`${API_PATH_END_USER.dataEndUser}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        pageSize: pageSize,
        page: pageIndex,
        filters: searchValue,
        groupId: 2
      }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function postEditEndUser(id: string, newRecord: EditUser) {
  try {
    const res = await axios.post(
      `${API_PATH_END_USER.editEndUser}`,
      { data: { ...newRecord } },
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

export async function postAddUser(newRecord: NewUser) {
  try {
    const res = await axios.post(
      `${API_PATH_END_USER.addEndUser}`,
      {
        data: { ...newRecord }
      },
      { headers: { Authorization: `${accessToken}` } }
    );
    return res.data;
  } catch (err) {}
}

export async function postDeleteUser(id: string) {
  try {
    const res = await axios.post(
      `${API_PATH_END_USER.deleteEndUser}`,
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

export async function postImportExcel(type: string, data: NewUser[]) {
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
          typeUser: 2
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
        typeUser: 2
      }
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
}
