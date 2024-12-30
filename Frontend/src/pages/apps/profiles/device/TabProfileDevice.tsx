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
  Link,
  Chip,
  Tooltip,
  Button
} from '@mui/material';

//third-party
import { enqueueSnackbar } from 'notistack';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { Building, Gps, CloudRemove } from 'iconsax-react';

//types
import { DeviceData } from 'types/device';

//model & utils
import { getDevice, getSession } from './model';
import { formatDate, formatYear, useLangUpdate } from 'utils/handleData';
import IconTailNumber from 'components/atoms/icons/tail-number';

//redux
import { getLeasedAircraft, getPlacementLocation } from 'utils/getData';
import { AircraftData } from 'types/aviation';

// const avatarImage = require.context('assets/images/users', true);

// ==============================|| ACCOUNT PROFILE - BASIC ||============================== //

const TabProfile = () => {
  const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [deviceInfo, setDeviceInfo] = useState<DeviceData>();
  const [aircraftInfo, setAircraftInfo] = useState<AircraftData>();
  const [totalSession, setTotalSession] = useState<number>(0);
  const [hover, setHover] = useState<boolean>(false);
  const { deviceID } = useParams();
  const { i18n } = useConfig();
  const intl = useIntl();
  useLangUpdate(i18n);

  async function getDeviceInfo(deviceID: string) {
    try {
      const res = await getDevice(deviceID);
      const formattedDate = formatDate(res.data, [
        'activation_date',
        'deactivation_date',
        'manufacturer_date',
        'aircraft.maintenance_schedule',
        'aircraft.last_maintenance_date'
      ]);
      setDeviceInfo(formattedDate[0]);
      setAircraftInfo(formattedDate[0].aircraft);
    } catch (err: any) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  }

  async function getTotalSession(deviceID: string) {
    try {
      const res = await getSession(deviceID, 1, 1);
      setTotalSession(res.total);
    } catch {}
  }

  useEffect(() => {
    if (deviceID) {
      getDeviceInfo(deviceID);
      getTotalSession(deviceID);
    }
    //eslint-disable-next-line
  }, [deviceID, i18n]);

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
                  <FormattedMessage id="general-info" />
                </Typography>

                {deviceInfo?.status_description === 'Online' ? (
                  <Chip color="success" label={intl.formatMessage({ id: 'online' })} size="small" variant="light" />
                ) : (
                  <Chip color="error" label={intl.formatMessage({ id: 'offline' })} size="small" variant="light" />
                )}
              </Stack>

              <List sx={{ py: 0 }}>
                <ListItem>
                  <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center" className="w-full">
                    <Typography color="secondary">
                      <FormattedMessage id="device-name" />:
                    </Typography>
                    <Typography>{deviceInfo?.name}</Typography>
                  </Stack>
                </ListItem>

                <ListItem>
                  <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center" className="w-full">
                    <Typography color="secondary">
                      <FormattedMessage id="device-type" />:
                    </Typography>
                    <Typography>{deviceInfo?.type}</Typography>
                  </Stack>
                </ListItem>

                <ListItem>
                  <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center" className="w-full">
                    <Typography color="secondary">
                      <FormattedMessage id="model" />:
                    </Typography>
                    <Typography>{deviceInfo?.model}</Typography>
                  </Stack>
                </ListItem>

                <ListItem>
                  <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center" className="w-full">
                    <Typography color="secondary">
                      <FormattedMessage id="manufacturer" />:
                    </Typography>
                    <Typography>{deviceInfo?.manufacturer}</Typography>
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
                  <Typography variant="h5">{deviceInfo?.firmware}</Typography>
                  <Typography color="secondary" textAlign={'center'}>
                    <FormattedMessage id="firmware" />
                  </Typography>
                </Stack>
                <Divider orientation="vertical" flexItem />
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5">{deviceInfo?.wifi_standard}</Typography>
                  <Typography color="secondary" textAlign={'center'}>
                    <FormattedMessage id="wifi-standard" />
                  </Typography>
                </Stack>
                <Divider orientation="vertical" flexItem />
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5">{totalSession || 0}</Typography>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => {
                      navigate(`/device/session-list/${deviceInfo?.id_device}`);
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
                    <Tooltip title={intl.formatMessage({ id: 'placement-location' })}>
                      <Gps size={20} />
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemSecondaryAction>
                    {getPlacementLocation((deviceInfo?.placement_location as string) || null)}
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Tooltip title={intl.formatMessage({ id: 'tail-number' })}>
                      <span>
                        <IconTailNumber className="size-[20px]" fill="#707E8A" />
                      </span>
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemSecondaryAction>
                    <Link
                      component="button"
                      onClick={() => {
                        navigate(`/aircraft/profile/${aircraftInfo?.tail_number}`);
                      }}
                    >
                      {aircraftInfo?.tail_number}
                    </Link>
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Tooltip title={intl.formatMessage({ id: 'supplier' })}>
                      <Building size={20} />
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemSecondaryAction>
                    <Link
                      component="button"
                      onClick={() => {
                        navigate(`/supplier/profile/${deviceInfo?.supplier}`);
                      }}
                    >
                      {deviceInfo?.supplier}
                    </Link>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </MainCard>
        {deviceInfo?.status_description === 'Online' && (
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
                    <FormattedMessage id="disconnect" />
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
            <FormattedMessage id="specifications" />
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
                      <FormattedMessage id="firmware" />
                    </Typography>
                    <Typography>{deviceInfo?.firmware}</Typography>
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
                      <FormattedMessage id="wifi-standard" />
                    </Typography>
                    <Typography>{deviceInfo?.wifi_standard}</Typography>
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
                      <FormattedMessage id="ip-address" />
                    </Typography>
                    <Typography>{deviceInfo?.ip_address}</Typography>
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
                      <FormattedMessage id="ipv6-address" />
                    </Typography>
                    <Typography>{deviceInfo?.ipv6_address}</Typography>
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
                      <FormattedMessage id="mac-address" />
                    </Typography>
                    <Typography>{deviceInfo?.mac_address}</Typography>
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
                      <FormattedMessage id="cpu-type" />
                    </Typography>
                    <Typography>{deviceInfo?.cpu_type}</Typography>
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
                    <Typography>{deviceInfo?.manufacturer}</Typography>
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
                      <FormattedMessage id="date-of-manufacture" />
                    </Typography>
                    <Typography>{deviceInfo?.manufacturer_date as string}</Typography>
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
                      <FormattedMessage id="activation-date" />
                    </Typography>
                    <Typography>{deviceInfo?.activation_date as string}</Typography>
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
                      <FormattedMessage id="deactivation-date" />
                    </Typography>
                    <Typography>{deviceInfo?.deactivation_date as string}</Typography>
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
                    <Typography>{deviceInfo?.description}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
          </List>
          <Typography variant="h5" className="my-4">
            <FormattedMessage id="placement-location-info" />
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
                      <FormattedMessage id="tail-number" />
                    </Typography>
                    <Typography>{aircraftInfo?.tail_number}</Typography>
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
                      <FormattedMessage id="passengers-capacity" />
                    </Typography>
                    <Typography>
                      {aircraftInfo?.capacity} <FormattedMessage id="passengers" />
                    </Typography>
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
                      <FormattedMessage id="aircraft-model-type" />
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
                      <FormattedMessage id="aircraft-owners" />
                    </Typography>
                    <Typography>{aircraftInfo?.ownership}</Typography>
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
                      <FormattedMessage id="leased-aircraft-status" />
                    </Typography>
                    <Typography>{getLeasedAircraft(aircraftInfo?.leased_aircraft_status)}</Typography>
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
                    <Typography>{formatYear(aircraftInfo?.year_manufactured as string)}</Typography>
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
