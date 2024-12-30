//third-party
import { Row } from 'react-table';
//project component
import { FormattedMessage } from 'react-intl';
import ColumnActions from './column-action-status/column-action';
import ChipStatus from 'components/atoms/ChipStatus';

export const columnsRestrictionDevices = (
  currentPage: number,
  pageSize: number,
  handleAdd: () => void,
  handleClose: () => void,
  setRecord?: (record: any) => void,
  setRecordDelete?: (record: any) => void,
  hiddenView?: boolean
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
      accessor: 'index',
      className: 'cell-center',
      Cell: ({ row }: { row: Row }) => {
        const rowNumber = (currentPage - 1) * pageSize + row.index + 1;
        return <div>{rowNumber}</div>;
      }
    },
    {
      Header: <FormattedMessage id="device-name" />,
      disableSortBy: true,
      accessor: 'device_name'
    },
    {
      Header: <FormattedMessage id="ip-address" />,
      disableSortBy: true,
      accessor: 'ip_address',
      className: 'min-w-24'
    },
    {
      Header: <FormattedMessage id="ipv6-address" />,
      disableSortBy: true,
      accessor: 'ipv6_address'
    },
    {
      Header: <FormattedMessage id="mac-address" />,
      disableSortBy: true,
      accessor: 'mac_address'
    },
    {
      Header: <FormattedMessage id="restriction-reason" />,
      disableSortBy: true,
      accessor: 'reason'
    },
    {
      Header: <FormattedMessage id="restriction-date" />,
      disableSortBy: true,
      accessor: 'created_date'
    },
    {
      Header: ' ',
      className: 'cell-center',
      disableSortBy: true,
      Cell: ({ row }: { row: Row<{}> }) => (
        <ColumnActions
          isHiddenView={hiddenView}
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

export const columnsRestrictionDomain = (
  currentPage: number,
  pageSize: number,
  handleAdd: () => void,
  handleClose: () => void,
  setRecord: (record: any) => void,
  setRecordDelete: (record: any) => void
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
      accessor: 'index',
      className: 'cell-center',
      Cell: ({ row }: { row: Row }) => {
        const rowNumber = (currentPage - 1) * pageSize + row.index + 1;
        return <div>{rowNumber}</div>;
      }
    },
    {
      Header: <FormattedMessage id="domain-name" />,
      disableSortBy: true,
      accessor: 'url',
      className: 'min-w-28'
    },
    {
      Header: <FormattedMessage id="categories" />,
      disableSortBy: true,
      accessor: 'category.name'
    },
    // {
    //   Header: <FormattedMessage id="ip-destination" />,
    //   disableSortBy: true,
    //   accessor: 'ip_address',
    //   className: 'min-w-28'
    // },
    // {
    //   Header: <FormattedMessage id="ipv6-address" />,
    //   disableSortBy: true,
    //   accessor: 'ipv6_address'
    // },
    // {
    //   Header: <FormattedMessage id="dns-address" />,
    //   disableSortBy: true,
    //   accessor: 'dns_address'
    // },
    {
      Header: <FormattedMessage id="restriction-reason" />,
      disableSortBy: true,
      accessor: 'reason'
    },
    {
      Header: <FormattedMessage id="restriction-date" />,
      disableSortBy: true,
      accessor: 'created_date'
    },
    {
      Header: <FormattedMessage id="status" />,
      disableSortBy: true,
      accessor: 'status_id',
      className: 'cell-center',
      Cell: ({ value }: { value: number }) => <ChipStatus id={value} successLabel="active" errorLabel="inactive" />
    },
    {
      Header: ' ',
      className: 'cell-center',
      disableSortBy: true,
      Cell: ({ row }: { row: Row<{}> }) => (
        <ColumnActions row={row} handleAdd={handleAdd} handleClose={handleClose} setRecord={setRecord} setRecordDelete={setRecordDelete} />
      )
    }
  ];
};
