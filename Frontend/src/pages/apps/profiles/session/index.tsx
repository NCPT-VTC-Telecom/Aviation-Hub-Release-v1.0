import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import useConfig from 'hooks/useConfig';
import {
  FormattedMessage,
  useIntl
  // useIntl
} from 'react-intl';

// material-ui
import { Theme } from '@mui/material/styles';
import {
  useMediaQuery,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Stack,
  Typography,
  Button,
  Chip,
  Link
  // Dialog
} from '@mui/material';

//third-party
import { enqueueSnackbar } from 'notistack';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { columnsSessionDetail } from 'components/ul-config/table-config/session';

// assets
import { Devices, Airplane, Box1, CloudRemove } from 'iconsax-react';

//types
import { SessionData, Product, SessionGeneral } from 'types/end-user';

//model & utils
import { getAllSessionDetail, getSessionGeneral } from './model';
import { formatDate, formatDateTime, getTimeSession, useLangUpdate } from 'utils/handleData';

//redux
import { FlightData } from 'types/aviation';
import useFlightPhaseTooltip from 'hooks/useFlightPhase';
import { getTypePackages } from 'utils/getData';
// import ViewDialog from 'components/template/ViewDialog';
// import { sessionConfig } from 'components/ul-config/view-dialog-config';
// import { PopupTransition } from 'components/@extended/Transitions';

interface UserInfo {
  id: string;
  fullname: string;
  email: string;
  phone_number: string | null;
  username: string;
}

const SessionProfile = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [sessionInfo, setSessionInfo] = useState<SessionGeneral>();
  const [sessionDetail, setSessionDetail] = useState<SessionData[]>([]);
  const [productInfo, setProductInfo] = useState<Product>();
  const [flightInfo, setFlightInfo] = useState<FlightData>();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [totalSession, setTotalSession] = useState<number>(0);

  const getFlightPhase = flightInfo?.flight_phase ? flightInfo.flight_phase : 0;
  const flightPhase = useFlightPhaseTooltip(getFlightPhase);

  const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  // const { getStatusMessage } = useMapStatus();
  const { sessionID } = useParams();
  const { i18n } = useConfig();
  const navigate = useNavigate();
  const intl = useIntl();
  useLangUpdate(i18n);

  async function getSessionDetail(sessionID: string) {
    try {
      const res = await getAllSessionDetail(pageIndex, pageSize, sessionID);
      if (res.code === 0) {
        setTotalPages(res.totalPages);
        setTotalSession(res.total);
        const formattedDateTime = formatDateTime(res.data, [
          'session.start_time',
          'session.stop_time',
          'session.duration_time',
          'flight.departure_time',
          'flight.arrival_time'
        ]);
        const formattedDate = formatDate(formattedDateTime, ['device.date_of_manufacture', 'device.activation_date']);
        const mapSessionTime = getTimeSession(formattedDate);
        setSessionDetail(mapSessionTime);
      }
    } catch (err: any) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  }

  async function getSessionInfo(sessionID: string) {
    try {
      const res = await getSessionGeneral(sessionID);
      const formattedDate = formatDateTime(res.data, [
        'session.start_time',
        'session.stop_time',
        'session.duration_time',
        'flight.departure_time',
        'flight.arrival_time',
        'device.date_of_manufacture',
        'device.activation_date'
      ]);
      setSessionInfo(formattedDate[0]);
      setProductInfo(formattedDate[0].product);
      setFlightInfo(formattedDate[0].flight);
      setUserInfo(formattedDate[0].user);
    } catch {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  }

  const handlePageChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex + 1);
    setPageSize(newPageSize);
  };

  const handleAdd = () => {
    setAdd(!add);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo(() => {
    return columnsSessionDetail(pageIndex, pageSize, handleAdd, handleClose);
    //eslint-disable-next-line
  }, [pageIndex, pageSize]);

  useEffect(() => {
    if (sessionID) {
      getSessionDetail(sessionID);
      getSessionInfo(sessionID);
    }
    //eslint-disable-next-line
  }, [sessionID, i18n, pageSize, pageIndex]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <MainCard className="mb-5">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                // className="flex justify-between items-center flex-row"
              >
                <Typography variant="h5" className="mb-3">
                  <FormattedMessage id="user-info" />
                </Typography>

                {sessionInfo?.session_status === 'Active' ? (
                  <Chip color="success" label={intl.formatMessage({ id: 'active' })} size="small" variant="light" />
                ) : (
                  <Chip color="error" label={intl.formatMessage({ id: 'inactive' })} size="small" variant="light" />
                )}
              </Stack>

              <List sx={{ py: 0 }}>
                <ListItem>
                  <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center" className="w-full">
                    <Typography color="secondary">
                      <FormattedMessage id="username" />:
                    </Typography>
                    <Typography>{userInfo?.username}</Typography>
                  </Stack>
                </ListItem>

                <ListItem>
                  <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center" className="w-full">
                    <Typography color="secondary">
                      <FormattedMessage id="fullname" />:
                    </Typography>
                    <Typography>{userInfo?.fullname}</Typography>
                  </Stack>
                </ListItem>

                <ListItem>
                  <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center" className="w-full">
                    <Typography color="secondary">
                      <FormattedMessage id="email" />:
                    </Typography>
                    <Typography>{userInfo?.email}</Typography>
                  </Stack>
                </ListItem>

                <ListItem className="pb-0">
                  <Stack direction="row" justifyContent="space-between" alignItems="center" className="w-full">
                    <Typography color="secondary">
                      <FormattedMessage id="phone-number" />:
                    </Typography>
                    <Typography>{userInfo?.phone_number}</Typography>
                  </Stack>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-around" alignItems="center">
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5">{sessionInfo?.total_time_usage_hour}h</Typography>
                  <Typography color="secondary">
                    <FormattedMessage id="access-time" />
                  </Typography>
                </Stack>
                <Divider orientation="vertical" flexItem />
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5">{sessionInfo?.total_data_usage} MB</Typography>
                  <Typography color="secondary">
                    <FormattedMessage id="data-usage" />
                  </Typography>
                </Stack>
                <Divider orientation="vertical" flexItem />
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5">{totalSession || 0}</Typography>
                  <Typography color="secondary">
                    <FormattedMessage id="session" />
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
                    <Airplane size={20} />
                  </ListItemIcon>
                  <ListItemSecondaryAction>
                    <Link
                      component="button"
                      onClick={() => {
                        navigate(`/flight/profile/${flightInfo?.aircraft?.flight_number}`);
                      }}
                    >
                      {flightInfo?.aircraft?.flight_number}
                    </Link>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Box1 size={20} />
                  </ListItemIcon>
                  <ListItemSecondaryAction>
                    <Link
                      component="button"
                      onClick={() => {
                        navigate(`/package/profile/${productInfo?.id}-${productInfo?.type}`);
                      }}
                    >
                      {productInfo?.title}
                    </Link>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Devices size={20} />
                  </ListItemIcon>
                  <ListItemSecondaryAction>
                    <Link
                      component="button"
                      onClick={() => {
                        navigate(`/device/profile/${sessionInfo?.device.id}`);
                      }}
                    >
                      {sessionInfo?.device?.name}
                    </Link>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </MainCard>
        {sessionInfo?.session_status === 'Active' && (
          <MainCard>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack>
                  <Button
                    color="error"
                    variant={hover ? 'contained' : 'outlined'}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                  >
                    <CloudRemove size={24} className="mr-4" />
                    <FormattedMessage id="terminate" />
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        )}
      </Grid>
      <Grid item xs={12} md={8}>
        <MainCard title={false} content={false} sx={{ padding: '0 20px' }}>
          <Typography variant="h5" className="my-4">
            <FormattedMessage id="flight-details" />
          </Typography>
          <List sx={{ py: 0 }}>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="flight-number" />
                    </Typography>
                    <Typography>{flightInfo?.aircraft?.flight_number}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="tail-number" />
                    </Typography>
                    <Typography>{flightInfo?.aircraft?.tail_number}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="departure-airport" />
                    </Typography>
                    <Typography>{flightInfo?.departure_airport}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="arrival_airport" />
                    </Typography>
                    <Typography>{flightInfo?.arrival_airport}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="departure-time" />
                    </Typography>
                    <Typography>{flightInfo?.departure_time}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="arrival-time" />
                    </Typography>
                    <Typography>{flightInfo?.arrival_time}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="flight-phase" />
                    </Typography>
                    <Typography>{flightPhase}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="airline" />
                    </Typography>
                    <Typography>{flightInfo?.airline}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
          </List>
          <Typography variant="h5" className="my-4">
            <FormattedMessage id="plan-info" />
          </Typography>
          <List sx={{ py: 0 }}>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="plan-name" />
                    </Typography>
                    <Typography>{productInfo?.title}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="plan-type" />
                    </Typography>
                    <Typography>{getTypePackages(productInfo?.type as string)}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>

            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="bandwidth-upload" />
                    </Typography>
                    <Typography>{productInfo?.bandwidth_upload} Mbps</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="bandwidth-download" />
                    </Typography>
                    <Typography>{productInfo?.bandwidth_download} Mbps</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>

            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="data-upload" />
                    </Typography>
                    <Typography>{productInfo?.data_upload} MB</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="data-download" />
                    </Typography>
                    <Typography>{productInfo?.data_download} MB</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>

            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="data-total" />
                    </Typography>
                    <Typography>{productInfo?.data_total} MB</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="total-time" />
                    </Typography>
                    <Typography>
                      {productInfo?.total_time} <FormattedMessage id="minutes" />
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>

            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={0.5}>
                    <Typography color="secondary">
                      <FormattedMessage id="desc" />
                    </Typography>
                    <Typography>{productInfo?.description}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
          </List>
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <MainCard content={false}>
          <ScrollX>
            <GeneralizedTable
              columns={columns}
              totalPages={totalPages}
              data={sessionDetail}
              handleAdd={handleAdd}
              onPageChange={handlePageChange}
              sortColumns="index"
              size={5}
            />
          </ScrollX>
          {/* <Dialog
            maxWidth="sm"
            TransitionComponent={PopupTransition}
            keepMounted
            fullWidth
            onClose={handleAdd}
            open={add}
            sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
            aria-describedby="alert-dialog-slide-description"
          >
            <ViewDialog title="session-info" config={sessionConfig} open={openDialog} onClose={handleCloseView} data={record} />
          </Dialog> */}
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default SessionProfile;
