//third party
import axios from 'utils/axios';
//constant
import { API_PATH_DEVICES, API_PATH_AIRCRAFT, API_PATH_SUPPLIER, API_PATH_HANDLE_EXCEL } from 'utils/constant';
//third-party
import Cookies from 'universal-cookie';
//types
import { NewDevice } from 'types/device';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getAllDevices(pageIndex: number, pageSize: number, searchValue?: string | null) {
  try {
    const res = await axios.get(`${API_PATH_DEVICES.dataDevice}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        pageSize: pageSize,
        page: pageIndex,
        filters: searchValue,
        type: 'device'
      }
    });
    return res.data;
  } catch (error: any) {
    return [];
  }
}

export async function getAllDeviceType() {
  try {
    const res = await axios.get(`${API_PATH_DEVICES.dataDevice}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        type: 'device_type'
      }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getAllAircraft() {
  try {
    const res = await axios.get(`${API_PATH_AIRCRAFT.dataAircraft}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        pageSize: 100
      }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function getAllSupplier() {
  try {
    const res = await axios.get(`${API_PATH_SUPPLIER.dataSupplier}`, {
      headers: { Authorization: `${accessToken}` },
      params: {
        filters: 'device'
      }
    });
    return res.data;
  } catch (err) {
    return [];
  }
}

export async function postImportExcel(type: string, data: NewDevice[]) {
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
      responseType: 'blob',
      params: {
        type
      }
    });
    const fileURL = window.URL.createObjectURL(new Blob([res.data]));
    // Create a temporary link to trigger the download
    const fileLink = document.createElement('a');
    fileLink.href = fileURL;
    fileLink.setAttribute('download', `data_${type}.xlsx`); // Set the download attribute (filename and extension)
    document.body.appendChild(fileLink);

    fileLink.click(); // Trigger the download

    // Clean up by removing the link and revoking the URL
    document.body.removeChild(fileLink);
    window.URL.revokeObjectURL(fileURL);

    return 'File downloaded successfully';
  } catch (err) {
    console.error(err);
  }
}
