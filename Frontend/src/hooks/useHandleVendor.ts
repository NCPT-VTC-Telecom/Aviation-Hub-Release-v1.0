import { useState } from 'react';
import { useIntl } from 'react-intl';

//third-party
import Cookies from 'universal-cookie';
import { enqueueSnackbar } from 'notistack';

//utils
import axios from 'utils/axios';
import { API_PATH_VENDOR } from 'utils/constant';

//types
import { NewVendor } from 'types';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { formatDate } from 'utils/handleData';

interface getDataParams {
  page?: number;
  pageSize?: number;
  filters?: string;
}

interface actionParams {
  id?: string;
  dataBody?: NewVendor;
}

const useHandleVendor = () => {
  const cookie = new Cookies();
  const accessToken = cookie.get('accessToken');
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [isReload, setIsReload] = useState(false);

  const getData = async (params?: getDataParams) => {
    try {
      const res = await axios.get(`${API_PATH_VENDOR.dataVendor}`, {
        headers: { Authorization: accessToken },
        params: { ...params }
      });
      if (res.data.code === 0) {
        setTotalPages(res.data.totalPages);
        const formattedDate = formatDate(res.data.data, ['expired_date']);
        return formattedDate;
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

  const handleAction = async (action: 'add' | 'edit' | 'delete', params: actionParams) => {
    try {
      const res = await axios.post(
        `${API_PATH_VENDOR.action}`,
        {
          data: {
            ...params.dataBody
          }
        },
        {
          headers: { Authorization: accessToken },
          params: { action: action, id: params.id }
        }
      );
      if (res.data.code === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: intl.formatMessage({ id: `${action}-vendor-successfully` }),
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
        setIsReload((prev) => !prev);
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

  return { isLoading, totalPages, getData, handleAction, isReload };
};

export default useHandleVendor;
