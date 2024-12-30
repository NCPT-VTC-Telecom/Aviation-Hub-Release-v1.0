import { ChangeEvent, SyntheticEvent, FC } from 'react';

// material-ui
import { TableCellProps } from '@mui/material';
import { Column } from 'react-table';
// types
import { KeyedObject } from './root';

// ==============================|| TYPES - TABLES  ||============================== //

export type ArrangementOrder = 'asc' | 'desc' | undefined;

export type GetComparator = (o: ArrangementOrder, o1: string) => (a: KeyedObject, b: KeyedObject) => number;

export interface EnhancedTableHeadProps extends TableCellProps {
  onSelectAllClick: (e: ChangeEvent<HTMLInputElement>) => void;
  order: ArrangementOrder;
  orderBy?: string;
  numSelected: number;
  rowCount: number;
  onRequestSort: (e: SyntheticEvent, p: string) => void;
}

export interface EnhancedTableToolbarProps {
  numSelected: number;
}

export type HeadCell = {
  id: string;
  numeric: boolean;
  label: string;
  disablePadding?: string | boolean | undefined;
  align?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
};

export interface GeneralizedTableProps {
  columns: Column[];
  data: any[];
  searchFilter?: any;
  handleAdd?: () => void;
  isLoading?: boolean;
  renderRowSubComponent?: FC<any>;
  onRowClick?: any;
  csvFilename?: string;
  addButtonLabel?: any;
  sortColumns?: string;
  isDecrease?: boolean;
  size?: number;
  isReload?: boolean;
  totalPages?: any;
  onPageChange?: any;
  onRowExpandedChange?: any;
  hiddenPagination?: boolean;
  className?: string;
  spacing?: number;
  getDataExcel?: (data: any) => void;
  dataHandlerExcel?: any;
  handleExportExcel?: () => void;
  handleExportFormat?: () => void;
}

export interface ColumnActionsProps {
  row: any;
  handleAdd: () => void;
  handleClose: () => void;
  setCustomer: (customer: any) => void;
  setCustomerDelete: (customer: any) => void;
}
