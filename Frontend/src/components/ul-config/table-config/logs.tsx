//third-party
import { Row } from 'react-table';

//project component
import { FormattedMessage } from 'react-intl';
import ColumnActions from './column-action-status/column-action';

//utils
import { limitTextToWords } from 'utils/handleData';

// import getChipStatus from '../../form/field/renderChip';

// function truncateField(data: any, maxLength: number = 40) {
//   for (const key in data) {
//     if (typeof data[key] === 'string') {
//       if (data[key].length > maxLength) {
//         data[key] = `${data[key].substring(0, maxLength)}...`;
//       }
//     } else if (typeof data[key] === 'object') {
//       truncateField(data[key], maxLength);
//     }
//   }
//   return data;
// }

// function formatJson(jsonString: string): string {
//   try {
//     let jsonObject = JSON.parse(jsonString);
//     jsonObject = truncateField(jsonObject);
//     return JSON.stringify(jsonObject, null, 2);
//   } catch (error) {
//     console.error('Error parsing or formatting JSON:', error);
//     return jsonString;
//   }
// }

export const columnsLogs = (
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
      Header: <FormattedMessage id="action-type" />,
      disableSortBy: true,
      accessor: 'action_type'
    },
    {
      Header: <FormattedMessage id="datatable" />,
      disableSortBy: true,
      accessor: 'table_name'
    },
    {
      Header: <FormattedMessage id="request-content" />,
      disableSortBy: true,
      accessor: 'request_content',
      Cell: ({ value }: { value: string | null }) => <span>{limitTextToWords(value, 10)}</span>
    },
    {
      Header: <FormattedMessage id="response-content" />,
      disableSortBy: true,
      accessor: 'response_content',
      Cell: ({ value }: { value: string | null }) => <span>{limitTextToWords(value, 10)}</span>
    },
    {
      Header: <FormattedMessage id="old-data" />,
      disableSortBy: true,
      accessor: 'old_data'
    },
    {
      Header: <FormattedMessage id="new-data" />,
      disableSortBy: true,
      accessor: 'new_data'
    },
    {
      Header: <FormattedMessage id="ip-address" />,
      disableSortBy: true,
      accessor: 'ipaddress'
    },
    {
      Header: <FormattedMessage id="user-agent" />,
      disableSortBy: true,
      accessor: 'user_agent'
    },
    {
      Header: <FormattedMessage id="action-time" />,
      disableSortBy: true,
      accessor: 'action_time'
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
