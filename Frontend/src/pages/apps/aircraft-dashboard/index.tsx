import { useState, useEffect } from 'react';
import useConfig from 'hooks/useConfig';
import { useIntl } from 'react-intl';

//project-import
import Map from 'components/organisms/Map';
import FilterCollapse from 'pages/apps/common-components/Filter/FilterCollapse';
import MainCard from 'components/MainCard';
import ListInfoAirCraft from './TableAircraft';
import { filterAircraft } from 'pages/apps/common-components/Filter/filter-item';

//model
import { getFlight } from './model';

//utils & third-party
import { formatDateTime, getRouteHistory, useLangUpdate } from 'utils/handleData';
import { enqueueSnackbar } from 'notistack';

//mui
import { Grid } from '@mui/material';

//types
import { FlightData } from 'types/aviation';

type FilterValueType = {
  start_date?: string;
  end_date?: string;
};

function AircraftDashboardPage() {
  const [selectedAirplane, setSelectedAirplane] = useState<FlightData | null>(null);
  const [filterValue, setFilterValue] = useState<FilterValueType | undefined>();
  const [dataFlight, setDataFlight] = useState<FlightData[]>([]);
  const [popupVisibility, setPopupVisibility] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex + 1);
    setPageSize(newPageSize);
  };
  const intl = useIntl();

  const { i18n } = useConfig();
  useLangUpdate(i18n);

  useEffect(() => {
    getData(pageIndex, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValue, i18n]);

  const getData = async (pageIndex: number, pageSize: number) => {
    try {
      const res = await getFlight(filterValue?.start_date, filterValue?.end_date);
      if (res.code === 0) {
        setTotalPages(res.totalPages);
        const formattedData = formatDateTime(res.data, ['departure_time', 'arrival_time']);
        const mapRoute = getRouteHistory(formattedData);
        setDataFlight(mapRoute);
      } else {
        setTotalPages(0);
        setDataFlight([]);
      }
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAirplane = (airplane: FlightData) => {
    setSelectedAirplane(airplane);
    const currentVisibility = !!popupVisibility[airplane.id];
    setPopupVisibility({
      ...popupVisibility,
      [airplane.id]: !currentVisibility
    });
  };

  return (
    <Grid container rowSpacing={2} columnSpacing={2}>
      <Grid item xs={12}>
        <MainCard>
          <FilterCollapse filtersConfig={filterAircraft} getFilterValue={setFilterValue} />
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        {/* <MainCard content={false} sx={{ padding: '0 24px 24px 24px' }}> */}
        <MainCard>
          <Map airCraftInfo={dataFlight} selectedAirplane={selectedAirplane} popupVisibility={popupVisibility} isShowTime={false} />
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <MainCard content={false}>
          <ListInfoAirCraft
            airCraftInfo={dataFlight}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            onSelectedAirplane={handleSelectAirplane}
            isLoading={isLoading}
            pageSize={pageSize}
          />
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default AircraftDashboardPage;
