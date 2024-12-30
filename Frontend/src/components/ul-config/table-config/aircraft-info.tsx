import { FormattedMessage } from 'react-intl';

//third-party
import moment from 'moment';
import { Row } from 'react-table';
import { getLeasedAircraft } from 'utils/getData';

//project component
import ColumnActions from './column-action-status/column-action';

//types
import { AircraftData } from 'types/aviation';

export const ColumnsAircraft = (
  currentPage: number,
  pageSize: number,
  handleAdd: () => void,
  handleClose: () => void,
  setRecord: (record: AircraftData) => void,
  setRecordDelete: (record: AircraftData) => void,
  onClickView: (record: AircraftData) => void
) => {
  return [
    {
      Header: '#',
      disableSortBy: true,
      accessor: 'id',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="no." />,
      disableSortBy: true,
      className: 'cell-center',
      accessor: 'index',
      Cell: ({ row }: { row: Row }) => {
        const rowNumber = (currentPage - 1) * pageSize + row.index + 1;
        return <div>{rowNumber}</div>;
      }
    },
    {
      Header: <FormattedMessage id="aircraft-owners" />,
      disableSortBy: true,
      accessor: 'ownership'
    },
    {
      Header: <FormattedMessage id="manufacturer" />,
      disableSortBy: true,
      accessor: 'manufacturer'
    },
    {
      Header: <FormattedMessage id="tail-number" />,
      disableSortBy: true,
      accessor: 'tail_number'
    },
    {
      Header: <FormattedMessage id="year-manufactured" />,
      disableSortBy: true,
      accessor: 'year_manufactured',
      className: 'cell-right',
      Cell: ({ value }: { value: string | null | Date }) => {
        return <div>{value ? moment(value, ['DD/MM/YYYY', 'MM/DD/YYYY']).format('YYYY') : 'NaN'}</div>;
      }
    },
    {
      Header: <FormattedMessage id="passengers-capacity" />,
      disableSortBy: true,
      accessor: 'capacity',
      className: 'cell-right',
      Cell: ({ value }: { value: number }) => {
        return value ? (
          <span>
            {value} <FormattedMessage id="passengers" />
          </span>
        ) : null;
      }
    },
    {
      Header: <FormattedMessage id="aircraft-model-type" />,
      disableSortBy: true,
      accessor: 'model_type'
    },
    {
      Header: <FormattedMessage id="maintenance-schedule" />,
      disableSortBy: true,
      accessor: 'maintenance_schedule',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="last-maintenance-date" />,
      disableSortBy: true,
      accessor: 'last_maintenance_date',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="leased-aircraft-status" />,
      disableSortBy: true,
      accessor: 'leased_aircraft_status',
      Cell: ({ value }: { value: string }) => {
        return <span>{getLeasedAircraft(value)}</span>;
      }
    },
    {
      Header: <FormattedMessage id="flights-completed" />,
      disableSortBy: true,
      accessor: 'flight_count',
      className: 'cell-right'
    },
    {
      Header: ' ',
      className: 'cell-center',
      disableSortBy: true,
      Cell: ({ row }: { row: Row<{}> }) => (
        <ColumnActions
          setViewRecord={onClickView}
          row={row}
          handleAdd={handleAdd}
          handleClose={handleClose}
          setRecord={setRecord}
          setRecordDelete={setRecordDelete}
        />
      )
    }
  ];
};
