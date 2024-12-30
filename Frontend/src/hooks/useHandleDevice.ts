import { useState } from 'react';
import { useIntl } from 'react-intl';

//third-party
import Cookies from 'universal-cookie';
import { enqueueSnackbar } from 'notistack';

//utils
import axios from 'utils/axios';
import { API_PATH_DEVICES } from 'utils/constant';
import { formatDate, getOption } from 'utils/handleData';

//types
import { NewDevice } from 'types';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

interface getDataParams {
  supplierId?: number;
  filters?: string;
}

interface getDataMaintenanceParams {
  page?: number;
  pageSize?: number;
  filters?: string;
  type: 'hist' | 'list';
  fromDate: string;
  endDate: string;
}

interface actionParams {
  id?: string;
  typeChange?: 'device' | 'flight' | 'global' | 'aircraft';
  typeChangeStatus?: 'active' | 'terminate';
  idFlight?: string;
  aircraftId?: number;
}

const useHandleDevice = () => {
  const cookie = new Cookies();
  const accessToken = cookie.get('accessToken');
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [isReload, setIsReload] = useState(false);

  const getDataDevice = async (
    pageSize: number,
    pageIndex: number,
    type: 'device' | 'device_type' | 'device_health',
    params?: getDataParams
  ) => {
    try {
      const res = await axios.get(`${API_PATH_DEVICES.dataDevice}`, {
        headers: { Authorization: accessToken },
        params: { pageSize, page: pageIndex, type, ...params }
      });
      if (res.data.code === 0) {
        if (type === 'device_type') {
          return getOption(res.data.data, 'name', 'id');
        } else {
          setTotalPages(res.data.totalPages);
          return formatDate(res.data.data, ['activation_date', 'deactivation_date', 'manufacturer_date']);
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

  const fetchDataMaintenanceDevice = async (params: getDataMaintenanceParams) => {
    try {
      const res = await axios.get(`${API_PATH_DEVICES.maintenanceSchedule}`, {
        headers: { Authorization: accessToken },
        params: { ...params }
      });
      if (res.data.code === 0) {
        setTotalPages(res.data.totalPages);
        return formatDate(res.data.data, ['activation_date', 'deactivation_date', 'manufacturer_date']);
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

  const handleAction = async (action: 'add' | 'edit' | 'delete', params: actionParams, dataBody?: NewDevice | {}) => {
    try {
      const res = await axios.post(
        `${API_PATH_DEVICES.actionDevice}`,
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
            message: intl.formatMessage({ id: `${action}-device-successfully` }),
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

  const handleActionMaintenanceDevice = async (action: 'add' | 'edit' | 'delete', params: actionParams, dataBody?: NewDevice | {}) => {
    try {
      const res = await axios.post(
        `${API_PATH_DEVICES.actionDevice}`,
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
            message: intl.formatMessage({ id: `${action}-maintenance-successfully` }),
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

  return { isLoading, totalPages, getDataDevice, fetchDataMaintenanceDevice, handleAction, handleActionMaintenanceDevice, isReload };
};

export default useHandleDevice;
