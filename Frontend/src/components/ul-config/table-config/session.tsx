import { Row } from 'react-table';
import { FormattedMessage } from 'react-intl';
import ColumnActions from './column-action-status/column-action';
import { Chip } from '@mui/material';
import ChipStatus from 'components/atoms/ChipStatus';

//assets
import { CloudRemove } from 'iconsax-react';

export const columnsSession = (
  currentPage: number,
  pageSize: number,
  handleAdd: () => void,
  handleClose: () => void,
  setViewRecord: (record: any) => void,
  setRecordDelete: (record: any) => void,
  hiddenView?: boolean
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
      Header: <FormattedMessage id="data-id" />,
      disableSortBy: true,
      accessor: 'id',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="flight-number" />,
      disableSortBy: true,
      accessor: 'flight.aircraft.flight_number'
    },
    {
      Header: <FormattedMessage id="username" />,
      disableSortBy: true,
      accessor: 'user.username'
      // className: 'hidden'
    },
    {
      Header: <FormattedMessage id="device" />,
      disableSortBy: true,
      accessor: 'user_device'
    },
    {
      Header: <FormattedMessage id="plan" />,
      disableSortBy: true,
      accessor: 'product.title'
    },
    {
      Header: <FormattedMessage id="data-usage" />,
      disableSortBy: true,
      accessor: 'total_data_usage',
      className: 'cell-right',
      Cell: ({ value }: { value?: number }) => {
        if (typeof value === 'number') {
          return <span>{value} MB</span>;
        }
        return <span>--</span>;
      }
    },
    {
      Header: <FormattedMessage id="data-upload" />,
      disableSortBy: true,
      accessor: 'total_data_upload',
      className: 'hidden',
      Cell: ({ value }: { value?: number }) => {
        if (typeof value === 'number') {
          return <span>{value} MB</span>;
        }
        return <span>--</span>;
      }
    },
    {
      Header: <FormattedMessage id="data-download" />,
      disableSortBy: true,
      accessor: 'total_data_download',
      className: 'hidden',
      Cell: ({ value }: { value?: number }) => {
        if (typeof value === 'number') {
          return <span>{value} MB</span>;
        }
        return <span>--</span>;
      }
    },
    {
      Header: <FormattedMessage id="time-usage" />,
      disableSortBy: true,
      accessor: 'total_time_usage_hour',
      className: 'cell-right',
      Cell: ({ value }: { value?: number }) => {
        if (typeof value === 'number') {
          return (
            <span>
              {value} <FormattedMessage id="hour" />
            </span>
          );
        }
        return <span>--</span>;
      }
    },
    {
      Header: <FormattedMessage id="mac-address" />,
      disableSortBy: true,
      accessor: 'user_mac_address',
      className: 'cell-right'
    },
    {
      Header: <FormattedMessage id="ip-address" />,
      disableSortBy: true,
      accessor: 'user_ip_address',
      className: 'cell-right'
    },
    {
      Header: <FormattedMessage id="access-time" />,
      disableSortBy: true,
      accessor: 'created_date'
    },
    {
      Header: <FormattedMessage id="note" />,
      disableSortBy: true,
      accessor: 'terminate_reason',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="status" />,
      disableSortBy: true,
      accessor: 'session_status',
      className: 'cell-center',
      Cell: ({ value }: { value: any }) => {
        if (value === 'Active') {
          return <Chip color="success" label={<FormattedMessage id={'active'} />} size="small" variant="light" />;
        } else {
          return <Chip color="error" label={<FormattedMessage id={'inactive'} />} size="small" variant="light" />;
        }
      }
    },
    {
      Header: ' ',
      className: 'cell-center',
      disableSortBy: true,
      Cell: ({ row }: { row: Row<{}> }) => (
        <ColumnActions
          isHiddenEdit
          row={row}
          handleAdd={handleAdd}
          handleClose={handleClose}
          newDeleteIcon={<CloudRemove />}
          titleDelete="terminate"
          setRecordDelete={setRecordDelete}
          isDeletable={row.values.session_status === 'Active' ? false : true}
          setViewRecord={setViewRecord}
          isHiddenView={hiddenView}
        />
      )
    }
  ];
};

export const columnsSessionDetail = (
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
      Header: <FormattedMessage id="data-id" />,
      disableSortBy: true,
      accessor: 'session.id',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="ip-address" />,
      disableSortBy: true,
      accessor: 'session.user_ip_address'
    },
    {
      Header: <FormattedMessage id="mac-address" />,
      disableSortBy: true,
      accessor: 'session.user_mac_address'
    },
    {
      Header: <FormattedMessage id="username" />,
      disableSortBy: true,
      accessor: 'user.username',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="access-time" />,
      disableSortBy: true,
      accessor: 'session_times'
    },
    {
      Header: <FormattedMessage id="duration-time" />,
      disableSortBy: true,
      accessor: 'session.duration_time',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="data-usage" />,
      disableSortBy: true,
      accessor: 'session.data_usage_mb',
      className: 'cell-right',
      Cell: ({ value }: { value?: number }) => {
        if (typeof value === 'number') {
          return <span>{value} MB</span>;
        }
        return <span>--</span>;
      }
    },
    {
      Header: <FormattedMessage id="average-speed-mbps" />,
      disableSortBy: true,
      accessor: 'session.average_speed_mbps',
      className: 'cell-right',
      Cell: ({ value }: { value?: number }) => {
        if (typeof value === 'number') {
          return <span>{value} Mbps</span>;
        }
        return <span>--</span>;
      }
    },
    {
      Header: <FormattedMessage id="response-time-ms" />,
      disableSortBy: true,
      accessor: 'session.response_time_ms',
      className: 'hidden',
      Cell: ({ value }: { value?: number }) => {
        if (typeof value === 'number') {
          return <span>{value} ms</span>;
        }
        return <span>--</span>;
      }
    },
    {
      Header: <FormattedMessage id="protocol" />,
      disableSortBy: true,
      accessor: 'session.protocol',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="device-name" />,
      disableSortBy: true,
      accessor: 'device.name',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="url" />,
      disableSortBy: true,
      accessor: 'session.url',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="destination-ip" />,
      disableSortBy: true,
      accessor: 'session.destination_ip',
      className: 'hidden'
    },

    {
      Header: <FormattedMessage id="domain" />,
      disableSortBy: true,
      accessor: 'session.domain',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="port" />,
      disableSortBy: true,
      accessor: 'session.port',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="user-agent" />,
      disableSortBy: true,
      accessor: 'session.user_agent'
      // className: 'hidden'
    },
    {
      Header: <FormattedMessage id="referrer" />,
      disableSortBy: true,
      accessor: 'session.referrer',
      className: 'hidden'
    },

    {
      Header: <FormattedMessage id="ssl-version" />,
      disableSortBy: true,
      accessor: 'session.ssl_version',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="session" />,
      disableSortBy: true,
      accessor: 'session.total_data_usage',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="session-data-upload" />,
      disableSortBy: true,
      accessor: 'session.total_data_upload',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="session-data-download" />,
      disableSortBy: true,
      accessor: 'session.total_data_download',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="session-time-usage-hour" />,
      disableSortBy: true,
      accessor: 'session.total_time_usage_hour',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="session-status" />,
      disableSortBy: true,
      accessor: 'session.session_status',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="bytes-transferred" />,
      disableSortBy: true,
      accessor: 'session.bytes_transferred',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="bytes-received" />,
      disableSortBy: true,
      accessor: 'session.bytes_received',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="plan" />,
      disableSortBy: true,
      accessor: 'product.title',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="connection-quality" />,
      disableSortBy: true,
      accessor: 'session.connection_quality'
      // className: 'hidden'
    },
    {
      Header: <FormattedMessage id="status" />,
      disableSortBy: true,
      accessor: 'session.status_id',
      className: 'cell-center',
      Cell: ({ value }: { value: number }) => {
        return <ChipStatus id={value} successLabel="online" errorLabel="offline" />;
      }
    },
    {
      Header: ' ',
      className: 'cell-center',
      disableSortBy: true,
      Cell: ({ row }: { row: Row<{}> }) => (
        <ColumnActions
          isHiddenEdit
          isHiddenView
          row={row}
          handleAdd={handleAdd}
          handleClose={handleClose}
          setRecord={setRecord}
          setRecordDelete={setRecordDelete}
          newDeleteIcon={<CloudRemove />}
          titleDelete={'Terminate'}
          isDeletable={row.values.session?.status_id === 14 ? true : false}
        />
      )
    }
  ];
};

export const ColumnsSessionActivities = (currentPage: number, pageSize: number, handleAdd: () => void, handleClose: () => void) => {
  return [
    {
      Header: <FormattedMessage id="data-id" />,
      disableSortBy: true,
      accessor: 'session.id',
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
      Header: <FormattedMessage id="username" />,
      disableSortBy: true,
      accessor: 'user.username'
    },
    {
      Header: <FormattedMessage id="device-name" />,
      disableSortBy: true,
      accessor: 'device.name'
    },
    {
      Header: <FormattedMessage id="route" />,
      disableSortBy: true,
      accessor: 'route'
    },
    {
      Header: <FormattedMessage id="start-session" />,
      disableSortBy: true,
      accessor: 'session.start_time'
    },
    {
      Header: <FormattedMessage id="end-session" />,
      disableSortBy: true,
      accessor: 'session.stop_time'
    },
    {
      Header: <FormattedMessage id="data-usage" />,
      disableSortBy: true,
      accessor: 'session.total_data_usage_mb',
      className: 'cell-right',
      Cell: ({ value }: { value?: number }) => {
        if (typeof value === 'number') {
          return <span>{value} MB</span>;
        }
        return <span>--</span>;
      }
    },
    {
      Header: <FormattedMessage id="status" />,
      disableSortBy: true,
      accessor: 'session.status_id',
      className: 'cell-center',
      Cell: ({ value }: { value: number }) => {
        return <ChipStatus id={value} successLabel="online" errorLabel="offline" />;
      }
    },
    {
      Header: ' ',
      className: 'cell-center',
      disableSortBy: true,
      Cell: ({ row }: { row: Row<{}> }) => (
        <ColumnActions
          isHiddenEdit
          isHiddenDelete
          isHiddenView
          row={row}
          handleAdd={handleAdd}
          handleClose={handleClose}
          // newDeleteIcon={<CloudRemove />}
          // titleDelete={'Terminate'}
          isDeletable={row.values.session?.status_id === 14 ? true : false}
        />
      )
    }
  ];
};
