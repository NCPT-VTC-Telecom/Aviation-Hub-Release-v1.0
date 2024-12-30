//utils
import axios from 'utils/axios';

//constant
import { API_PATH_AIRCRAFT, API_PATH_HANDLE_EXCEL } from 'utils/constant';

//types
import { NewAircraft } from 'types/aviation';

//third-party
import Cookies from 'universal-cookie';
import { downloadFile } from 'utils/handleData';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getAircraft(pageIndex: number, pageSize: number, searchFilter?: string) {
  try {
    const res = await axios.get(`${API_PATH_AIRCRAFT.dataAircraft}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        pageSize: pageSize,
        page: pageIndex,
        filters: searchFilter
      }
    });

    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function postAddAircraft(newRecord: NewAircraft) {
  try {
    const res = await axios.post(
      `${API_PATH_AIRCRAFT.addAircraft}`,
      { data: { ...newRecord } },
      { headers: { Authorization: `${accessToken}` } }
    );
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function postEditAircraft(id: number, record: NewAircraft) {
  try {
    const res = await axios.post(
      `${API_PATH_AIRCRAFT.editAircraft}`,
      { data: { ...record } },
      {
        headers: { Authorization: `${accessToken}` },
        params: {
          id
        }
      }
    );
    return res.data;
  } catch (err) {
    // return [];
  }
}

export async function postDeleteAircraft(id: number) {
  try {
    const res = await axios.post(
      `${API_PATH_AIRCRAFT.deleteAircraft}`,
      {},
      {
        headers: { Authorization: `${accessToken}` },
        params: {
          id
        }
      }
    );
    return res.data;
  } catch (err) {
    // return [];
  }
}

export async function postImportExcel(type: string, data: NewAircraft[]) {
  try {
    const res = await axios.post(
      `${API_PATH_HANDLE_EXCEL.importExcel}`,
      {
        dataImportExcel: [...data]
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
      responseType: 'blob',
      params: {
        type
      }
    });
    downloadFile(new Blob([res.data]), 'data_aircraft.xlsx');
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

export async function getFormatExcel(type: string) {
  try {
    const res = await axios.get(`${API_PATH_HANDLE_EXCEL.exportExcelBlank}`, {
      headers: { Authorization: `${accessToken}` },
      responseType: 'blob',
      params: {
        type
      }
    });
    downloadFile(new Blob([res.data]), 'data_aircraft_blank.xlsx');
    return res.data;
  } catch (err) {
    console.error(err);
  }
}
