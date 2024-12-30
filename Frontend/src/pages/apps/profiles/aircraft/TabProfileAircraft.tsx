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
import { Building, Airplane } from 'iconsax-react';

//types
import { AircraftData } from 'types/aviation';

//model & utils
import { getAircraft, getDevice, getFlight } from './model';
import { formatDate, formatYear, getRouteHistory, useLangUpdate } from 'utils/handleData';
import IconTailNumber from 'components/atoms/icons/tail-number';

const TabProfile = () => {
  const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  // const intl = useIntl();
  const navigate = useNavigate();
  const [aircraftInfo, setAircraftInfo] = useState<AircraftData>();
  const [totalDeviceFlight, setTotalDeviceFlight] = useState<number>(0);
  const [totalHistoryFlight, setTotalHistoryFlight] = useState<number>(0);
  // const { getStatusMessage } = useMapStatus();
  const { tailNumber } = useParams();
  const { i18n } = useConfig();
  const intl = useIntl();
  useLangUpdate(i18n);

  async function getAircraftInfo(tailNumber: string) {
    try {
      const res = await getAircraft(tailNumber);
      const totalDevice = await getDevice(0, 1, tailNumber);
      const totalFlight = await getFlight(0, 1, tailNumber);
      setTotalDeviceFlight(totalDevice.total || 0);
      setTotalHistoryFlight(totalFlight.total || 0);
      const formattedDate = formatDate(res.data, ['maintenance_schedule', 'last_maintenance_date']);
      const setRoute = getRouteHistory(formattedDate);
      setAircraftInfo(setRoute[0]);
    } catch (err: any) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  }

  useEffect(() => {
    if (tailNumber) {
      getAircraftInfo(tailNumber);
    }
    //eslint-disable-next-line
  }, [tailNumber, i18n]);

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
                  <Typography variant="h5">{totalDeviceFlight}</Typography>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => {
                      navigate(`/aircraft/installed-device/${aircraftInfo?.tail_number}`);
                    }}
                  >
                    <Typography color="secondary" textAlign={'center'}>
                      <FormattedMessage id="device" />
                    </Typography>
                  </Link>
                </Stack>
                <Divider orientation="vertical" flexItem sx={{ marginLeft: 2, marginRight: 2 }} />
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5">{totalHistoryFlight}</Typography>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => {
                      navigate(`/aircraft/history-flight/${aircraftInfo?.tail_number}`);
                    }}
                  >
                    <Typography color="secondary" textAlign={'center'}>
                      <FormattedMessage id="flights-completed" />
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
                    <IconTailNumber className="h-5 w-5" fill="#707E8A" />
                  </ListItemIcon>
                  <ListItemSecondaryAction>
                    <Typography align="right">{aircraftInfo?.tail_number}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Airplane size={20} />
                  </ListItemIcon>
                  <ListItemSecondaryAction>
                    <Typography align="right">{aircraftInfo?.model}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Building size={20} />
                  </ListItemIcon>
                  <ListItemSecondaryAction>{aircraftInfo?.manufacturer}</ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={9}>
        <MainCard title={false} content={false} sx={{ padding: '0 20px' }}>
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
                    <Typography>{aircraftInfo?.flight_number}</Typography>
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
                    <Typography>{aircraftInfo?.tail_number}</Typography>
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
                    <Typography>{aircraftInfo?.model}</Typography>
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
                    <Typography>{aircraftInfo?.model_type}</Typography>
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
                    <Typography>{aircraftInfo?.manufacturer}</Typography>
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
                    <Typography>{formatYear((aircraftInfo?.year_manufactured as string) || null)}</Typography>
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
                    <Typography>{aircraftInfo?.maintenance_schedule as string}</Typography>
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
                    <Typography>{aircraftInfo?.last_maintenance_date as string}</Typography>
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
                      {aircraftInfo?.status_id &&
                        getChipStatus(aircraftInfo?.status_id, 'operational', 'out-of-operation', 'maintenance')}
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
                    <Typography>{aircraftInfo?.ownership}</Typography>
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
