import { useMemo, Fragment, useEffect, useState } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { Button, Stack, Table, TableBody, TableCell, TableHead, TableRow, useMediaQuery, Skeleton, Tooltip } from '@mui/material';
import ImportFileButton from 'components/atoms/ImportFileButton';

// third-party
import {
  useFilters,
  useExpanded,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
  usePagination,
  HeaderGroup,
  Row,
  Cell
} from 'react-table';

// project-imports
import { CSVExport, HeaderSort, TablePagination } from 'components/third-party/ReactTable';
import { renderFilterTypes, GlobalFilter } from 'utils/react-table';

// assets
import { Add } from 'iconsax-react';

//types
import { GeneralizedTableProps } from 'types/table';
import { FormattedMessage } from 'react-intl';

const GeneralizedTable = ({
  columns,
  data,
  handleAdd,
  renderRowSubComponent,
  csvFilename,
  addButtonLabel,
  sortColumns,
  isDecrease,
  size,
  isReload,
  totalPages,
  onPageChange,
  onRowExpandedChange,
  hiddenPagination,
  className,
  spacing,
  onRowClick,
  isLoading,
  searchFilter,
  getDataExcel,
  dataHandlerExcel,
  handleExportExcel,
  handleExportFormat
}: GeneralizedTableProps) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const [reload, setReload] = useState(false);
  const sortBy = { id: sortColumns || 'id', desc: isDecrease || false };
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    visibleColumns,
    page,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize, expanded },
    preGlobalFilteredRows
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: size || 10, hiddenColumns: ['avatar', 'email'], sortBy: [sortBy] }
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    if (isReload) {
      setReload(true);
    }

    if (reload) {
      setReload(false);
    }
  }, [isReload, reload]);

  useEffect(() => {
    gotoPage(pageIndex - 1);
  }, [pageIndex, gotoPage]);

  useEffect(() => {
    if (matchDownSM) {
      setHiddenColumns(['age', 'contact', 'visits', 'email', 'status', 'avatar', 'fatherName']);
    } else {
      setHiddenColumns(['avatar', 'email', 'fatherName']);
    }
    // eslint-disable-next-line
  }, [matchDownSM]);

  const handlePageChange = (newPageIndex: number) => {
    gotoPage(newPageIndex - 1);
    onPageChange?.(newPageIndex, pageSize);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    gotoPage(0);
    onPageChange?.(0, newPageSize);
  };

  const cellStyle = {
    maxWidth: '150px', // or any other suitable default width
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };

  return (
    <>
      {/* <TableRowSelection selected={Object.keys(selectedRowIds).length} /> */}
      <Stack spacing={spacing || 3}>
        {csvFilename || addButtonLabel || getDataExcel || searchFilter ? (
          <Stack
            direction={matchDownSM ? 'column' : 'row'}
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 3, pb: 0 }}
          >
            {searchFilter && <GlobalFilter searchFilter={searchFilter} preGlobalFilteredRows={preGlobalFilteredRows} />}
            <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" gap={1} spacing={2}>
              {dataHandlerExcel && getDataExcel ? (
                <ImportFileButton labelButton="import-excel" getDataExcel={getDataExcel} dataHandler={dataHandlerExcel} />
              ) : (
                ''
              )}
              {handleExportExcel && handleExportFormat && (
                <CSVExport onClickExportExcel={handleExportExcel} onClickExportFormat={handleExportFormat} />
              )}
              {addButtonLabel && (
                <Button variant="contained" startIcon={<Add />} onClick={handleAdd} size="small" className="justify-end">
                  {addButtonLabel}
                </Button>
              )}
            </Stack>
          </Stack>
        ) : (
          ''
        )}
        <Table className={className} {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup: HeaderGroup<{}>) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column: HeaderGroup) => (
                  <TableCell
                    align="center"
                    {...column.getHeaderProps([{ className: column.className }])}
                    style={{
                      ...cellStyle,
                      maxWidth: column.maxWidth || '200px',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'normal'
                    }}
                  >
                    <HeaderSort column={column} sort />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {isLoading ? (
              Array.from({ length: pageSize }, (_, index) => (
                <TableRow key={index}>
                  {columns.map((column, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton animation="wave" height={30} width="100%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : Array.isArray(data) && data.length > 0 && page.length > 0 ? (
              page.map((row: Row, i: number) => {
                prepareRow(row);
                const rowProps = row.getRowProps();
                return (
                  <Fragment key={i}>
                    <TableRow
                      {...row.getRowProps()}
                      onClick={() => {
                        row.toggleRowSelected();
                        if (onRowClick) {
                          onRowClick(row.original);
                        }
                      }}
                      sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                      className={i % 2 === 1 ? 'bg-[#f2f2f2] bg-opacity-50' : ''}
                    >
                      {row.cells ? (
                        row.cells.map((cell: Cell) => (
                          <TableCell
                            {...cell.getCellProps([{ className: cell.column.className }])}
                            style={{
                              ...cellStyle,
                              maxWidth: cell.column.maxWidth || '200px',
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              whiteSpace: 'normal'
                            }}
                          >
                            {typeof cell.value === 'string' && cell.value.length > 20 ? ( // Kiểm tra nếu là string và có độ dài lớn hơn 20
                              <Tooltip title={<div>{cell.render('Cell')}</div>} placement="top" arrow>
                                <div>{cell.render('Cell')}</div>
                              </Tooltip>
                            ) : (
                              <div>{cell.render('Cell')}</div>
                            )}
                          </TableCell>
                        ))
                      ) : (
                        <FormattedMessage id="don't-have-data" />
                      )}
                    </TableRow>
                    {row.isExpanded && renderRowSubComponent ? renderRowSubComponent({ row, rowProps, visibleColumns, expanded }) : ''}
                  </Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} style={{ textAlign: 'center' }}>
                  <FormattedMessage id="no-data-available" />
                </TableCell>
              </TableRow>
            )}
            {(!hiddenPagination || data.length >= 5) && (
              <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
                <TableCell sx={{ p: 2, py: 3 }} colSpan={12}>
                  <TablePagination
                    gotoPage={handlePageChange}
                    setPageSize={handlePageSizeChange}
                    pageSize={pageSize}
                    pageIndex={pageIndex}
                    totalPages={totalPages}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Stack>
    </>
  );
};

export default GeneralizedTable;
