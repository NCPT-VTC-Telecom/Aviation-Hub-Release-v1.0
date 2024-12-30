import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
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
  Box,
  Skeleton
} from '@mui/material';

//third-party
import { enqueueSnackbar } from 'notistack';

// project-imports
import MainCard from 'components/MainCard';

// assets
import {
  Calendar,
  Building

  // Verify, Warning2
} from 'iconsax-react';
import NoImageIcon from 'components/atoms/icons/image-slash';

//types
import { ProviderData } from 'types/provider';

//model & utils
import { getDevice, getProvider } from './model';
import { formatDate, useLangUpdate } from 'utils/handleData';
// import getChipStatus from 'pages/apps/common-components/form/field/renderChip';

//redux
import getChipStatus from 'pages/apps/common-components/form/field/renderChip';

const TabProfileProvider = () => {
  const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  // const intl = useIntl();
  const [providerInfo, setProviderInfo] = useState<ProviderData>();
  const [productProvider, setProductProvider] = useState<number>(0);

  const intl = useIntl();
  const { i18n } = useConfig();
  const { providerID } = useParams();
  useLangUpdate(i18n);

  async function getProviderInfo(providerID: string) {
    try {
      const res = await getProvider(providerID);
      const getTotalDevice = await getDevice(providerID);
      const formattedDate = formatDate(res.data, ['created_date']);
      setProductProvider(getTotalDevice.total || 0);
      setProviderInfo(formattedDate[0]);
    } catch (err: any) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  }

  useEffect(() => {
    if (providerID) {
      getProviderInfo(providerID);
    }
    //eslint-disable-next-line
  }, [providerID, i18n]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <MainCard>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {/* {providerInfo?.contact ? (
                <img
                  src={providerInfo.imageUrl}
                  alt="Aircraft"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'path/to/placeholder-image.jpg';
                  }}
                  style={{
                    borderRadius: '8px',
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />
              ) : ( */}
              <Box
                sx={{
                  borderRadius: '8px',
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  animation="wave"
                  sx={{ borderRadius: '8px', position: 'absolute', top: 0, left: 0 }}
                />
                <NoImageIcon className="size-10" fill="#c0c0c0" />
                <Typography variant="body2" color="textSecondary" sx={{ zIndex: 1 }}>
                  <FormattedMessage id="no-img-available" />
                </Typography>
              </Box>
              {/* )} */}
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-around" alignItems="center">
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5">{productProvider}</Typography>
                  <Typography color="secondary">
                    <FormattedMessage id="product" />
                  </Typography>
                </Stack>
                <Divider orientation="vertical" flexItem />
                <Stack spacing={0.5} alignItems="center">
                  <div>{getChipStatus(providerInfo?.status_id as number, 'active', 'inactive')}</div>
                  <Typography color="secondary">
                    <FormattedMessage id="status" />
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
                    <Building />
                  </ListItemIcon>
                  <ListItemSecondaryAction>
                    <Typography align="right">
                      {providerInfo?.type === 'device' ? <FormattedMessage id="device" /> : <FormattedMessage id="plan" />}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Calendar size={20} />
                  </ListItemIcon>
                  <ListItemSecondaryAction>
                    <Typography align="right">{providerInfo?.created_date as string}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                {/* <ListItem>
                  <ListItemIcon>{providerInfo?.contact === 14 ? <Verify size={20} /> : <Warning2 size={20} />}</ListItemIcon>
                  <ListItemSecondaryAction>{getChipStatus(providerInfo?.contact || 11, 'active', 'inactive')}</ListItemSecondaryAction>
                </ListItem> */}
              </List>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={8}>
        <MainCard title={false} content={false} sx={{ padding: '0 20px' }}>
          <Typography variant="h5" className="my-4">
            <FormattedMessage id="supplier-detail" />
          </Typography>
          <List sx={{ py: 0 }}>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="name-supplier" />
                    </Typography>
                    <Typography>{providerInfo?.name}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="product-provided-type" />
                    </Typography>
                    <Typography>{providerInfo?.type ? <FormattedMessage id="device" /> : <FormattedMessage id="plan" />}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="contact" />
                    </Typography>
                    <Typography>{providerInfo?.contact}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="status" />
                    </Typography>
                    <div>{getChipStatus(providerInfo?.status_id as number, 'active', 'inactive')}</div>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>

            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="address" />
                    </Typography>
                    <Typography>{providerInfo?.address}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </ListItem>

            <ListItem divider={!matchDownMD}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack
                    spacing={0.5}
                    sx={{
                      flexDirection: { xs: 'row', sm: 'column' },
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      alignItems: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    <Typography color="secondary">
                      <FormattedMessage id="desc" />
                    </Typography>
                    <Typography>{providerInfo?.description}</Typography>
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

export default TabProfileProvider;
