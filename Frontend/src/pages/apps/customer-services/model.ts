//utils
import axios from 'utils/axios';

//constant
import { API_PATH_CUSTOMER_SERVICES } from 'utils/constant';

//types
import { ResponseMail } from 'types/customer-services';

//third-party
import Cookies from 'universal-cookie';

interface FilterValues {
  start_date: string;
  end_date: string;
  statusID: number | null;
}

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

export async function getDataMail(pageIndex: number, pageSize: number, filter: FilterValues) {
  try {
    const res = await axios.get(
      `${API_PATH_CUSTOMER_SERVICES.dataMail}?pageSize=${pageSize}&page=${pageIndex}&startDate=${filter.start_date}&endDate=${
        filter.end_date
      }
      ${filter.statusID ? `&statusId=${filter.statusID}` : ''}`,
      {
        headers: { Authorization: `${accessToken}` }
      }
    );

    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function postResponseMail(id: string, record: ResponseMail) {
  try {
    const res = await axios.post(
      `${API_PATH_CUSTOMER_SERVICES.responseMail}`,
      { ...record },
      {
        headers: { Authorization: `${accessToken}` },
        params: {
          requestNumber: id
        }
      }
    );
    return res.data;
  } catch (err) {
    // return [];
  }
}
