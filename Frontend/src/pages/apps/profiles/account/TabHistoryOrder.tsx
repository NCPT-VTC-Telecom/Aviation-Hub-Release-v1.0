// material-ui
import { Grid } from '@mui/material';

//Hook
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useConfig from 'hooks/useConfig';

// project-imports
import MainCard from 'components/MainCard';
import { columnsRecentOrder } from 'components/ul-config/table-config/account/history-account';
import GeneralizedTable from 'components/organisms/GeneralizedTable';

// model & utils
import { getUserOrder } from './model';
import { formatDateTime, getRouteHistory, useLangUpdate } from 'utils/handleData';

//types
import { Order } from 'types/order';

const TabHistoryOrderPage = () => {
  const intl = useIntl();

  const [historyOrder, setHistoryOrder] = useState<Order[]>([]);
  const { id } = useParams();
  const { i18n } = useConfig();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useLangUpdate(i18n);

  async function getHistoryOrder(id: string) {
    try {
      const res = await getUserOrder(id);
      const mapRoute = getRouteHistory(res.data);
      const dataFormatDateTime = formatDateTime(mapRoute, ['created_date']);
      setHistoryOrder(dataFormatDateTime);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      getHistoryOrder(id);
    }

    //eslint-disable-next-line
  }, [id, i18n]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard sx={{ '.MuiCardContent-root': { padding: 0 } }} title={intl.formatMessage({ id: 'recent-order-history' })}>
          <GeneralizedTable isLoading={isLoading} columns={columnsRecentOrder} data={historyOrder} sortColumns="index"></GeneralizedTable>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default TabHistoryOrderPage;
