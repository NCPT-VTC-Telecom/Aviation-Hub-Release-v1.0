import { useState } from 'react';
import { useIntl } from 'react-intl';

//third-party
import Cookies from 'universal-cookie';
import { enqueueSnackbar } from 'notistack';

//utils
import axios from 'utils/axios';
import { API_PATH_SUPPLIER } from 'utils/constant';

//types
import { NewProvider } from 'types';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

interface getDataParams {
  type: 'device' | 'telecom';
  filters?: string;
}

interface actionParams {
  id?: string;
  typeChange?: 'device' | 'flight' | 'global' | 'aircraft';
  typeChangeStatus?: 'active' | 'terminate';
  idFlight?: string;
  aircraftId?: number;
}

const useHandleSupplier = () => {
  const cookie = new Cookies();
  const accessToken = cookie.get('accessToken');
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [isReload, setIsReload] = useState(false);

  const getDataSupplier = async (pageSize: number, pageIndex: number, params?: getDataParams) => {
    try {
      const res = await axios.get(`${API_PATH_SUPPLIER.dataSupplier}`, {
        headers: { Authorization: accessToken },
        params: { pageSize, page: pageIndex, ...params }
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

  const handleAction = async (action: 'add' | 'edit' | 'delete', params: actionParams, dataBody?: NewProvider | {}) => {
    try {
      const res = await axios.post(
        `${API_PATH_SUPPLIER.addSupplier}`,
        {
          data: {
            ...dataBody
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
            message: intl.formatMessage({ id: `${action}-supplier-successfully` }),
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
        setIsReload(true);
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

  return { isLoading, totalPages, getDataSupplier, handleAction, isReload };
};

export default useHandleSupplier;
