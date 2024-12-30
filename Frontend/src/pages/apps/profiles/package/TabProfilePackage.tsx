import { useEffect, useMemo, useState } from 'react';
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
import { Calendar, Box1, Verify, Warning2 } from 'iconsax-react';
import NoImageIcon from 'components/atoms/icons/image-slash';

//types
import { ProductData } from 'types/product';

//model & utils
import { getPackage } from './model';
import { formatDate, useLangUpdate } from 'utils/handleData';
import getChipStatus from 'pages/apps/common-components/form/field/renderChip';
import { getTypePackages } from 'utils/getData';

const TabProfile = () => {
  const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  // const intl = useIntl();
  const [packageInfo, setPackageInfo] = useState<ProductData>();
  const { params } = useParams();

  const { i18n } = useConfig();
  const intl = useIntl();
  useLangUpdate(i18n);

  async function getPackageInfo(id: string, type: string) {
    try {
      const res = await getPackage(id, type);
      const formattedDate = formatDate(res.data, ['created_date']);
      setPackageInfo(formattedDate[0]);
    } catch (err: any) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  }

  useEffect(() => {
    if (params) {
      const [id, type] = params!.split('-');
      getPackageInfo(id, type);
    }
    //eslint-disable-next-line
  }, [params, i18n]);

  const typePackage = useMemo(() => getTypePackages(packageInfo?.type), [packageInfo?.type]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <MainCard>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {/* {packageInfo?.imageUrl ? (
                <img
                  src={packageInfo.imageUrl}
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
            {/* <Avatar alt="Avatar 1" size="xl" src={avatarImage(`./default.png`)} /> */}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-around" alignItems="center">
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5">{packageInfo?.product_sold}</Typography>
                  <Typography color="secondary" textAlign={'center'}>
                    <FormattedMessage id="units-sold" />
                  </Typography>
                </Stack>
                <Divider orientation="vertical" flexItem sx={{ marginLeft: 2, marginRight: 2 }} />

                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5">{packageInfo?.total_revenue.toLocaleString('vi-VN')} VND</Typography>
                  <Typography color="secondary" textAlign={'center'}>
                    <FormattedMessage id="income" />
                  </Typography>
                </Stack>
                <Divider orientation="vertical" flexItem sx={{ marginLeft: 2, marginRight: 2 }} />
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5">{typePackage}</Typography>
                  <Typography color="secondary" textAlign={'center'}>
                    <FormattedMessage id="type-product" />
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
                    <Box1 size={20} />
                  </ListItemIcon>
                  <ListItemSecondaryAction>
                    <Typography align="right">{typePackage}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Calendar size={20} />
                  </ListItemIcon>
                  <ListItemSecondaryAction>
                    <Typography align="right">{packageInfo?.created_date as string}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>{packageInfo?.status_id === 14 ? <Verify size={20} /> : <Warning2 size={20} />}</ListItemIcon>
                  <ListItemSecondaryAction>{getChipStatus(packageInfo?.status_id || 11, 'active', 'inactive')}</ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={8}>
        <MainCard title={false} content={false} sx={{ padding: '0 20px' }}>
          <Typography variant="h5" className="my-4">
            <FormattedMessage id="plan-detail" />
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
                      <FormattedMessage id="plan-name" />
                    </Typography>
                    <Typography>{packageInfo?.title}</Typography>
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
                      <FormattedMessage id="plan-type" />
                    </Typography>
                    <Typography>{typePackage}</Typography>
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
                      <FormattedMessage id="total-data-usage" />
                    </Typography>
                    <Typography>{packageInfo?.data_total} MB</Typography>
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
                      <FormattedMessage id="total-time" />
                    </Typography>
                    <Typography>
                      {packageInfo?.total_time} <FormattedMessage id="minutes" />
                    </Typography>
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
                      <FormattedMessage id="bandwidth-upload" />
                    </Typography>
                    <Typography>{packageInfo?.bandwidth_upload} Mbps</Typography>
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
                      <FormattedMessage id="bandwidth-download" />
                    </Typography>
                    <Typography>{packageInfo?.bandwidth_download} Mbps</Typography>
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
                      <FormattedMessage id="data-upload" />
                    </Typography>
                    <Typography>{packageInfo?.data_upload} MB</Typography>
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
                      <FormattedMessage id="data-download" />
                    </Typography>
                    <Typography>{packageInfo?.data_download} MB</Typography>
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
                    <Typography>{packageInfo?.description}</Typography>
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
