//third-party
import { Row } from 'react-table';

//project component
import { FormattedMessage } from 'react-intl';
import ChipStatus from 'components/atoms/ChipStatus';
import ColumnActions from './column-action-status/column-action';

//types
import { Order } from 'types/order';

export const columnsOrder = (
  currentPage: number,
  pageSize: number,
  handleAdd: () => void,
  handleClose: () => void,
  setRecord: (record: Order) => void,
  setViewRecord?: (record: Order) => void
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
      Header: <FormattedMessage id="order_number" />,
      disableSortBy: true,
      accessor: 'order_number'
    },
    {
      Header: <FormattedMessage id="user-name" />,
      disableSortBy: true,
      accessor: 'user.fullname'
    },
    {
      Header: <FormattedMessage id="email" />,
      disableSortBy: true,
      accessor: 'user.email',
      className: 'min-w-28'
    },
    {
      Header: <FormattedMessage id="quantity" />,
      disableSortBy: true,
      accessor: 'billing.total_quantity',
      className: 'cell-right'
    },
    {
      Header: <FormattedMessage id="grand-total" />,
      disableSortBy: true,
      accessor: 'total',
      className: 'cell-right',
      Cell: ({ value }: { value?: number }) => {
        // Check if 'value' is not undefined and is a number before attempting to format it
        if (typeof value === 'number') {
          return <span>{value.toLocaleString('vi-VN')} VND</span>; // Using 'vi-VN' to ensure Vietnamese currency formatting
        }
        return <span>--</span>; // Return a placeholder or some default UI if the value is undefined
      }
    },
    {
      Header: <FormattedMessage id="gateway" />,
      disableSortBy: true,
      accessor: 'gateway.title'
    },
    {
      Header: <FormattedMessage id="created-date" />,
      disableSortBy: true,
      accessor: 'created_date',
      className: 'min-w-28'
    },
    {
      Header: <FormattedMessage id="order-status" />,
      disableSortBy: true,
      accessor: 'transaction.status_id',
      className: 'cell-center',
      Cell: ({ value }: { value: number }) => <ChipStatus id={value} successLabel="paid" errorLabel="not-paid" warningLabel="pending" />
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
          setViewRecord={setViewRecord}
          isHiddenDelete
          isHiddenEdit
        />
      )
    }
  ];
};

export const columnsRecentOrder = (
  currentPage: number,
  pageSize: number,
  handleAdd: () => void,
  handleClose: () => void,
  setRecord?: (record: Order) => void,
  setViewRecord?: (record: Order) => void
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
      Header: <FormattedMessage id="order_number" />,
      disableSortBy: true,
      accessor: 'order_number'
    },
    {
      Header: <FormattedMessage id="user-name" />,
      disableSortBy: true,
      accessor: 'user.fullname'
    },
    {
      Header: <FormattedMessage id="email" />,
      disableSortBy: true,
      accessor: 'user.email'
    },
    {
      Header: <FormattedMessage id="quantity" />,
      disableSortBy: true,
      accessor: 'billing.total_quantity',
      className: 'cell-right'
    },
    {
      Header: <FormattedMessage id="grand-total" />,
      disableSortBy: true,
      accessor: 'total',
      className: 'cell-right',
      Cell: ({ value }: { value?: number }) => {
        // Check if 'value' is not undefined and is a number before attempting to format it
        if (typeof value === 'number') {
          return <span>{value.toLocaleString('vi-VN')} VND</span>; // Using 'vi-VN' to ensure Vietnamese currency formatting
        }
        return <span>--</span>; // Return a placeholder or some default UI if the value is undefined
      }
    },
    {
      Header: <FormattedMessage id="gateway" />,
      disableSortBy: true,
      accessor: 'gateway.title'
    },
    {
      Header: <FormattedMessage id="created-date" />,
      disableSortBy: true,
      accessor: 'created_date'
    },
    {
      Header: <FormattedMessage id="order-status" />,
      disableSortBy: true,
      accessor: 'transaction.status_id',
      className: 'cell-center',
      Cell: ({ value }: { value: number }) => <ChipStatus id={value} successLabel="paid" errorLabel="not-paid" warningLabel="pending" />
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
          setViewRecord={setViewRecord}
          isHiddenDelete
          isHiddenEdit
          isHiddenView
        />
      )
    }
  ];
};
