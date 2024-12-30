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
  type: 'add' | 'edit' | 'delete';
}

const useHandleAirline = () => {
  const cookie = new Cookies();
  const accessToken = cookie.get('accessToken');
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const getDataAirline = async (params: getDataParams, type?: 'option') => {
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

  const handleActionAirline = async (params: actionParams, dataBody?: NewAirline) => {
    try {
      const res = await axios.post(
        `${API_PATH_AIRLINE.action}`,
        {
          data: {
            ...dataBody
          }
        },
        {
          headers: { Authorization: accessToken },
          params: { ...params }
        }
      );
      if (res.data.code === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: intl.formatMessage({ id: `${params.type}-airline-successfully` }),
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
        setIsReload((prev) => !prev);
        return res.data;
      } else {
        enqueueSnackbar(intl.formatMessage({ id: `${params.type}-failed` }), {
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

  return { isLoading, isReload, totalPages, getDataAirline, handleActionAirline };
};

export default useHandleAirline;
