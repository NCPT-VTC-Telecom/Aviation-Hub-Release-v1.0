import { useEffect, useState } from 'react';
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
  Link
} from '@mui/material';

//third-party
import { enqueueSnackbar } from 'notistack';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { Brodcast, Airplane } from 'iconsax-react';

//types
import { FlightData } from 'types/aviation';

//model & utils
import { getFlight, getRevenue, getSession } from './model';
import { formatDate, formatDateTime, formatYear, getRouteHistory, useLangUpdate } from 'utils/handleData';
import getChipStatus from 'pages/apps/common-components/form/field/renderChip';
import IconTailNumber from 'components/atoms/icons/tail-number';

//redux
import useFlightPhaseTooltip from 'hooks/useFlightPhase';

const TabProfile = () => {
  const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  // const intl = useIntl();
  const navigate = useNavigate();
  const [aircraftInfo, setAircraftInfo] = useState<FlightData>();
  const [totalSession, setTotalSession] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);
  const { flightNumber } = useParams();
  const getFlightPhase = aircraftInfo?.flight_phase ? aircraftInfo.flight_phase : 0;
  const flightPhase = useFlightPhaseTooltip(getFlightPhase);
  const { i18n } = useConfig();
  const intl = useIntl();
  useLangUpdate(i18n);

  async function getFlightInfo(flightNumber: string) {
    try {
      const res = await getFlight(flightNumber);
      const formattedDate = formatDateTime(res.data, ['departure_time', 'arrival_time']);
      const formattedMaintenanceDate = formatDate(formattedDate, ['aircraft.maintenance_schedule', 'aircraft.last_maintenance_date']);
      const setRoute = getRouteHistory(formattedMaintenanceDate);
      const revenueFlight = await getRevenue(res.data.id);
      setRevenue(revenueFlight.total);
      setAircraftInfo(setRoute[0]);
    } catch (err: any) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  }

  async function getTotalSession(flightNumber: string) {
    try {
      const res = await getSession(flightNumber);
      setTotalSession(res.total || 0);
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  }

  useEffect(() => {
    if (flightNumber) {
      getFlightInfo(flightNumber);
      getTotalSession(flightNumber);
    }
    //eslint-disable-next-line
  }, [flightNumber, i18n]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <MainCard>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <img
                src="https://cdn.jetphotos.com/400/6/576149_1708806984.jpg"
                alt="Aircraft"
                className="rounded-lg overflow-hidden w-full"
              />
            </Grid>
            {/* <Avatar alt="Avatar 1" size="xl" src={avatarImage(`./default.png`)} /> */}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-around" alignItems="center">
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5">0</Typography>
                  <Typography color="secondary" textAlign={'center'}>
                    <FormattedMessage id="plan" />
                  </Typography>
                </Stack>
                <Divider orientation="vertical" flexItem sx={{ marginLeft: 2, marginRight: 2 }} />
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5">{revenue.toLocaleString('vi-VN')}</Typography>
                  <Typography color="secondary" textAlign={'center'}>
                    <FormattedMessage id="revenue" />
                  </Typography>
                </Stack>
                <Divider orientation="vertical" flexItem sx={{ marginLeft: 2, marginRight: 2 }} />
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5">{totalSession || 0}</Typography>
                  <Link
                    component="button"
                    onClick={() => {
                      navigate(`/flight/session-list/${aircraftInfo?.aircraft?.flight_number}`);
                    }}
                  >
                    <Typography color="secondary" textAlign={'center'}>
                      <FormattedMessage id="session" />
                    </Typography>
                  </Link>
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
                    <Typography align="right">{aircraftInfo?.aircraft?.flight_number}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <IconTailNumber className="h-5 w-5" fill="#707E8A" />
                  </ListItemIcon>
                  <ListItemSecondaryAction>
                    <Typography align="right">{aircraftInfo?.aircraft?.tail_number}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Brodcast size={20} />
                  </ListItemIcon>
                  <ListItemSecondaryAction>{getChipStatus(aircraftInfo?.status_id || 11, 'online', 'offline')}</ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={9}>
        <MainCard title={false} content={false} sx={{ padding: '0 20px' }}>
          <Typography variant="h5" className="my-4">
            <FormattedMessage id="flight-details" />
          </Typography>
          <List sx={{ py: 0 }}>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="departure-airport" />
                    </Typography>
                    <Typography>{aircraftInfo?.departure_airport}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="arrival_airport" />
                    </Typography>
                    <Typography>{aircraftInfo?.arrival_airport}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="departure-time" />
                    </Typography>
                    <Typography>{aircraftInfo?.departure_time}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="arrival-time" />
                    </Typography>
                    <Typography>{aircraftInfo?.arrival_time}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="flight-phase" />
                    </Typography>
                    <Typography>{flightPhase}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="airline" />
                    </Typography>
                    <Typography>{aircraftInfo?.airline}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
          </List>
          <Typography variant="h5" className="my-4">
            <FormattedMessage id="aircraft-details" />
          </Typography>
          <List sx={{ py: 0 }}>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="flight-number" />
                    </Typography>
                    <Typography>{aircraftInfo?.aircraft?.flight_number}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="tail-number" />
                    </Typography>
                    <Typography>{aircraftInfo?.aircraft?.tail_number}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="model" />
                    </Typography>
                    <Typography>{aircraftInfo?.aircraft?.model}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="model-type" />
                    </Typography>
                    <Typography>{aircraftInfo?.aircraft?.model_type}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="manufacturer" />
                    </Typography>
                    <Typography>{aircraftInfo?.aircraft?.manufacturer}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="year-manufactured" />
                    </Typography>
                    <Typography>{formatYear((aircraftInfo?.aircraft?.year_manufactured as string) || null)}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="maintenance-schedule" />
                    </Typography>
                    <Typography>{aircraftInfo?.aircraft?.maintenance_schedule as string}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="last-maintenance-date" />
                    </Typography>
                    <Typography>{aircraftInfo?.aircraft?.last_maintenance_date as string}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                {/* <Grid item xs={12} md={6}>
                  <Stack spacing={0.5}     sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}>
                    <Typography color="secondary">
                      <FormattedMessage id="status" />
                    </Typography>
                    <div>
                      {aircraftInfo?.aircraft.status_id &&
                        getChipStatus(aircraftInfo?.aircraft.status_id, 'operational', 'out-of-operation', 'maintenance')}
                    </div>
                  </Stack>
                </Grid> */}
                <Grid item xs={12} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="ownership" />
                    </Typography>
                    <Typography>{aircraftInfo?.aircraft?.ownership}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
          </List>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default TabProfile;
