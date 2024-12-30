import { useState } from 'react';
import { useIntl } from 'react-intl';

//third-party
import Cookies from 'universal-cookie';
import { enqueueSnackbar } from 'notistack';

//utils
import axios from 'utils/axios';
import { API_PATH_BILLING, API_PATH_TRANSACTION } from 'utils/constant';

import { formatDate } from 'utils/handleData';

interface getDataParams {
  page?: number;
  pageSize?: number;
  filters?: string;
}

const useHandleTransaction = () => {
  const cookie = new Cookies();
  const accessToken = cookie.get('accessToken');
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const fetchDataTransaction = async (params?: getDataParams) => {
    try {
      const res = await axios.get(`${API_PATH_TRANSACTION.dataTransaction}`, {
        headers: { Authorization: accessToken },
        params: { ...params }
      });
      if (res.data.code === 0) {
        setTotalPages(res.data.totalPages);
        const formattedDate = formatDate(res.data.data, ['created_date', 'transaction_date']);
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

  const fetchDataBilling = async (params?: getDataParams) => {
    try {
      const res = await axios.get(`${API_PATH_BILLING.dataBill}`, {
        headers: { Authorization: accessToken },
        params: { ...params }
      });
      if (res.data.code === 0) {
        setTotalPages(res.data.totalPages);
        const formattedDate = formatDate(res.data.data, ['created_date', 'billing_date']);
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

  return { isLoading, totalPages, fetchDataTransaction, fetchDataBilling };
};

export default useHandleTransaction;
