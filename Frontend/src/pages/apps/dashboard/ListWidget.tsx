// material-ui
import { useTheme } from '@mui/material/styles';
import { useIntl } from 'react-intl';

// project-imports
import { EcommerceMetrix } from 'components/organisms/statistics';

//assets
import { CalendarAdd, DollarCircle, CloudConnection, BoxTick, Data } from 'iconsax-react';

//utils
import { formatDataUsage } from 'utils/handleData';

function ListWidgets({
  revenue,
  revenueDay,
  dataUsage,
  flightActive,
  totalSession
}: {
  revenue: number;
  revenueDay: number;
  dataUsage: number;
  flightActive: number;
  totalSession: number;
}) {
  const theme = useTheme();
  const intl = useIntl();

  return (
    <div className="grid grid-cols-5 gap-4 max-2xl:grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1">
      <EcommerceMetrix
        url="/retail-performance"
        primary={intl.formatMessage({ id: 'monthly-revenue' })}
        secondary={revenue}
        color={theme.palette.primary.main}
        iconPrimary={DollarCircle}
        isShowRevenue
      />

      <EcommerceMetrix
        url="/retail-performance"
        primary={intl.formatMessage({ id: 'monthly-revenue-plan' })}
        secondary={revenueDay}
        isShowRevenue
        color={theme.palette.info.main}
        iconPrimary={BoxTick}
      />

      <EcommerceMetrix
        url="/data-usage"
        primary={intl.formatMessage({ id: 'data-usage-statistics' })}
        secondary={formatDataUsage(dataUsage)}
        color={theme.palette.secondary.main}
        iconPrimary={Data}
      />

      <EcommerceMetrix
        url="/aviation-management/flight-list"
        primary={intl.formatMessage({ id: 'active-flights' })}
        secondary={flightActive}
        color={theme.palette.warning.main}
        iconPrimary={CalendarAdd}
      />

      <EcommerceMetrix
        url="/session-management/session-list"
        primary={intl.formatMessage({ id: 'total-active-session' })}
        secondary={totalSession}
        color={theme.palette.success.main}
        iconPrimary={CloudConnection}
      />
    </div>
  );
}

export default ListWidgets;
