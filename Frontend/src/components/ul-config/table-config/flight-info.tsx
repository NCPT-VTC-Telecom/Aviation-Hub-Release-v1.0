//project component
import useFlightPhaseTooltip from 'hooks/useFlightPhase';
import ColumnActions from './column-action-status/column-action';
import { FormattedMessage } from 'react-intl';
import { Row } from 'react-table';
import { FlightData } from 'types/aviation';
import { getLeasedAircraft } from 'utils/getData';
import ChipStatus from 'components/atoms/ChipStatus';

export const ColumnsHistoryFlight = (
  currentPage: number,
  pageSize: number,
  handleAdd: () => void,
  handleClose: () => void,
  onViewClick?: (value: FlightData) => void,
  hiddenView?: boolean
) => {
  return [
    {
      Header: '#',
      accessor: 'id',
      disableSortBy: true,
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="no." />,
      disableSortBy: true,
      accessor: 'index',
      className: 'cell-center',
      Cell: ({ row }: { row: Row }) => {
        const rowNumber = (currentPage - 1) * pageSize + row.index + 1;
        return <div>{rowNumber}</div>;
      }
    },
    {
      Header: <FormattedMessage id="airline" />,
      accessor: 'airline',
      disableSortBy: true
    },
    {
      Header: <FormattedMessage id="flight-number" />,
      accessor: 'aircraft.flight_number',
      disableSortBy: true,
      className: 'min-w-28'
    },
    {
      Header: <FormattedMessage id="tail-number" />,
      accessor: 'aircraft.tail_number',
      disableSortBy: true
    },
    {
      Header: <FormattedMessage id="model" />,
      accessor: 'aircraft.model',
      disableSortBy: true,
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="route" />,
      accessor: 'route',
      disableSortBy: true,
      className: 'min-w-28'
    },
    {
      Header: <FormattedMessage id="flight-times" />,
      accessor: 'flight_times',
      disableSortBy: true,
      className: 'min-w-28'
    },
    {
      Header: <FormattedMessage id="departure-time" />,
      accessor: 'departure_time',
      disableSortBy: true,
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="arrival-time" />,
      accessor: 'arrival_time',
      disableSortBy: true,
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="manufacturer" />,
      accessor: 'manufacturer',
      disableSortBy: true,
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="mode-type" />,
      accessor: 'model_type',
      disableSortBy: true,
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="maintenance-schedule" />,
      accessor: 'maintenance_schedule',
      disableSortBy: true,
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="last-maintenance-date" />,
      accessor: 'last_maintenance_date',
      disableSortBy: true,
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="leased-aircraft-status" />,
      accessor: 'leased_aircraft_status',
      disableSortBy: true,
      className: 'hidden',
      Cell: ({ value }: { value: string }) => {
        return <span>{getLeasedAircraft(value)}</span>;
      }
    },
    {
      Header: <FormattedMessage id="flight-phase" />,
      accessor: 'flight_phase',
      disableSortBy: true,
      Cell: ({ value }: { value: number }) => {
        const flightPhaseStatus = useFlightPhaseTooltip(value);
        return <span>{flightPhaseStatus}</span>;
      }
    },
    {
      Header: <FormattedMessage id="ifc-status" />,
      accessor: 'status_id',
      disableSortBy: true,
      className: 'cell-center',
      Cell: ({ value }: { value: number }) => {
        return <ChipStatus id={value} successLabel="online" errorLabel="offline" />;
      }
    },
    {
      Header: <FormattedMessage id="session" />,
      accessor: 'sessions_count',
      disableSortBy: true,
      className: 'cell-right'
    },
    {
      Header: ' ',
      className: 'cell-center',
      disableSortBy: true,
      Cell: ({ row }: { row: Row<{}> }) => (
        <ColumnActions isHiddenView={hiddenView} setViewRecord={onViewClick} row={row} handleAdd={handleAdd} handleClose={handleClose} />
      )
    }
  ];
};
