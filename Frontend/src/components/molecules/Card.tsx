import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import useFlightPhaseTooltip from 'hooks/useFlightPhase';

//project-import
import { Grid, List, ListItem, ListItemIcon, ListItemText, Typography, Tooltip, IconButton, Stack, Chip } from '@mui/material';
import MainCard from 'components/MainCard';

//types
import { FlightData } from 'types/aviation';

//utils
import { formatDataUsage } from 'utils/handleData';

//assets
import { CloudConnection, Wifi, Data } from 'iconsax-react';
import { IconAirplaneArrival, IconAirplaneTakeOff, IconBroadCast, IconPlane, IconAirplaneRunway } from 'components/atoms/icons';
import ChipStatus from 'components/atoms/ChipStatus';

const AirplaneCard: React.FC<{ flight: FlightData }> = ({ flight }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const flightPhaseStatus = useFlightPhaseTooltip(flight.flight_phase);

  const statusColor = useMemo(
    () => (flight.status_id !== 14 ? 'rgb(220 38 38)' : 'rgb(21 128 61)'),
    //eslint-disable-next-line
    []
  );

  const flightPhaseIcon = useMemo(() => {
    switch (flight.flight_phase) {
      case 1:
        return <IconAirplaneRunway className="w-[26px] h-[26px]" fill="#fff" />;
      case 2:
        return <IconAirplaneRunway className="w-[24px] h-[24px]" fill="#fff" />;
      case 3:
        return <IconAirplaneTakeOff className="w-[24px] h-[24px]" fill="#fff" />;
      case 4:
        return <IconAirplaneTakeOff className="w-[24px] h-[24px]" fill="#fff" />;
      case 5:
        return <IconAirplaneTakeOff className="w-[24px] h-[24px]" fill="#fff" />;
      case 6:
        return <IconPlane className="w-[24px] h-[24px]" fill="#fff" />;
      case 7:
        return <IconPlane className="w-[24px] h-[24px]" fill="#fff" />;
      case 8:
        return <IconAirplaneArrival className="w-[24px] h-[24px]" fill="#fff" />;
      case 9:
        return <IconAirplaneArrival className="w-[24px] h-[24px]" fill="#fff" />;
      case 10:
        return <IconAirplaneRunway className="w-[24px] h-[24px]" fill="#fff" />;
      case 11:
        return <IconAirplaneRunway className="w-[24px] h-[24px]" fill="#fff" />;
      default:
        return null;
    }
    //eslint-disable-next-line
  }, []);

  return (
    <MainCard
      sx={{
        height: 1,
        '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column', padding: '0' }
      }}
    >
      <Grid container spacing={2.25} padding="16px 0 16px 16px">
        <Grid
          item
          xs={12}
          className={`bg-opacity-70 text-white text-opacity-90 ${
            flight.status_id !== 14 || flight.flight_phase === 11 ? 'bg-red-600' : 'bg-green-600'
          }`}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}
          height={50}
        >
          <Grid item xs={12} className="!pl-0">
            <List sx={{ width: 1, p: 0 }} className="flex justify-between items-center">
              <ListItem className="min-w-[100px]" disablePadding>
                <Typography variant="subtitle1">{flight.aircraft.flight_number}</Typography>
              </ListItem>
              <ListItemIcon className="flex gap-3">
                {flightPhaseIcon && (
                  <Tooltip title={flightPhaseStatus} arrow>
                    <IconButton>{flightPhaseIcon}</IconButton>
                  </Tooltip>
                )}
                {flight.status_id !== 14 && (
                  <Tooltip title={intl.formatMessage({ id: 'offline' })}>
                    <IconButton>
                      <IconBroadCast className="w-[24px] h-[24px]" />
                    </IconButton>
                  </Tooltip>
                )}
              </ListItemIcon>
            </List>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} direction={{ xs: 'column', md: 'row' }}>
            <Grid item xs={11}>
              <List
                sx={{
                  p: 0,
                  overflow: 'hidden',
                  '& .MuiListItem-root': { px: 0, py: 0.5 },
                  '& .MuiListItemIcon-root': { minWidth: 28 }
                }}
                // className=""
              >
                {/* <ListItem className="h-32 mb-2 flex flex-col justify-start">
                  <ListItemText
                    primary={
                      <Typography paragraph className="text-[14px] truncate text-wrap text-left" variant="subtitle2">
                        <FormattedMessage id="aircraft" /> <strong className="text-blue-600">{flight.aircraft.tail_number}</strong>
                        {'. '}
                        <FormattedMessage id="route" /> {flight.route}
                        {'. '}
                        {flightPhaseStatus},<FormattedMessage id="estimated-take-off-time" /> {flight.departure_time}{' '}
                        <FormattedMessage id="estimated-arrival-time" /> {flight.arrival_time}
                      </Typography>
                    }
                  />
                </ListItem> */}

                <ListItem>
                  <ListItemText
                    primary={
                      <Stack>
                        <Typography className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
                          <span className="inline-block min-w-[58px]">
                            <FormattedMessage id="aircraft" />:
                          </span>
                          <strong
                            className="text-blue-600"
                            style={{
                              maxWidth: '140px',
                              display: 'inline-block',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {flight.tail_model}
                          </strong>
                        </Typography>
                        <Typography style={{ display: 'flex', alignItems: 'center' }}>
                          <FormattedMessage id="route" />:
                          <Tooltip title={flight.route} placement="bottom" arrow>
                            <span
                              style={{
                                maxWidth: '200px',
                                marginLeft: '4px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: 'inline-block',
                                verticalAlign: 'middle'
                              }}
                            >
                              {flight.route}
                            </span>
                          </Tooltip>
                        </Typography>
                        <Typography>
                          <FormattedMessage id="estimated-take-off-time" />: {flight.departure_time}
                        </Typography>
                        <Typography>
                          <FormattedMessage id="estimated-arrival-time" />: {flight.arrival_time}
                        </Typography>
                        <Typography>
                          <FormattedMessage id="altitude" />: {`${flight.altitude || 0} m`}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
                {/* {flightPhaseStatus}, */}
                <ListItem>
                  <List>
                    <Tooltip
                      title={intl.formatMessage({ id: 'ifc-status' })}
                      placement="left"
                      onClick={() => navigate(`/flight/history-activities-ifc/${flight.aircraft.flight_number}`)}
                    >
                      <ListItem>
                        <ListItemIcon>
                          <Wifi size={24} color={statusColor} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <div className={flight.status_id !== 14 ? 'text-red-600 min-w-10' : 'text-green-700 min-w-10'}>
                              <ChipStatus id={flight.status_id} successLabel="online" errorLabel="offline" />
                            </div>
                          }
                        />
                      </ListItem>
                    </Tooltip>

                    <Tooltip
                      title={intl.formatMessage({ id: 'session' })}
                      placement="left"
                      onClick={() => navigate(`/flight/session-list/${flight.aircraft.flight_number}`)}
                    >
                      <ListItem>
                        <ListItemIcon>
                          <CloudConnection size={24} color="rgb(21 128 61)" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <div className="min-w-10">
                              <Chip className="w-full" color="success" label={flight.sessions_count || 0} size="small" variant="light" />
                            </div>
                          }
                        />
                      </ListItem>
                    </Tooltip>

                    <Tooltip
                      title={intl.formatMessage({ id: 'data-usage' })}
                      placement="left"
                      onClick={() => navigate(`/flight/report/${flight.aircraft.flight_number}`)}
                    >
                      <ListItem>
                        <ListItemIcon>
                          <Data size={24} color="rgb(21 128 61)" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <div className="min-w-10">
                              <Chip
                                className="w-full"
                                color="success"
                                label={formatDataUsage(flight.total_data_usage)}
                                size="small"
                                variant="light"
                              />
                            </div>
                          }
                        />
                      </ListItem>
                    </Tooltip>
                  </List>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default AirplaneCard;
