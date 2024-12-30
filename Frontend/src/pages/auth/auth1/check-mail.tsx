import { Link, useParams } from 'react-router-dom';

// material-ui
import { Box, Button, Grid, Typography } from '@mui/material';

// project-imports
import useAuth from 'hooks/useAuth';
import AnimateButton from 'components/@extended/AnimateButton';
import AuthWrapper from 'sections/auth/AuthWrapper';
import { FormattedMessage } from 'react-intl';

// ================================|| CHECK MAIL ||================================ //

const CheckMail = () => {
  const { isLoggedIn } = useAuth();
  const { email } = useParams();

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">
              <FormattedMessage id="check-mail" />
            </Typography>
            <Typography color="secondary" sx={{ mb: 0.5, mt: 1.25 }}>
              <FormattedMessage id="we-have-sent-a-password-recover-instructions-to-your-mail" />
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              component={Link}
              to={isLoggedIn ? `/auth/forgot-password/${email}` : `/forgot-password/${email}`}
              disableElevation
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
            >
              <FormattedMessage id="reset-password" />
            </Button>
          </AnimateButton>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default CheckMail;
