//third-party
import { Row } from 'react-table';
//project component
import { FormattedMessage } from 'react-intl';
//types
import { OrderDetail } from 'types/order';
import { getTypePackages } from 'utils/getData';

export const columnsHistoryUsedInternet = [
  {
    Header: '#',
    accessor: 'id',
    className: 'hidden'
  },
  {
    Header: ' ',
    accessor: 'index',
    className: 'hidden',
    Cell: ({ row }: { row: Row }) => <div>{row.index + 1}</div>
  },
  {
    Header: <FormattedMessage id="flight-number" />,
    accessor: 'flight.aircraft.flight_number',
    disableSortBy: true
  },
  {
    Header: <FormattedMessage id="route" />,
    accessor: 'route',
    disableSortBy: true
  },
  {
    Header: <FormattedMessage id="airline" />,
    accessor: 'flight.airline',
    disableSortBy: true
  },
  {
    Header: <FormattedMessage id="device" />,
    accessor: 'user_device',
    disableSortBy: true
  },
  {
    Header: <FormattedMessage id="mac-address" />,
    accessor: 'user_mac_address',
    disableSortBy: true
  },
  {
    Header: <FormattedMessage id="data-usage" />,
    accessor: 'total_data_usage',
    disableSortBy: true,
    className: 'cell-right',
    Cell: ({ value }: { value: number }) => <span>{value} MB</span>
  },
  {
    Header: <FormattedMessage id="plan-name" />,
    accessor: 'product.title',
    disableSortBy: true
  },
  {
    Header: <FormattedMessage id="plan-type" />,
    accessor: 'product.type',
    disableSortBy: true,
    Cell: ({ value }: { value: string }) => <span>{getTypePackages(value)}</span>
  },
  {
    Header: <FormattedMessage id="access-time" />,
    accessor: 'created_date',
    disableSortBy: true
  }
];

export const columnsRecentOrder = [
  {
    Header: '#',
    accessor: 'id',
    className: 'hidden'
  },
  {
    Header: ' ',
    accessor: 'index',
    className: 'hidden',
    Cell: ({ row }: { row: Row }) => <div>{row.index + 1}</div>
  },
  {
    Header: <FormattedMessage id="order-number" />,
    accessor: 'order_number',
    disableSortBy: true
  },
  {
    Header: <FormattedMessage id="route" />,
    accessor: 'route',
    disableSortBy: true
  },
  {
    Header: <FormattedMessage id="name-product" />,
    accessor: 'order_details',
    Cell: ({ value }: { value?: OrderDetail[] }) => {
      return (
        <>
          {value && value.length > 0 ? value.map((detail) => <div key={detail.id}>{detail.product?.title}</div>) : <div>No products</div>}
        </>
      );
    }
  },
  {
    Header: <FormattedMessage id="total-quantity" />,
    accessor: 'total_quantity',
    className: 'cell-right',
    disableSortBy: true
  },
  {
    Header: <FormattedMessage id="grand-total" />,
    accessor: 'total',
    className: 'cell-right',
    disableSortBy: true,
    Cell: ({ value }: { value?: number }) => {
      // Check if 'value' is not undefined and is a number before attempting to format it
      if (typeof value === 'number') {
        return <span>{value.toLocaleString('vi-VN')} VND</span>; // Using 'vi-VN' to ensure Vietnamese currency formatting
      }
      return <span>--</span>; // Return a placeholder or some default UI if the value is undefined
    }
  },
  {
    Header: <FormattedMessage id="date-of-purchased" />,
    accessor: 'created_date',
    className: 'cell-right',
    disableSortBy: true
  }
];
