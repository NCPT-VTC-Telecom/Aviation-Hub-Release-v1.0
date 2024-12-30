import { FormattedMessage } from 'react-intl';
import React from 'react';
import { SelectChangeEvent } from '@mui/material/Select';

//project-import
import { FormControl, Select, MenuItem, Chip } from '@mui/material';
import { Row } from 'react-table';
import ColumnActions from './column-action-status/column-action';

//third-party
import { limitTextToWords } from 'utils/handleData';

interface StatusSelectCellProps {
  value: number;
  requestNumber: string;
  onChange: (event: SelectChangeEvent<number>, requestNumber: string) => void;
}

const StatusSelectCell: React.FC<StatusSelectCellProps> = ({ value, onChange, requestNumber }) => {
  return (
    <FormControl fullWidth size="small">
      <Select
        value={value}
        onChange={(event) => onChange(event, requestNumber)}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '&.MuiInput-underline:before, &.MuiInput-underline:after': {
            borderBottom: 'none'
          },
          '&.MuiInputBase-root': {
            border: 'none'
          }
        }}
        displayEmpty
        size="small"
        variant="outlined"
      >
        <MenuItem value={33} className="my-1">
          <Chip className="w-full" color="info" label={<FormattedMessage id="new-request" />} size="small" variant="light" />
        </MenuItem>
        <MenuItem value={31} className="my-1">
          <Chip className="w-full" color="warning" label={<FormattedMessage id="pending" />} size="small" variant="light" />
        </MenuItem>
        <MenuItem value={34} className="my-1">
          <Chip className="w-full" color="success" label={<FormattedMessage id="resolved" />} size="small" variant="light" />
        </MenuItem>
        <MenuItem value={35} className="my-1">
          <Chip className="w-full" color="error" label={<FormattedMessage id="unable-resolve" />} size="small" variant="light" />
        </MenuItem>
        {/* <MenuItem value={33}>
          <FormattedMessage id="new-request" defaultMessage="New Request" />
        </MenuItem> */}
      </Select>
    </FormControl>
  );
};

export const columnsCustomerServices = (
  handleAdd: () => void,
  handleClose: () => void,
  setRecord: (record: any) => void,
  onChangeStatus: (id: number, requestNumber: string) => void
) => {
  return [
    {
      Header: <FormattedMessage id="request-number" />,
      accessor: 'request_number',
      Cell: ({ value }: { value: string }) => {
        return <span>{value}</span>;
      }
    },
    {
      Header: <FormattedMessage id="title-sender" />,
      accessor: 'title_sender',
      Cell: ({ value }: { value: string | null }) => <span>{limitTextToWords(value, 50)}</span>
    },
    {
      Header: <FormattedMessage id="fullname" />,
      accessor: 'user_sender.fullname'
    },
    {
      Header: <FormattedMessage id="email-address" />,
      accessor: 'user_sender.email'
    },
    {
      Header: <FormattedMessage id="date-sended" />,
      accessor: 'created_date'
    },
    {
      Header: <FormattedMessage id="status" />,
      accessor: 'status_id',
      className: 'cell-center',
      Cell: ({ row }: { row: any }) => {
        const handleStatusChange = (event: SelectChangeEvent<number>, requestNumber: string) => {
          const newValue = event.target.value as number;
          onChangeStatus(newValue, requestNumber);
        };

        return (
          <StatusSelectCell value={row.original.status_id} requestNumber={row.original.request_number} onChange={handleStatusChange} />
        );
      }
    },
    {
      Header: ' ',
      className: 'cell-center',
      disableSortBy: true,
      Cell: ({ row }: { row: Row<{}> }) => (
        <ColumnActions
          // isHiddenEdit
          // isHiddenView
          row={row}
          handleAdd={handleAdd}
          handleClose={handleClose}
          setRecord={setRecord}
        />
      )
    }
  ];
};
