//third-party
import { Row } from 'react-table';
import { FormattedMessage } from 'react-intl';
//project component
import { Chip } from '@mui/material';
import ColumnActions from './column-action-status/column-action';
import ChipStatus from 'components/atoms/ChipStatus';

const renderPermissions = (permissionJson: string) => {
  try {
    const permissions = JSON.parse(permissionJson);
    // Initialize an array to hold the final elements including commas
    const elements: any[] = [];

    permissions.forEach((perm: string, index: number) => {
      const action = perm.split('_')[1]; // Strip the prefix like "user" or "admin"

      // Add the permission span element
      elements.push(
        <span key={`perm-${index}`}>{action === 'get' ? <FormattedMessage id="read-only" /> : <FormattedMessage id="sync" />}</span>
      );

      // Add a comma after the element if it's not the last one
      if (index < permissions.length - 1) {
        elements.push(<span key={`comma-${index}`}>, </span>);
      }
    });

    return elements;
  } catch (error) {
    return <span>{permissionJson}</span>; // Return original string if parsing fails
  }
};

export const columnsEndUser = (
  currentPage: number,
  pageSize: number,
  handleAdd: () => void,
  handleClose: () => void,
  setRecord: (record: any) => void,
  setRecordDelete: (record: any) => void,
  onViewClick?: (record: any) => void,
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
      Header: <FormattedMessage id="name_user" />,
      disableSortBy: true,
      accessor: 'fullname'
    },
    {
      Header: <FormattedMessage id="username" />,
      disableSortBy: true,
      accessor: 'username'
    },
    {
      Header: <FormattedMessage id="email" />,
      disableSortBy: true,
      accessor: 'email'
    },
    {
      Header: <FormattedMessage id="phone-number" />,
      disableSortBy: true,
      accessor: 'phone_number'
      // Cell: ({ value }: { value: number }) => <PatternFormat displayType="text" format="+84 ###-###-####" mask="_" defaultValue={value} />
    },
    {
      Header: <FormattedMessage id="gender" />,
      disableSortBy: true,
      accessor: 'gender',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="citizen-id" />,
      disableSortBy: true,
      accessor: 'citizen_id',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="address" />,
      disableSortBy: true,
      accessor: 'address',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="ward" />,
      disableSortBy: true,
      accessor: 'ward',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="district" />,
      disableSortBy: true,
      accessor: 'district'
    },
    {
      Header: <FormattedMessage id="province" />,
      disableSortBy: true,
      accessor: 'province'
    },
    {
      Header: <FormattedMessage id="country" />,
      disableSortBy: true,
      accessor: 'country'
    },
    {
      Header: <FormattedMessage id="postcode" />,
      disableSortBy: true,
      accessor: 'postcode'
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

export const columnsRole = (
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
      Header: <FormattedMessage id="name-role" />,
      disableSortBy: true,
      accessor: 'title'
    },
    {
      Header: <FormattedMessage id="permission" />,
      disableSortBy: true,
      accessor: 'permission',
      Cell: ({ value }: { value: string }) => {
        return <div style={{ display: 'flex', gap: '2px' }}>{renderPermissions(value)}</div>;
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
          isHiddenView
        />
      )
    }
  ];
};

export const columnsVendor = (
  currentPage: number,
  pageSize: number,
  handleAdd: () => void,
  handleClose: () => void,
  setRecord: (record: any) => void,
  setRecordDelete: (record: any) => void,
  // onViewClick?: (record: any) => void,
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
      Header: <FormattedMessage id="username" />,
      disableSortBy: true,
      accessor: 'username'
    },
    {
      Header: <FormattedMessage id="fullname" />,
      disableSortBy: true,
      accessor: 'fullname',
      className: 'min-w-24'
    },
    {
      Header: <FormattedMessage id="email" />,
      disableSortBy: true,
      accessor: 'email'
    },
    {
      Header: <FormattedMessage id="phone-number" />,
      disableSortBy: true,
      accessor: 'phone_number'
      // Cell: ({ value }: { value: number }) => <PatternFormat displayType="text" format="+84 ###-###-####" mask="_" defaultValue={value} />
    },
    {
      Header: <FormattedMessage id="address" />,
      disableSortBy: true,
      accessor: 'address',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="ward" />,
      disableSortBy: true,
      accessor: 'ward',
      className: 'hidden'
    },
    {
      Header: <FormattedMessage id="district" />,
      disableSortBy: true,
      accessor: 'district'
    },
    {
      Header: <FormattedMessage id="province" />,
      disableSortBy: true,
      accessor: 'province'
    },
    {
      Header: <FormattedMessage id="expired-date" />,
      disableSortBy: true,
      accessor: 'expired_date'
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
        <ColumnActions
          // setViewRecord={onViewClick}
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
