import { useState } from 'react';
import { useIntl } from 'react-intl';

//third-party
import Cookies from 'universal-cookie';
import { enqueueSnackbar } from 'notistack';

//utils
import axios from 'utils/axios';
import { API_PATH_FLIGHT } from 'utils/constant';
import { formatDateTime, getOption, getRouteHistory, getTimeFlight } from 'utils/handleData';

interface getDataParams {
  type?: 'option';
  pageSize?: number;
  page?: number;
  filters?: string;
}

const useHandleFlight = () => {
  const cookie = new Cookies();
  const accessToken = cookie.get('accessToken');
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const getDataFlight = async (params: getDataParams) => {
    try {
      const res = await axios.get(`${API_PATH_FLIGHT.dataFlight}`, {
        headers: { Authorization: accessToken },
        params: { ...params }
      });
      if (res.data.code === 0) {
        if (params.type === 'option') {
          return getOption(res.data.data, 'aircraft.flight_number', 'id');
        } else {
          setTotalPages(res.data.totalPages);
          const formattedDateTime = formatDateTime(res.data.data, ['created_date', 'departure_time', 'arrival_time']);
          const mapRoute = getRouteHistory(formattedDateTime);
          const mapTimeFlight = getTimeFlight(mapRoute);
          return mapTimeFlight;
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

  return { isLoading, totalPages, getDataFlight };
};

export default useHandleFlight;
