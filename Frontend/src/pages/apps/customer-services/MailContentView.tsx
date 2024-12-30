import { useTheme } from '@mui/material/styles';
import { FormattedMessage } from 'react-intl';

// material-ui
import { useMediaQuery, Grid, List, ListItem, Stack, TableCell, TableRow, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

//types
import { DataMail } from 'types/customer-services';
import { limitTextToWords } from 'utils/handleData';

const MailContentView = ({ data }: { data: DataMail }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <TableRow sx={{ '&:hover': { bgcolor: `transparent !important` }, overflow: 'hidden' }}>
      <TableCell colSpan={8} sx={{ p: 2.5, overflow: 'hidden' }}>
        <Transitions type="slide" direction="down" in={true}>
          <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
            <Grid item xs={12}>
              <Stack spacing={2.5}>
                <MainCard content={false}>
                  <List sx={{ py: 0 }}>
                    <ListItem divider={!matchDownMD}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary" variant="h5">
                              <FormattedMessage id="mail-content" />
                            </Typography>
                            <Typography variant="h5">
                              {data.request_number} - {data.title_sender}
                            </Typography>
                          </Stack>
                        </Grid>

                        <Grid item xs={6}>
                          <Stack spacing={0.5}>
                            <Typography>
                              <FormattedMessage id="from" />
                            </Typography>
                            <Typography>{data.user_sender.fullname}</Typography>
                            <Typography>{data.user_sender.email}</Typography>
                            <Typography>{data.user_sender.phone_number}</Typography>
                          </Stack>
                        </Grid>

                        <Grid item xs={6}>
                          <Stack spacing={0.5}>
                            <Typography className="text-right">{data.body_sender}</Typography>
                          </Stack>
                        </Grid>

                        <Grid item xs={12}>
                          <Stack spacing={0.5}>
                            <Typography>{limitTextToWords(data.body_sender, 200)}</Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </ListItem>
                  </List>
                </MainCard>
              </Stack>
            </Grid>
          </Grid>
        </Transitions>
      </TableCell>
    </TableRow>
  );
};

export default MailContentView;
