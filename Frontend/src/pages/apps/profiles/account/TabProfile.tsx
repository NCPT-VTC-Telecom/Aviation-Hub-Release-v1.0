// material-ui
import { Theme } from '@mui/material/styles';
import {
  useMediaQuery,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  Typography
} from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';

//Hook
import { FormattedMessage, useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

// project-imports
import MainCard from 'components/MainCard';
import { columnsHistoryUsedInternet, columnsRecentOrder } from 'components/ul-config/table-config/account/history-account';
// import Avatar from 'components/@extended/Avatar';

// assets
import { CallCalling, Gps, Sms } from 'iconsax-react';
import { getSessionUser, getUser, getUserOrder } from './model';

//types
import { EndUserData } from 'types/end-user';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { formatDateTime, getRouteHistory, useLangUpdate } from 'utils/handleData';
import useConfig from 'hooks/useConfig';
import { Order } from 'types/order';
import { FlightData } from 'types/aviation';

// const avatarImage = require.context('assets/images/users', true);

// ==============================|| ACCOUNT PROFILE - BASIC ||============================== //

const TabProfile = () => {
  const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const intl = useIntl();
  const [userInfo, setUserInfo] = useState<EndUserData>();
  const [historyFlight, setHistoryFlight] = useState<FlightData[]>([]);
  const [historyOrder, setHistoryOrder] = useState<Order[]>([]);
  const [totalOrder, setTotalOrder] = useState();
  const { id } = useParams();
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  async function getDataUser(id: string) {
    try {
      const res = await getUser(id);
      setUserInfo(res.data[0]);
    } catch (err) {}
  }

  async function getRecentSession(userID: string) {
    try {
      const res = await getSessionUser(userID);
      const mapRoute = getRouteHistory(res.data);
      const dataFormatDateTime = formatDateTime(mapRoute, ['departure_time', 'created_date']);
      setHistoryFlight(dataFormatDateTime);
    } catch (err) {}
  }

  async function getHistoryOrder(id: string) {
    try {
      const res = await getUserOrder(id);
      const mapRoute = getRouteHistory(res.data);
      const dataFormatDateTime = formatDateTime(mapRoute, ['created_date']);
      setTotalOrder(res.total);
      setHistoryOrder(dataFormatDateTime);
    } catch (err) {}
  }

  useEffect(() => {
    if (id) {
      getDataUser(id);
      getRecentSession(id);
      getHistoryOrder(id);
    }

    //eslint-disable-next-line
  }, [id, i18n]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <MainCard>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end">
                <Chip
                  label={userInfo?.user_group[0] === 2 ? 'User' : 'Admin'}
                  size="small"
                  color={userInfo?.user_group[0] === 2 ? 'success' : 'primary'}
                />
              </Stack>
              <Stack spacing={2.5} alignItems="center">
                {/* <Avatar alt="Avatar 1" size="xl" src={avatarImage(`./default.png`)} /> */}
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5">{userInfo?.fullname}</Typography>
                  <Typography color="secondary">{userInfo?.username}</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-around" alignItems="center">
                {/* <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5">86</Typography>
                  <Typography color="secondary">Post</Typography>
                </Stack> */}
                {/* <Divider orientation="vertical" flexItem /> */}
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5">{`${(userInfo?.total_spending || 0).toLocaleString('vi-VN')} VND`}</Typography>
                  <Typography color="secondary">
                    <FormattedMessage id="amount-paid" />
                  </Typography>
                </Stack>
                <Divider orientation="vertical" flexItem />
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5">{totalOrder || 0}</Typography>
                  <Typography color="secondary">
                    <FormattedMessage id="order" />
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 1 } }}>
                <ListItem>
                  <ListItemIcon>
                    <Sms size={18} />
                  </ListItemIcon>
                  <ListItemSecondaryAction>
                    <Typography align="right">{userInfo?.email}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CallCalling size={18} />
                  </ListItemIcon>
                  <ListItemSecondaryAction>
                    <Typography align="right">{userInfo?.phone_number}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Gps size={18} />
                  </ListItemIcon>
                  <ListItemSecondaryAction>
                    <Typography align="right">{userInfo?.country}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={9}>
        <MainCard title={intl.formatMessage({ id: 'account-details' })}>
          <List sx={{ py: 0 }}>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="fullname" />
                    </Typography>
                    <Typography>{userInfo?.fullname}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="username" />
                    </Typography>
                    <Typography>{userInfo?.username}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="phone-number" />
                    </Typography>
                    <Typography>
                      (+84) <PatternFormat value={userInfo?.phone_number} displayType="text" type="text" format="#### ### ###" />
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="country" />
                    </Typography>
                    <Typography>{userInfo?.country}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="email-address" />
                    </Typography>
                    <Typography>{userInfo?.email}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="postcode" />
                    </Typography>
                    <Typography>{userInfo?.postcode}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem>
              <Stack spacing={0.5}>
                <Typography color="secondary">
                  <FormattedMessage id="address" />
                </Typography>
                <Typography>
                  {(userInfo?.address || '') +
                    ', ' +
                    (userInfo?.ward || '') +
                    ', ' +
                    (userInfo?.district || '') +
                    ', ' +
                    (userInfo?.province || '')}
                </Typography>
              </Stack>
            </ListItem>
          </List>
        </MainCard>
      </Grid>

      <Grid item xs={12}>
        <MainCard sx={{ '.MuiCardContent-root': { padding: 0 } }} title={intl.formatMessage({ id: 'recent-activities' })}>
          <GeneralizedTable
            columns={columnsHistoryUsedInternet}
            data={historyFlight}
            size={3}
            sortColumns="created_date"
            isDecrease={true}
            hiddenPagination
          ></GeneralizedTable>
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <MainCard sx={{ '.MuiCardContent-root': { padding: 0 } }} title={intl.formatMessage({ id: 'recent-order-history' })}>
          <GeneralizedTable
            columns={columnsRecentOrder}
            isDecrease={true}
            data={historyOrder}
            size={3}
            sortColumns="created_date"
            hiddenPagination
          ></GeneralizedTable>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default TabProfile;
