import { FormattedMessage } from 'react-intl';

//third-party
import { Row } from 'react-table';

//project component
import ChipStatus from 'components/atoms/ChipStatus';
import ColumnActions from './column-action-status/column-action';

//types
import { AirlineData } from 'types/aviation';

export const columnsAirline = (
  currentPage: number,
  pageSize: number,
  handleAdd: () => void,
  handleClose: () => void,
  setRecord: (record: AirlineData) => void,
  setRecordDelete: (record: AirlineData) => void
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
      Header: <FormattedMessage id="code" />,
      accessor: 'code',
      disableSortBy: true
    },
    {
      Header: <FormattedMessage id="airline" />,
      accessor: 'name',
      disableSortBy: true
    },
    {
      Header: <FormattedMessage id="country" />,
      accessor: 'country',
      disableSortBy: true
    },
    {
      Header: <FormattedMessage id="email" />,
      accessor: 'email',
      disableSortBy: true
    },
    {
      Header: <FormattedMessage id="contact" />,
      accessor: 'phone_number',
      disableSortBy: true
    },
    {
      Header: <FormattedMessage id="desc" />,
      accessor: 'description',
      disableSortBy: true
    },
    {
      Header: <FormattedMessage id="status" />,
      accessor: 'status_id',
      disableSortBy: true,
      Cell: ({ value }: { value: number }) => {
        return <ChipStatus id={value} successLabel="active" errorLabel="inactive" />;
      }
    },
    {
      Header: ' ',
      className: 'cell-center',
      disableSortBy: true,
      Cell: ({ row }: { row: Row<{}> }) => (
        <ColumnActions
          row={row}
          handleAdd={handleAdd}
          handleClose={handleClose}
          setRecord={setRecord}
          setRecordDelete={setRecordDelete}
          isHiddenView
        />
      )
    }
  ];
};
