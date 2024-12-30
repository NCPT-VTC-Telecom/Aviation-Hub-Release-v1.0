import { useState } from 'react';
import { useIntl } from 'react-intl';

//third-party
import Cookies from 'universal-cookie';
import { enqueueSnackbar } from 'notistack';

//utils
import axios from 'utils/axios';
import { API_PATH_SALE_CHANNEL } from 'utils/constant';

//types
import { NewGateway } from 'types';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

interface getDataParams {
  page?: number;
  pageSize?: number;
  filters?: string;
}

interface actionParams {
  id?: number;
  action: 'edit' | 'add' | 'delete';
}

interface NewSaleChannel extends NewGateway {}

const useHandleSaleChannel = () => {
  const cookie = new Cookies();
  const accessToken = cookie.get('accessToken');
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const fetchDataSaleChannel = async (params?: getDataParams) => {
    try {
      const res = await axios.get(`${API_PATH_SALE_CHANNEL.dataSaleChannel}`, {
        headers: { Authorization: accessToken },
        params: { ...params }
      });
      if (res.data.code === 0) {
        setTotalPages(res.data.totalPages);
        return res.data.data;
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

  const handleActionSaleChannel = async (params: actionParams, dataBody?: NewSaleChannel | {}) => {
    try {
      const res = await axios.post(
        `${API_PATH_SALE_CHANNEL.actionSaleChannel}`,
        {
          ...dataBody
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
            message: intl.formatMessage({ id: `${params.action}-sale-channel-successfully` }),
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
        setIsReload((prev) => !prev);
      } else {
        enqueueSnackbar(intl.formatMessage({ id: `${params.action}-failed` }), {
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

  return { isLoading, isReload, totalPages, fetchDataSaleChannel, handleActionSaleChannel };
};

export default useHandleSaleChannel;
