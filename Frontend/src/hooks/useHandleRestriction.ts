import { useState } from 'react';
import { useIntl } from 'react-intl';

//third-party
import Cookies from 'universal-cookie';
import { enqueueSnackbar } from 'notistack';

//utils
import axios from 'utils/axios';
import { API_PATH_BLACKLIST } from 'utils/constant';
import { formatDate, getOption } from 'utils/handleData';

//types
import { NewBlackListDevice, NewBlackListDomain } from 'types';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

interface getDataParams {
  type: 'domain' | 'category' | 'devices';
  pageSize?: number;
  page?: number;
  filters?: string;
}

interface actionParams {
  id?: number;
  dataBody?: NewBlackListDevice | NewBlackListDomain;
}

const useHandleRestriction = () => {
  const cookie = new Cookies();
  const accessToken = cookie.get('accessToken');
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const getDataRestriction = async (params: getDataParams) => {
    try {
      const res = await axios.get(`${API_PATH_BLACKLIST.dataBlackList}`, {
        headers: { Authorization: accessToken },
        params: { ...params }
      });
      if (res.data.code === 0) {
        if (params.type === 'category') {
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

  const handleActionRestriction = async (
    action: 'add' | 'edit' | 'delete',
    type: 'domain' | 'device' | 'category',
    params: actionParams
  ) => {
    try {
      const res = await axios.post(
        `${
          type === 'device'
            ? API_PATH_BLACKLIST.actionDevice
            : type === 'domain'
            ? API_PATH_BLACKLIST.actionDomain
            : API_PATH_BLACKLIST.actionCategory
        }`,
        {
          data: {
            ...params.dataBody
          }
        },
        {
          headers: { Authorization: accessToken },
          params: { type: action, id: params.id }
        }
      );
      if (res.data.code === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: intl.formatMessage({ id: `${action}-${type}-successfully` }),
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

  return { isLoading, totalPages, isReload, getDataRestriction, handleActionRestriction };
};

export default useHandleRestriction;
