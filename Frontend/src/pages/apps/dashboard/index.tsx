import { useState, useEffect, useCallback } from 'react';
import useConfig from 'hooks/useConfig';
//component
import MainCard from 'components/MainCard';
import Map from 'components/organisms/Map';
import SlideShow from 'components/organisms/SlideShow';
import ListWidgets from './ListWidget';
//types
import { FlightData } from 'types/aviation';

//model
import { getFlight, getRevenue, getSession, getTotalDataUsage } from './model';
import { formatDateTime, getRouteHistory, getStartOfMonth, getTailModel, getTimeFlight, useLangUpdate, addDays } from 'utils/handleData';

//redux
import { enqueueSnackbar } from 'notistack';
import { useIntl } from 'react-intl';
import { format } from 'date-fns';

function Dashboard() {
  const [dataFlight, setDataFlight] = useState<FlightData[]>([]);
  const [selectedAirplane, setSelectedAirplane] = useState<FlightData | null>(null);
  const [popupVisibility, setPopupVisibility] = useState<Record<number, boolean>>({});
  const { start_of_current_month, current_date } = getStartOfMonth(new Date());
  const [revenue, setRevenue] = useState(0);
  const [revenueDay, setRevenueDay] = useState(0);
  const [totalDataUsage, setTotalDataUsage] = useState(0);
  const [flightActive, setFlightActive] = useState(0);
  const [totalSession, setTotalSession] = useState(0);

  const intl = useIntl();
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  const handleSelectAirplane = useCallback(
    (flight: FlightData) => {
      const currentVisibility = !!popupVisibility[flight.id];
      setPopupVisibility({
        ...popupVisibility,
        [flight.id]: !currentVisibility
      });
      setSelectedAirplane(flight);
    },
    [popupVisibility]
  );

  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.allSettled([
        getFlight(),
        getFlight('Online'),
        getSession('Active'),
        getRevenue(start_of_current_month, current_date),
        getTotalDataUsage(start_of_current_month, current_date)
      ]);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          switch (index) {
            case 0:
              setDataFlight(
                getTimeFlight(getTailModel(getRouteHistory(formatDateTime(result.value.data, ['departure_time', 'arrival_time']))))
              );
              break;
            case 1:
              setFlightActive(result.value.total || 0);
              break;
            case 2:
              setTotalSession(result.value.total || 0);
              break;
            case 3:
              setRevenue(result.value.code === 0 ? result.value.total : 0);
              break;
            case 4:
              setTotalDataUsage(result.value.code === 0 ? result.value.total : 0);
              break;
          }
        } else {
          enqueueSnackbar(`${intl.formatMessage({ id: 'process-error' })}: API #${index + 1}`, { variant: 'error' });
        }
      });

      // Fetch today's revenue separately due to its dependency on today's date
      const getToday = format(new Date(), 'yyyy/MM/dd');
      const nextDate = addDays(getToday, 1);
      const revenueToday = await getRevenue(getToday, nextDate);
      setRevenueDay(revenueToday.code === 0 ? revenueToday.total : 0);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainCard>
      <div className="mb-4">
        <ListWidgets
          revenue={revenue}
          revenueDay={revenueDay}
          dataUsage={totalDataUsage}
          flightActive={flightActive}
          totalSession={totalSession}
        ></ListWidgets>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7 max-xl:col-span-12 max-xl:order-2">
          <SlideShow data={dataFlight} onSelectAirplane={handleSelectAirplane} />
        </div>
        <div className="col-span-5 max-xl:col-span-12 max-xl:order-1">
          <Map
            airCraftInfo={dataFlight}
            selectedAirplane={selectedAirplane}
            popupVisibility={popupVisibility}
            isShowTime={false}
            heightFull
          />
        </div>
      </div>
    </MainCard>
  );
}

export default Dashboard;
