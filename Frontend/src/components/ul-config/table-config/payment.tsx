//third-party
import { Row } from 'react-table';

//project component
import { FormattedMessage } from 'react-intl';
import ColumnActions from './column-action-status/column-action';
import ChipStatus from 'components/atoms/ChipStatus';

export const columnsPaymentMethod = (
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
      Header: <FormattedMessage id="code" />,
      disableSortBy: true,
      accessor: 'code'
    },
    {
      Header: <FormattedMessage id="name-payment-method" />,
      disableSortBy: true,
      accessor: 'title'
    },
    {
      Header: <FormattedMessage id="service-parameters" />,
      disableSortBy: true,
      accessor: 'value'
    },
    {
      Header: <FormattedMessage id="desc" />,
      disableSortBy: true,
      accessor: 'description'
    },
    {
      Header: <FormattedMessage id="status-active" />,
      disableSortBy: true,
      accessor: 'status_id',
      className: 'cell-center',
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

export const columnsGateway = (
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
      Header: <FormattedMessage id="code" />,
      disableSortBy: true,
      accessor: 'code'
    },
    {
      Header: <FormattedMessage id="name-gateway" />,
      disableSortBy: true,
      accessor: 'title'
    },
    {
      Header: <FormattedMessage id="service-parameters" />,
      disableSortBy: true,
      accessor: 'value'
    },
    {
      Header: <FormattedMessage id="income" />,
      disableSortBy: true,
      accessor: 'income',
      Cell: ({ value }: { value?: number }) => {
        // Check if 'value' is not undefined and is a number before attempting to format it
        if (typeof value === 'number') {
          return <span>{value.toLocaleString('vi-VN')} VND</span>; // Using 'vi-VN' to ensure Vietnamese currency formatting
        }
        return <span>--</span>; // Return a placeholder or some default UI if the value is undefined
      }
    },
    {
      Header: <FormattedMessage id="desc" />,
      disableSortBy: true,
      accessor: 'description'
    },
    {
      Header: <FormattedMessage id="status-active" />,
      disableSortBy: true,
      accessor: 'status_id',
      className: 'cell-center',
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

export const columnsSaleChannel = (
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
      Header: <FormattedMessage id="code" />,
      disableSortBy: true,
      accessor: 'code'
    },
    {
      Header: <FormattedMessage id="name-sale-channel" />,
      disableSortBy: true,
      accessor: 'title'
    },
    {
      Header: <FormattedMessage id="service-parameters" />,
      disableSortBy: true,
      accessor: 'value'
    },
    {
      Header: <FormattedMessage id="income" />,
      disableSortBy: true,
      accessor: 'income',
      Cell: ({ value }: { value?: number }) => {
        // Check if 'value' is not undefined and is a number before attempting to format it
        if (typeof value === 'number') {
          return <span>{value.toLocaleString('vi-VN')} VND</span>; // Using 'vi-VN' to ensure Vietnamese currency formatting
        }
        return <span>--</span>; // Return a placeholder or some default UI if the value is undefined
      }
    },
    {
      Header: <FormattedMessage id="desc" />,
      disableSortBy: true,
      accessor: 'description'
    },
    {
      Header: <FormattedMessage id="status-active" />,
      disableSortBy: true,
      accessor: 'status_id',
      className: 'cell-center',
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
