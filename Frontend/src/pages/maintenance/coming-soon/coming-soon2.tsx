// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Container, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// third-party
import { useTimer } from 'react-timer-hook';

// project-imports
import MainCard from 'components/MainCard';

// assets
import coming from 'assets/images/maintenance/img-soon-2.svg';
import { FormattedMessage } from 'react-intl';

// ==============================|| COMING SOON ||============================== //

const TimerBox = ({ count, label }: { count: number; label: string }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <MainCard content={false} sx={{ width: { xs: 60, sm: 80 } }}>
      <Stack justifyContent="center" alignItems="center">
        <Box sx={{ py: 1.75 }}>
          <Typography variant={matchDownSM ? 'h4' : 'h2'}>{count}</Typography>
        </Box>
      </Stack>
    </MainCard>
  );
};

function ComingSoon() {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 3600 * 24 * 2 - 3600 * 15.5);

  const { seconds, minutes, hours, days } = useTimer({ expiryTimestamp: time });

  return (
    <>
      <Container fixed>
        <Grid container spacing={4} alignItems="center" justifyContent="center" sx={{ minHeight: '100vh', py: 2 }}>
          <Grid item md={6}>
            <Box sx={{ height: { xs: 310, sm: 420 }, width: { xs: 360, sm: 'auto' } }}>
              <img src={coming} alt="coming soon 1" style={{ height: '100%', width: '100%' }} />
            </Box>
          </Grid>
          <Grid item md={6}>
            <Grid container spacing={3} direction="column" alignItems="center">
              <Grid item xs={12}>
                <Stack spacing={1} justifyContent="center" alignItems="center">
                  <Typography align="center" variant="h1">
                    <FormattedMessage id="coming-soon" />
                  </Typography>
                  <Typography align="center" color="textSecondary">
                    <FormattedMessage id="coming-soon-message" />
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={{ xs: 1, sm: 2 }}>
                  <TimerBox count={days} label="day" />
                  <TimerBox count={hours} label="hour" />
                  <TimerBox count={minutes} label="min" />
                  <TimerBox count={seconds} label="sec" />
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default ComingSoon;
