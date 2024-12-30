import { useState } from 'react';
import { useIntl } from 'react-intl';

//third-party
import Cookies from 'universal-cookie';
import { enqueueSnackbar } from 'notistack';

//utils
import axios from 'utils/axios';
import { API_PATH_AIRCRAFT } from 'utils/constant';
import { formatDate, getTailModel } from 'utils/handleData';

//types
import { NewAircraft, NewMaintenanceAircraft } from 'types';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

interface getDataParams {
  page?: number;
  pageSize?: number;
  filters?: string;
}

interface getDataMaintenanceParams extends getDataParams {
  type: 'hist' | 'list';
  fromDate?: string;
  endDate?: string;
}

interface actionParams {
  id?: string;
  typeChange?: 'device' | 'flight' | 'global' | 'aircraft';
  typeChangeStatus?: 'active' | 'terminate';
  idFlight?: string;
  aircraftId?: number;
}

interface actionMaintenanceParams {
  id?: number;
  action: 'add' | 'edit' | 'delete';
}

const useHandleAircraft = () => {
  const cookie = new Cookies();
  const accessToken = cookie.get('accessToken');
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const getDataAircraft = async (params?: getDataParams) => {
    try {
      const res = await axios.get(`${API_PATH_AIRCRAFT.dataAircraft}`, {
        headers: { Authorization: accessToken },
        params: { ...params }
      });
      if (res.data.code === 0) {
        setTotalPages(res.data.totalPages);
        const formatted = formatDate(res.data.data, ['maintenance_schedule', 'last_maintenance_date', 'year_manufactured']);
        return getTailModel(formatted);
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

  const handleAction = async (action: 'add' | 'edit' | 'delete', params: actionParams, dataBody?: NewAircraft | {}) => {
    try {
      const res = await axios.post(
        `${API_PATH_AIRCRAFT.actionAircraft}`,
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
            message: intl.formatMessage({ id: `${action}-aircraft-successfully` }),
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

  const fetchDataMaintenanceAircraft = async (params: getDataMaintenanceParams) => {
    try {
      const res = await axios.get(`${API_PATH_AIRCRAFT.maintenance}`, {
        headers: { Authorization: accessToken },
        params: { ...params }
      });
      if (res.data.code === 0) {
        setTotalPages(res.data.totalPages);
        const formatted = formatDate(res.data.data, ['maintenance_schedule', 'last_maintenance_date', 'year_manufactured']);
        return getTailModel(formatted);
      } else {
        return [];
      }
    } catch {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  };

  const handleActionMaintenanceAircraft = async (params: actionMaintenanceParams, dataBody: NewMaintenanceAircraft) => {
    try {
      const res = await axios.post(
        `${API_PATH_AIRCRAFT.actionMaintenance}`,
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
            message: intl.formatMessage({ id: `${params.action}-maintenance-successfully` }),
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
    } catch {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  };

  return { isLoading, totalPages, isReload, getDataAircraft, handleAction, fetchDataMaintenanceAircraft, handleActionMaintenanceAircraft };
};

export default useHandleAircraft;
