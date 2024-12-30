import { useState } from 'react';
import { useIntl } from 'react-intl';

//third-party
import Cookies from 'universal-cookie';
import { enqueueSnackbar } from 'notistack';

//utils
import axios from 'utils/axios';
import { API_PATH_VOUCHERS } from 'utils/constant';

//types
import { NewVoucherRedeemed } from 'types';

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
  id?: number;
  action: 'edit' | 'add' | 'delete';
}

const useHandleDiscount = () => {
  const cookie = new Cookies();
  const accessToken = cookie.get('accessToken');
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const fetchDataDiscount = async (params?: getDataParams) => {
    try {
      const res = await axios.get(`${API_PATH_VOUCHERS.dataVoucherDiscount}`, {
        headers: { Authorization: accessToken },
        params: { ...params }
      });
      if (res.data.code === 0) {
        setTotalPages(res.data.totalPages);
        const formattedDate = formatDate(res.data.data, ['date_from', 'date_end']);
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

  const handleActionDiscount = async (params: actionParams, dataBody?: NewVoucherRedeemed | {}) => {
    try {
      const res = await axios.post(
        `${API_PATH_VOUCHERS.actionVoucherDiscount}`,
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
            message: intl.formatMessage({ id: `${params.action}-voucher-successfully` }),
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

  return { isLoading, isReload, totalPages, fetchDataDiscount, handleActionDiscount };
};

export default useHandleDiscount;
