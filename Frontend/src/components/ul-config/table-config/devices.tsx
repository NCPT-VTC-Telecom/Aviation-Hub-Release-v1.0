import { FormattedMessage } from 'react-intl';

//third-party
import { Row } from 'react-table';

//project-import
import ChipStatus from 'components/atoms/ChipStatus';
import ColumnActions from './column-action-status/column-action';

//utils
import { getPlacementLocation } from 'utils/getData';

//types
import { DeviceData } from 'types/device';

export const columnsDevice = (
  currentPage: number,
  pageSize: number,
  handleAdd: () => void,
  handleClose: () => void,
  setRecord?: (record: DeviceData) => void,
  setRecordDelete?: (record: DeviceData) => void,
  onViewClick?: (record: DeviceData) => void,
  hiddenView?: boolean
) => {
  return [
    {
      Header: <FormattedMessage id="device-id" />,
      disableSortBy: true,
      accessor: 'id_device',
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
      accessor: 'name'
    },
    {
      Header: <FormattedMessage id="model" />,
      disableSortBy: true,
      accessor: 'model',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="type" />,
      disableSortBy: true,
      accessor: 'type',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="firmware" />,
      disableSortBy: true,
      accessor: 'firmware'
    },
    {
      Header: <FormattedMessage id="wifi-standard" />,
      disableSortBy: true,
      accessor: 'wifi_standard'
    },
    {
      Header: <FormattedMessage id="description" />,
      disableSortBy: true,
      accessor: 'description',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="aircraft-installation" />,
      disableSortBy: true,
      accessor: 'aircraft.tail_number'
    },
    {
      Header: <FormattedMessage id="placement-location" />,
      disableSortBy: true,

      accessor: 'placement_location',
      Cell: ({ value }: { value: string }) => {
        return <span>{getPlacementLocation(value)}</span>;
      }
    },
    {
      Header: <FormattedMessage id="activation-date" />,
      disableSortBy: true,
      accessor: 'activation_date',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="deactivation-date" />,
      disableSortBy: true,
      accessor: 'deactivation_date',
      className: 'hidden'
    },

    {
      Header: <FormattedMessage id="ip-address" />,
      disableSortBy: true,
      accessor: 'ip_address'
    },
    {
      Header: <FormattedMessage id="last-ip" />,
      disableSortBy: true,
      accessor: 'last_ip',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="port" />,
      disableSortBy: true,
      accessor: 'port',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="mac-address" />,
      disableSortBy: true,
      accessor: 'mac_address'
    },
    {
      Header: <FormattedMessage id="ipv6-address" />,
      disableSortBy: true,
      accessor: 'ipv6_address',
      className: 'hidden'
    },

    {
      Header: <FormattedMessage id="manufacturer" />,
      disableSortBy: true,
      accessor: 'manufacturer',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="manufacturer-date" />,
      disableSortBy: true,
      accessor: 'manufacturer_date',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="cpu-type" />,
      disableSortBy: true,

      accessor: 'cpu_type',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="supplier" />,
      disableSortBy: true,

      accessor: 'supplier',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="status" />,
      disableSortBy: true,

      accessor: 'status_id',
      className: 'cell-center',
      Cell: ({ value }: { value: number }) => <ChipStatus id={value} successLabel="online" errorLabel="offline" dangerLabel="no-internet" />
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

export const columnsDevicesHealth = (
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
      Header: <FormattedMessage id="device-id" />,
      disableSortBy: true,

      accessor: 'id_device',
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
      Header: <FormattedMessage id="device-name" />,
      disableSortBy: true,
      accessor: 'name'
    },
    {
      Header: <FormattedMessage id="model" />,
      disableSortBy: true,
      accessor: 'model',
      className: 'min-w-24'
    },
    {
      Header: <FormattedMessage id="type" />,
      disableSortBy: true,
      accessor: 'type',
      className: 'min-w-24'
    },
    {
      Header: <FormattedMessage id="cpu" />,
      disableSortBy: true,
      accessor: 'cpu_usage',
      className: 'min-w-14',
      Cell: ({ value }: { value: number }) => {
        return <span>{value} %</span>;
      }
    },
    {
      Header: <FormattedMessage id="memory" />,
      disableSortBy: true,

      accessor: 'memory_usage',
      Cell: ({ value }: { value: number }) => {
        return <span>{value} %</span>;
      }
    },
    {
      Header: <FormattedMessage id="disk" />,
      disableSortBy: true,
      accessor: 'disk_usage',
      className: 'min-w-14',
      Cell: ({ value }: { value: number }) => {
        return <span>{value} %</span>;
      }
    },
    {
      Header: <FormattedMessage id="temperature" />,
      disableSortBy: true,

      accessor: 'temperature',
      Cell: ({ value }: { value: number }) => {
        return <span>{value} °C</span>;
      }
    },
    {
      Header: <FormattedMessage id="status" />,
      disableSortBy: true,

      accessor: 'status_id',
      className: 'cell-center',
      Cell: ({ value }: { value: number }) => {
        return <ChipStatus id={value} successLabel="healthy" errorLabel="unhealthy" warningLabel="maintenance" />;
      }
    },
    {
      Header: <FormattedMessage id="placement-location" />,
      disableSortBy: true,

      accessor: 'placement_location',
      Cell: ({ value }: { value: string }) => {
        return <span>{getPlacementLocation(value)}</span>;
      }
    },
    {
      Header: <FormattedMessage id="supplier" />,
      disableSortBy: true,

      accessor: 'supplier'
    },
    {
      Header: <FormattedMessage id="last-check-time" />,
      disableSortBy: true,

      accessor: 'health_check_time'
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
          isHiddenView={hiddenView}
        />
      )
    }
  ];
};

export const columnsDevicesModel = (
  currentPage: number,
  pageSize: number,
  handleAdd: () => void,
  handleClose: () => void,
  setRecord: (record: any) => void,
  setRecordDelete: (record: any) => void
) => {
  return [
    {
      Header: <FormattedMessage id="device-id" />,
      disableSortBy: true,

      accessor: 'id_device',
      className: 'hidden'
    },
    {
      Header: ' ',
      disableSortBy: true,

      accessor: 'index',
      Cell: ({ row }: { row: Row }) => {
        const rowNumber = (currentPage - 1) * pageSize + row.index + 1;
        return <div>{rowNumber}</div>;
      }
    },
    {
      Header: <FormattedMessage id="device-name" />,
      disableSortBy: true,

      accessor: 'name'
    },
    {
      Header: <FormattedMessage id="model" />,
      disableSortBy: true,

      accessor: 'model'
    },
    {
      Header: <FormattedMessage id="type" />,
      disableSortBy: true,

      accessor: 'type'
    },
    {
      Header: <FormattedMessage id="firmware" />,
      disableSortBy: true,

      accessor: 'firmware'
    },
    {
      Header: <FormattedMessage id="wifi-standard" />,
      disableSortBy: true,

      accessor: 'wifi_standard'
    },
    {
      Header: <FormattedMessage id="manufacturer" />,
      disableSortBy: true,

      accessor: 'manufacturer'
    },
    {
      Header: <FormattedMessage id="manufacturer-date" />,
      disableSortBy: true,

      accessor: 'manufacturer_date',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="cpu-type" />,
      disableSortBy: true,

      accessor: 'cpu_type',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="supplier" />,
      disableSortBy: true,

      accessor: 'supplier'
    },
    {
      Header: <FormattedMessage id="desc" />,
      disableSortBy: true,

      accessor: 'description',
      className: 'hidden'
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
        <ColumnActions row={row} handleAdd={handleAdd} handleClose={handleClose} setRecord={setRecord} setRecordDelete={setRecordDelete} />
      )
    }
  ];
};

export const columnsDevicesMonitoring = (
  currentPage: number,
  pageSize: number,
  handleAdd: () => void,
  handleClose: () => void,
  setRecord?: (record: DeviceData) => void,
  // setRecordDelete?: (record: DeviceData) => void,
  onViewClick?: (record: DeviceData) => void,
  hiddenView?: boolean
) => {
  return [
    {
      Header: <FormattedMessage id="device-id" />,
      disableSortBy: true,
      accessor: 'id_device',
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
      accessor: 'name'
    },
    {
      Header: <FormattedMessage id="model" />,
      disableSortBy: true,
      accessor: 'model',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="type" />,
      disableSortBy: true,
      accessor: 'type',
      className: 'min-w-28'
    },
    {
      Header: <FormattedMessage id="firmware" />,
      disableSortBy: true,
      accessor: 'firmware',
      className: 'min-w-16'
    },
    {
      Header: <FormattedMessage id="wifi-standard" />,
      disableSortBy: true,
      accessor: 'wifi_standard',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="aircraft-installation" />,
      disableSortBy: true,
      accessor: 'aircraft.tail_number'
    },
    {
      Header: <FormattedMessage id="placement-location" />,
      disableSortBy: true,

      accessor: 'placement_location',
      Cell: ({ value }: { value: string }) => {
        return <span>{getPlacementLocation(value)}</span>;
      }
    },
    {
      Header: <FormattedMessage id="activation-date" />,
      disableSortBy: true,
      accessor: 'activation_date',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="deactivation-date" />,
      disableSortBy: true,
      accessor: 'deactivation_date',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="ip-address" />,
      disableSortBy: true,
      accessor: 'ip_address'
    },
    {
      Header: <FormattedMessage id="last-ip" />,
      disableSortBy: true,
      accessor: 'last_ip',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="port" />,
      disableSortBy: true,
      accessor: 'port',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="mac-address" />,
      disableSortBy: true,
      accessor: 'mac_address'
    },
    {
      Header: <FormattedMessage id="ipv6-address" />,
      disableSortBy: true,
      accessor: 'ipv6_address',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="manufacturer" />,
      disableSortBy: true,
      accessor: 'manufacturer',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="manufacturer-date" />,
      disableSortBy: true,

      accessor: 'manufacturer_date',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="cpu-type" />,
      disableSortBy: true,

      accessor: 'cpu_type',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="supplier" />,
      disableSortBy: true,
      accessor: 'supplier',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="last-activity" />,
      disableSortBy: true,
      accessor: 'last_activity'
    },
    {
      Header: <FormattedMessage id="last-sync-time" />,
      disableSortBy: true,
      accessor: 'last_sync_time'
    },
    {
      Header: <FormattedMessage id="status" />,
      disableSortBy: true,
      accessor: 'status_id',
      className: 'cell-center',
      Cell: ({ value }: { value: number }) => (
        <ChipStatus id={value} successLabel="active" errorLabel="inactive" dangerLabel="no-internet" />
      )
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
          isHiddenEdit
          isHiddenDelete
        />
      )
    }
  ];
};

export const columnsHistoryIFC = (
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
      Header: <FormattedMessage id="device-id" />,
      disableSortBy: true,

      accessor: 'id_device',
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
      Header: <FormattedMessage id="up-time" />,
      disableSortBy: true,
      accessor: 'uptime',
      Cell: ({ value }: { value: number }) => {
        return <div>{value}s</div>;
      }
    },
    {
      Header: <FormattedMessage id="down-time" />,
      disableSortBy: true,
      accessor: 'downtime',
      Cell: ({ value }: { value: number }) => {
        return <div>{value}s</div>;
      }
    },
    {
      Header: <FormattedMessage id="failed-connection" />,
      disableSortBy: true,
      accessor: 'failedConnections'
    },
    {
      Header: <FormattedMessage id="connection-quality" />,
      disableSortBy: true,
      accessor: 'connectionQuality'
    },
    {
      Header: <FormattedMessage id="packet-loss-rate" />,
      disableSortBy: true,
      accessor: 'packetLossRate',
      Cell: ({ value }: { value: number }) => {
        return <div>{value}%</div>;
      }
    },
    {
      Header: <FormattedMessage id="bandwidth-usage" />,
      disableSortBy: true,
      accessor: 'bandwidthUsage',
      Cell: ({ value }: { value: number }) => {
        return <div>{value} Mb</div>;
      }
    },
    {
      Header: <FormattedMessage id="latency" />,
      disableSortBy: true,
      accessor: 'latency',
      Cell: ({ value }: { value: number }) => {
        return <div>{value} ms</div>;
      }
    },
    {
      Header: <FormattedMessage id="speed" />,
      disableSortBy: true,
      accessor: 'speed',
      Cell: ({ value }: { value: number }) => {
        return <div>{value} Mbps</div>;
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
          isHiddenEdit
          isHiddenView
          isHiddenDelete
        />
      )
    }
  ];
};
