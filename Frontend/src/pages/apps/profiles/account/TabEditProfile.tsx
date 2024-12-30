import { useEffect, useState, ChangeEvent } from 'react';
import { useParams } from 'react-router';
import { FormattedMessage, useIntl } from 'react-intl';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormLabel, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';

// project-imports
// import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import { facebookColor, linkedInColor } from 'config';

//model
import { getUser } from './model';

// assets
import { Apple, Camera, Facebook, Google } from 'iconsax-react';

// types
import { ThemeMode } from 'types/config';
import { EndUserData } from 'types/end-user';
// const avatarImage = require.context('assets/images/users', true);
// ==============================|| ACCOUNT PROFILE - PERSONAL ||============================== //

const TabPersonal = () => {
  const theme = useTheme();
  const { id } = useParams();
  const intl = useIntl();
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const [userInfo, setUserInfo] = useState<EndUserData>();
  // const [firstName, setFirstName] = useState<'>('');
  // const [lastName, setLastName] = useState<string>('');
  const { firstName, lastName } = splitName(userInfo?.fullname);
  // const [avatar, setAvatar] = useState<string | undefined>(avatarImage(`./default.png`));

  async function getUserInfo(userId: string) {
    try {
      const res = await getUser(userId);
      setUserInfo(res.data[0]);
    } catch (err) {}
  }

  function splitName(fullname: string | undefined) {
    if (fullname) {
      const parts = fullname.trim().split(' ');
      if (parts.length === 1) {
        return { firstName: parts[0], lastName: '' };
      } else {
        const lastName = parts.pop();
        const firstName = parts.join(' ');
        return { firstName, lastName };
      }
    } else {
      return { firstName: ' ', lastName: ' ' };
    }
  }

  useEffect(() => {
    if (id) {
      getUserInfo(id);
      splitName(userInfo?.fullname);
    }

    if (selectedImage) {
      // setAvatar(URL.createObjectURL(selectedImage));
    }
    //eslint-disable-next-line
  }, [selectedImage, id]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <MainCard title={intl.formatMessage({ id: 'account-details' })}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={2.5} alignItems="center" sx={{ m: 3 }}>
                <FormLabel
                  htmlFor="change-avtar"
                  sx={{
                    position: 'relative',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    '&:hover .MuiBox-root': { opacity: 1 },
                    cursor: 'pointer'
                  }}
                >
                  {/* <Avatar alt="Avatar 1" src={avatar} sx={{ width: 76, height: 76 }} /> */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Stack spacing={0.5} alignItems="center">
                      <Camera style={{ color: theme.palette.secondary.lighter, fontSize: '1.5rem' }} />
                      <Typography sx={{ color: 'secondary.lighter' }} variant="caption">
                        <FormattedMessage id="upload" />
                      </Typography>
                    </Stack>
                  </Box>
                </FormLabel>
                <TextField
                  type="file"
                  id="change-avtar"
                  placeholder="Outlined"
                  variant="outlined"
                  sx={{ display: 'none' }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedImage(e.target.files?.[0])}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="personal-first-name">
                  <FormattedMessage id="first-name" />
                </InputLabel>
                <TextField fullWidth value={firstName} id="personal-first-name" placeholder="First Name" autoFocus />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="personal-last-name">
                  <FormattedMessage id="last-name" />
                </InputLabel>
                <TextField fullWidth value={lastName} id="personal-last-name" placeholder="Last Name" />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="personal-gender">
                  <FormattedMessage id="gender" />
                </InputLabel>
                <TextField fullWidth value={userInfo?.gender} id="personal-gender" placeholder="Gender" autoFocus />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="personal-citizen-id">
                  <FormattedMessage id="citizen-id" />
                </InputLabel>
                <TextField fullWidth value={userInfo?.citizen_id} id="personal-citizen-id" placeholder="Citizen ID" />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="personal-location">
                  <FormattedMessage id="country" />
                </InputLabel>
                <TextField fullWidth value={userInfo?.country} id="personal-location" placeholder="Location" />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="postcode">
                  <FormattedMessage id="postcode" />
                </InputLabel>
                <TextField fullWidth value={userInfo?.postcode} id="postcode" placeholder="Postcode" />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="personal-location">Bio</InputLabel>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  // defaultValue="Hello, I’m Anshan Handgun Creative Graphic Designer & User Experience Designer based in Website, I create digital Products a more Beautiful and usable place. Morbid accusant ipsum. Nam nec tellus at."
                  id="personal-location"
                  placeholder="Location"
                />
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard title={intl.formatMessage({ id: 'social-network' })}>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Button
                    size="small"
                    startIcon={<Google variant="Bold" style={{ color: theme.palette.error.main }} />}
                    sx={{ color: theme.palette.error.main, '&:hover': { bgcolor: 'transparent' } }}
                  >
                    Google
                  </Button>
                  <Button color="error">
                    <FormattedMessage id="connect" />
                  </Button>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Button
                    size="small"
                    startIcon={<Facebook variant="Bold" style={{ color: facebookColor }} />}
                    sx={{ color: facebookColor, '&:hover': { bgcolor: 'transparent' } }}
                  >
                    Facebook
                  </Button>
                  <Button color="error">
                    <FormattedMessage id="connect" />
                  </Button>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Button
                    size="small"
                    startIcon={<Apple variant="Bold" style={{ color: linkedInColor }} />}
                    sx={{ color: linkedInColor, '&:hover': { bgcolor: 'transparent' } }}
                  >
                    Apple
                  </Button>
                  <Button color="error">
                    <FormattedMessage id="connect" />
                  </Button>
                </Stack>
              </Stack>
            </MainCard>
          </Grid>
          <Grid item xs={12}>
            <MainCard title={intl.formatMessage({ id: 'contact' })}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-phone">
                      <FormattedMessage id="phone-number" />
                    </InputLabel>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <Select defaultValue="84">
                        <MenuItem value="61">+61</MenuItem>
                        <MenuItem value="84">+84</MenuItem>
                        <MenuItem value="1-671">1-671</MenuItem>
                        <MenuItem value="36">+36</MenuItem>
                      </Select>
                      <PatternFormat
                        format="+84 ###-###-####"
                        mask="_"
                        fullWidth
                        customInput={TextField}
                        placeholder="Phone Number"
                        onBlur={() => {}}
                        value={userInfo?.phone_number}
                      />
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-email">
                      <FormattedMessage id="email-address" />
                    </InputLabel>
                    <TextField type="email" fullWidth value={userInfo?.email} id="personal-email" placeholder="Email Address" />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-address">
                      <FormattedMessage id="address" />
                    </InputLabel>
                    <TextField fullWidth value={userInfo?.address} id="personal-address" placeholder="Address" />
                  </Stack>
                </Grid>
                <Grid item xs={3}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-ward">
                      <FormattedMessage id="ward" />
                    </InputLabel>
                    <TextField fullWidth value={userInfo?.ward} id="personal-ward" placeholder="ward" />
                  </Stack>
                </Grid>
                <Grid item xs={3}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-district">
                      <FormattedMessage id="district" />
                    </InputLabel>
                    <TextField fullWidth value={userInfo?.district} id="personal-district" placeholder="district" />
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-province">
                      <FormattedMessage id="province" />
                    </InputLabel>
                    <TextField fullWidth value={userInfo?.province} id="personal-province" placeholder="Province" />
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
          <Button variant="outlined" color="secondary">
            <FormattedMessage id="cancel" />
          </Button>
          <Button variant="contained">
            <FormattedMessage id="update-profile" />
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default TabPersonal;
