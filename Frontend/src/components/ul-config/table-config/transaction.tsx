//third-party
import { Row } from 'react-table';

//project component
import { FormattedMessage } from 'react-intl';
import ColumnActions from './column-action-status/column-action';
import ChipStatus from 'components/atoms/ChipStatus';

export const columnsTransaction = (
  currentPage: number,
  pageSize: number,
  handleAdd: () => void,
  handleClose: () => void,
  setRecord?: (record: any) => void,
  setRecordDelete?: (record: any) => void
) => {
  return [
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
      Header: <FormattedMessage id="order-number" />,
      disableSortBy: true,
      accessor: 'order_number'
    },
    {
      Header: <FormattedMessage id="subtotal" />,
      disableSortBy: true,
      accessor: 'subtotal',
      Cell: ({ value }: { value?: number }) => {
        // Check if 'value' is not undefined and is a number before attempting to format it
        if (typeof value === 'number') {
          return <span>{value.toLocaleString('vi-VN')} VND</span>; // Using 'vi-VN' to ensure Vietnamese currency formatting
        }
        return <span>--</span>; // Return a placeholder or some default UI if the value is undefined
      }
    },
    {
      Header: <FormattedMessage id="grand-total" />,
      disableSortBy: true,
      accessor: 'total',
      Cell: ({ value }: { value?: number }) => {
        // Check if 'value' is not undefined and is a number before attempting to format it
        if (typeof value === 'number') {
          return <span>{value.toLocaleString('vi-VN')} VND</span>; // Using 'vi-VN' to ensure Vietnamese currency formatting
        }
        return <span>--</span>; // Return a placeholder or some default UI if the value is undefined
      }
    },
    {
      Header: <FormattedMessage id="status" />,
      disableSortBy: true,
      accessor: 'status_id',
      className: 'cell-center',
      Cell: ({ value }: { value: number }) => {
        return <ChipStatus id={value} successLabel="paid" errorLabel="not-paid" warningLabel="pending" />;
      }
    },
    {
      Header: <FormattedMessage id="created-date" />,
      disableSortBy: true,
      accessor: 'transaction_date'
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
          isHiddenEdit
          isHiddenView
        />
      )
    }
  ];
};

export const columnsBilling = (
  currentPage: number,
  pageSize: number,
  handleAdd: () => void,
  handleClose: () => void,
  setRecord?: (record: any) => void,
  setRecordDelete?: (record: any) => void
) => {
  return [
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
      Header: <FormattedMessage id="billing-number" />,
      disableSortBy: true,
      accessor: 'billing_number'
    },
    {
      Header: <FormattedMessage id="order-number" />,
      disableSortBy: true,
      accessor: 'order_number'
    },
    {
      Header: <FormattedMessage id="quantity" />,
      disableSortBy: true,
      accessor: 'total_quantity',
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
      Header: <FormattedMessage id="status" />,
      disableSortBy: true,
      accessor: 'status_id',
      className: 'cell-center',
      Cell: ({ value }: { value: number }) => {
        return <ChipStatus id={value} successLabel="paid" errorLabel="not-paid" warningLabel="pending" />;
      }
    },
    {
      Header: <FormattedMessage id="created-date" />,
      disableSortBy: true,
      accessor: 'billing_date',
      className: 'cell-right'
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
          isHiddenEdit
          isHiddenView
        />
      )
    }
  ];
};
