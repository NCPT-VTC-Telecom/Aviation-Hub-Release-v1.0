import { useMemo, useEffect, Fragment, useState, useRef, ChangeEvent, Ref } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import {
  Box,
  Chip,
  Tabs,
  Tab,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

// third-party
import {
  useExpanded,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
  Column,
  HeaderGroup,
  Row,
  Cell,
  HeaderProps
} from 'react-table';

// project-imports
import Loader from 'components/Loader';
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import {
  // CSVExport,
  HeaderSort,
  IndeterminateCheckbox,
  TablePagination,
  TableRowSelection
} from 'components/third-party/ReactTable';
import AlertCustomerDelete from 'pages/apps/users/AlertCustomerDelete';

import { dispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { alertPopupToggle, getInvoiceDelete, getInvoiceList } from 'store/reducers/invoice';
import { renderFilterTypes, GlobalFilter, DateColumnFilter } from 'utils/react-table';

// assets
import { Edit, Eye, Trash } from 'iconsax-react';

// types
import { InvoiceList } from 'types/invoice';

// ==============================|| REACT TABLE ||============================== //

interface Props {
  columns: Column[];
  data: InvoiceList[];
}

function ReactTable({ columns, data }: Props) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const defaultColumn = useMemo(() => ({ Filter: DateColumnFilter }), []);
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const initialState = useMemo(
    () => ({
      filters: [{ id: 'status', value: '' }],
      hiddenColumns: ['avatar', 'email'],
      pageIndex: 0,
      pageSize: 5
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    state: { selectedRowIds, pageIndex, pageSize },
    preGlobalFilteredRows,
    setFilter
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      defaultColumn,
      initialState
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  const componentRef: Ref<HTMLDivElement> = useRef(null);

  // ================ Tab ================

  const groups = ['All', 'A', ...new Set(data.map((item: InvoiceList) => item.status))];
  const countGroup = data.map((item: InvoiceList) => item.status);
  const counts = countGroup.reduce(
    (acc: any, value: any) => ({
      ...acc,
      [value]: (acc[value] || 0) + 1
    }),
    {}
  );

  const [activeTab, setActiveTab] = useState(groups[0]);

  useEffect(() => {
    setFilter('status', activeTab === 'All' ? '' : activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <>
      <Box sx={{ p: 3, pb: 0, width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={(e: ChangeEvent<{}>, value: string) => setActiveTab(value)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {groups.map((status: string, index: number) => (
            <Tab
              key={index}
              label={status}
              value={status}
              icon={
                <Chip
                  label={
                    status === 'All'
                      ? data.length
                      : status === 'Paid'
                      ? counts.Paid
                      : status === 'Unpaid'
                      ? counts.Unpaid
                      : counts.Cancelled
                  }
                  color={status === 'All' ? 'primary' : status === 'Paid' ? 'success' : status === 'Unpaid' ? 'warning' : 'error'}
                  variant="light"
                  size="small"
                />
              }
              iconPosition="end"
            />
          ))}
        </Tabs>
      </Box>
      <TableRowSelection selected={Object.keys(selectedRowIds).length} />
      <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 3 }}>
        <Stack direction={matchDownSM ? 'column' : 'row'} spacing={2}>
          <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} />
        </Stack>
        <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={matchDownSM ? 1 : 2}>
          <>
            {headerGroups.map((group: HeaderGroup<{}>) => (
              <Stack direction={matchDownSM ? 'column' : 'row'} spacing={2} {...group.getHeaderGroupProps()}>
                {group.headers.map(
                  (column: HeaderGroup<{}>) =>
                    column.canFilter && <Box {...column.getHeaderProps([{ className: column.className }])}>{column.render('Filter')}</Box>
                )}
              </Stack>
            ))}
          </>
          {/* <CSVExport data={data} filename={'invoice-list.csv'} /> */}
        </Stack>
      </Stack>
      <Box ref={componentRef}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column: HeaderGroup<{}>) => (
                  <TableCell {...column.getHeaderProps([{ className: column.className }])}>
                    <HeaderSort column={column} sort />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row: Row, i: number) => {
              prepareRow(row);
              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => {
                      row.toggleRowSelected();
                    }}
                    sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                  >
                    {row.cells.map((cell: Cell) => (
                      <TableCell {...cell.getCellProps([{ className: cell.column.className }])}>{cell.render('Cell')}</TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                <TablePagination gotoPage={gotoPage} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </>
  );
}

// ==============================|| INVOICE - LIST ||============================== //

const List = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { lists, alertPopup } = useSelector((state) => state.invoice);

  useEffect(() => {
    dispatch(getInvoiceList()).then(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [list, setList] = useState<InvoiceList[]>([]);
  const [invoiceId, setInvoiceId] = useState(0);
  const [getInvoiceId, setGetInvoiceId] = useState(0);

  useEffect(() => {
    setList(lists);
  }, [lists]);

  const navigation = useNavigate();
  const handleClose = (status: boolean) => {
    if (status) {
      dispatch(getInvoiceDelete(invoiceId));
      dispatch(
        openSnackbar({
          open: true,
          message: 'Column deleted successfully',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
    }
    dispatch(
      alertPopupToggle({
        alertToggle: false
      })
    );
  };

  const columns = useMemo(
    () => [
      {
        title: 'Row Selection',
        Header: ({ getToggleAllPageRowsSelectedProps }: HeaderProps<{}>) => (
          <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />
        ),
        accessor: 'selection',
        Cell: ({ row }: any) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
        disableSortBy: true,
        disableFilters: true
      },
      {
        Header: 'Invoice Id',
        accessor: 'id',
        className: 'cell-center',
        disableFilters: true
      },
      {
        Header: 'User Name',
        accessor: 'customer_name',
        disableFilters: true,
        Cell: ({ row }: { row: Row }) => {
          const { values } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              {/* <Avatar alt="Avatar" size="sm" src={avatarImage(`./avatar-${!values.avatar ? 1 : values.avatar}.png`)} /> */}
              <Stack spacing={0}>
                <Typography variant="subtitle1">{values.customer_name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {values.email}
                </Typography>
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: 'Avatar',
        accessor: 'avatar',
        disableSortBy: true,
        disableFilters: true
      },
      {
        Header: 'Email',
        accessor: 'email',
        disableFilters: true
      },
      {
        Header: 'Create Date',
        accessor: 'date'
      },
      {
        Header: 'Due Date',
        accessor: 'due_date'
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
        disableFilters: true
      },
      {
        Header: 'Status',
        accessor: 'status',
        disableFilters: true,
        filter: 'includes',
        Cell: ({ value }: { value: string }) => {
          switch (value) {
            case 'Cancelled':
              return <Chip color="error" label="Cancelled" size="small" variant="light" />;
            case 'Paid':
              return <Chip color="success" label="Paid" size="small" variant="light" />;
            case 'Unpaid':
            default:
              return <Chip color="info" label="Unpaid" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Actions',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }: { row: Row<{}> }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="View">
                <IconButton
                  color="secondary"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    navigation(`/apps/invoice/details/${row.values.id}`);
                  }}
                >
                  <Eye />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    navigation(`/apps/invoice/edit/${row.values.id}`);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    setInvoiceId(row.values.id);
                    setGetInvoiceId(row.values.invoice_id); // row.original
                    dispatch(
                      alertPopupToggle({
                        alertToggle: true
                      })
                    );
                  }}
                >
                  <Trash />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (loading) return <Loader />;

  async function handleDeleteOrder() {}

  return (
    <>
      <MainCard content={false}>
        <ScrollX>
          <ReactTable columns={columns} data={list} />
        </ScrollX>
      </MainCard>
      <AlertCustomerDelete
        alertDelete="alert-delete-order"
        nameRecord={`${getInvoiceId}`}
        handleDelete={handleDeleteOrder}
        open={alertPopup}
        handleClose={handleClose}
      />
    </>
  );
};

export default List;
