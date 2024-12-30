// material-ui
import { Grid } from '@mui/material';

//Hook
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

// project-imports
import MainCard from 'components/MainCard';
import { columnsHistoryUsedInternet } from 'components/ul-config/table-config/account/history-account';

// assets
import { getSessionUser } from './model';
// import useMapStatus from 'utils/mapStatus';

//types
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { formatDateTime, getRouteHistory, useLangUpdate } from 'utils/handleData';
import useConfig from 'hooks/useConfig';

//redux
import { enqueueSnackbar } from 'notistack';

const TabUsedInternetHistory = () => {
  const intl = useIntl();

  const [historyFlight, setHistoryFlight] = useState([{}]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const { getStatusMessage } = useMapStatus();
  const { id } = useParams();
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  async function getHistoryFlight(userID: string) {
    try {
      const res = await getSessionUser(userID);
      const mapRoute = getRouteHistory(res.data);
      const dataFormatDateTime = formatDateTime(mapRoute, ['departure_time', 'created_date']);
      setHistoryFlight(dataFormatDateTime);
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      getHistoryFlight(id);
    }
    //eslint-disable-next-line
  }, [id, i18n]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard sx={{ '.MuiCardContent-root': { padding: 0 } }} title={intl.formatMessage({ id: 'recent-activities' })}>
          <GeneralizedTable
            isLoading={isLoading}
            columns={columnsHistoryUsedInternet}
            data={historyFlight}
            sortColumns="index"
          ></GeneralizedTable>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default TabUsedInternetHistory;
