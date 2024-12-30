import { useState } from 'react';
import { useIntl } from 'react-intl';

//third-party
import Cookies from 'universal-cookie';
import { enqueueSnackbar } from 'notistack';

//utils
import axios from 'utils/axios';
import { API_PATH_AIRLINE } from 'utils/constant';
import { formatDate, getOption } from 'utils/handleData';

//types
import { NewAirline } from 'types';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

interface getDataParams {
  pageSize?: number;
  page?: number;
  filters?: string;
}

interface actionParams {
  id?: number;
  dataBody?: NewAirline;
}

const useHandleCustomerServices = () => {
  const cookie = new Cookies();
  const accessToken = cookie.get('accessToken');
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const getDataCustomerServices = async (params: getDataParams, type?: 'option') => {
    try {
      const res = await axios.get(`${API_PATH_AIRLINE.dataAirline}`, {
        headers: { Authorization: accessToken },
        params: { ...params }
      });
      if (res.data.code === 0) {
        if (type === 'option') {
          return getOption(res.data.data, 'name', 'id');
        } else {
          setTotalPages(res.data.totalPages);
          return formatDate(res.data.data, ['created_date']);
        }
      } else {
        return [];
      }
    } catch (error) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionAirline = async (action: 'add' | 'edit' | 'delete', params: actionParams) => {
    try {
      const res = await axios.post(
        `${API_PATH_AIRLINE.action}`,
        {
          data: {
            ...params.dataBody
          }
        },
        {
          headers: { Authorization: accessToken },
          params: { type: action, ...params }
        }
      );
      if (res.data.code === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: intl.formatMessage({ id: `${action}-airline-successfully` }),
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
      } else {
        enqueueSnackbar(intl.formatMessage({ id: `${action}-failed` }), {
          variant: 'error'
        });
        return res.data;
      }
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  };

  return { isLoading, totalPages, getDataCustomerServices, handleActionAirline };
};

export default useHandleCustomerServices;
