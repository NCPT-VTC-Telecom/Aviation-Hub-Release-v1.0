import { FormattedMessage } from 'react-intl';

//third-party
import { Row } from 'react-table';

//project component
import { Chip } from '@mui/material';
import ColumnActions from './column-action-status/column-action';

//types
import { ProviderData } from 'types/provider';

export const columnsDevicesProvider = (
  currentPage: number,
  pageSize: number,
  handleAdd: () => void,
  handleClose: () => void,
  setRecord: (record: ProviderData) => void,
  setRecordDelete: (record: ProviderData) => void,
  setViewRecord: (record: ProviderData) => void
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
      Header: <FormattedMessage id="name-supplier" />,
      disableSortBy: true,
      accessor: 'name'
    },
    {
      Header: <FormattedMessage id="desc" />,
      disableSortBy: true,
      accessor: 'description'
    },
    {
      Header: <FormattedMessage id="address" />,
      disableSortBy: true,
      accessor: 'address'
    },
    {
      Header: <FormattedMessage id="contact" />,
      disableSortBy: true,
      accessor: 'contact'
      // Cell: ({ value }: { value: number }) => <PatternFormat displayType="text" format="+84 ###-###-####" mask="_" defaultValue={value} />
    },
    {
      Header: <FormattedMessage id="status" />,
      disableSortBy: true,
      accessor: 'status_id',
      className: 'cell-center',
      Cell: ({ value }: { value: number }) => {
        switch (value) {
          case 14:
            return <Chip color="success" label={<FormattedMessage id="active" />} size="small" variant="light" />;
          default:
            return <Chip color="error" label={<FormattedMessage id="inactive" />} size="small" variant="light" />;
        }
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
          setViewRecord={setViewRecord}
        />
      )
    }
  ];
};

export const columnsTelecomProvider = (
  currentPage: number,
  pageSize: number,
  handleAdd: () => void,
  handleClose: () => void,
  setRecord: (record: any) => void,
  setRecordDelete: (record: any) => void,
  onViewClick: (record: any) => void,
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
      Header: <FormattedMessage id="name-supplier" />,
      disableSortBy: true,
      accessor: 'name'
    },
    {
      Header: <FormattedMessage id="desc" />,
      disableSortBy: true,
      accessor: 'description'
    },
    {
      Header: <FormattedMessage id="address" />,
      disableSortBy: true,
      accessor: 'address'
    },
    {
      Header: <FormattedMessage id="contact" />,
      disableSortBy: true,
      accessor: 'contact'
      // Cell: ({ value }: { value: number }) => <PatternFormat displayType="text" format="+84 ###-###-####" mask="_" defaultValue={value} />
    },
    {
      Header: <FormattedMessage id="status" />,
      disableSortBy: true,
      accessor: 'status_id',
      className: 'cell-center',
      Cell: ({ value }: { value: number }) => {
        switch (value) {
          case 14:
            return <Chip color="success" label={<FormattedMessage id="active" />} size="small" variant="light" />;
          default:
            return <Chip color="error" label={<FormattedMessage id="inactive" />} size="small" variant="light" />;
        }
      }
    },
    {
      Header: ' ',
      className: 'cell-center',
      disableSortBy: true,
      Cell: ({ row }: { row: Row<{}> }) => (
        <ColumnActions
          setViewRecord={onViewClick}
          row={row}
          handleAdd={handleAdd}
          handleClose={handleClose}
          setRecord={setRecord}
          setRecordDelete={setRecordDelete}
          isHiddenView={hiddenView}
        />
      )
    }
  ];
};
