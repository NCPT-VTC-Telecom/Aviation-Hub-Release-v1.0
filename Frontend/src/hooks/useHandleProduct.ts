import { useState } from 'react';
import { useIntl } from 'react-intl';

//third-party
import Cookies from 'universal-cookie';
import { enqueueSnackbar } from 'notistack';

//utils
import axios from 'utils/axios';
import { API_PATH_PLAN, API_PATH_SALE_CHANNEL } from 'utils/constant';

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
  productId?: string;
  type: 'product' | 'telecom' | 'airline';
}

interface actionParams {
  id?: string;
  action: 'edit' | 'add' | 'delete';
}

const useHandleProduct = () => {
  const cookie = new Cookies();
  const accessToken = cookie.get('accessToken');
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const fetchDataProduct = async (params?: getDataParams) => {
    try {
      const res = await axios.get(`${API_PATH_PLAN.dataProduct}`, {
        headers: { Authorization: accessToken },
        params: { ...params }
      });
      if (res.data.code === 0) {
        setTotalPages(res.data.totalPages);
        const formattedData = formatDate(res.data.data, ['price.start_date', 'price.end_date']);
        return formattedData;
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

  const handleActionVoucher = async (params: actionParams, dataBody?: NewVoucherRedeemed | {}) => {
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
            message: intl.formatMessage({ id: `${params.action}-voucher-successfully` }),
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

  return { isLoading, isReload, totalPages, fetchDataProduct, handleActionVoucher };
};

export default useHandleProduct;
