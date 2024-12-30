//third-party
import { Row } from 'react-table';
//project component
import { FormattedMessage } from 'react-intl';

export const columnsRecentFlight = [
  {
    Header: '#',
    accessor: 'id',
    className: 'hidden'
  },
  {
    Header: ' ',
    accessor: 'index',
    Cell: ({ row }: { row: Row }) => <div>{row.index + 1}</div>
  },
  {
    Header: <FormattedMessage id="order-number" />,
    accessor: 'order-number',
    disableSortBy: true
  },
  {
    Header: <FormattedMessage id="tail-number" />,
    accessor: 'aircraft.tail_number',
    disableSortBy: true
  },
  {
    Header: <FormattedMessage id="quantity" />,
    accessor: 'total_quantity',
    disableSortBy: true
  },
  {
    Header: <FormattedMessage id="total" />,
    accessor: 'total',
    disableSortBy: true
  }
];
