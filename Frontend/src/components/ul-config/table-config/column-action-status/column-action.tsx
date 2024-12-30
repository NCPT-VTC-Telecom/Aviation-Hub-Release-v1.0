import { MouseEvent, FC } from 'react';
import { Stack, Tooltip, IconButton, useTheme } from '@mui/material';
import { Add, Edit, Trash, Eye } from 'iconsax-react';
import { ThemeMode } from 'types/config';
import { FormattedMessage } from 'react-intl';

interface ColumnActionsProps {
  row: any;
  handleAdd: () => void;
  handleClose: () => void;
  setRecord?: (record: any) => void;
  setRecordDelete?: (record: any) => void;

  isHiddenView?: boolean;
  setViewRecord?: any;

  isHiddenEdit?: boolean;
  titleEdit?: string;

  isHiddenDelete?: boolean;
  newDeleteIcon?: any;
  isDeletable?: boolean;
  titleDelete?: string;
}

const ColumnActions: FC<ColumnActionsProps> = ({
  row,
  handleAdd,
  handleClose,
  setRecord,
  setRecordDelete,

  isHiddenView,
  setViewRecord,

  isHiddenEdit,
  titleEdit,

  isHiddenDelete,
  isDeletable,
  newDeleteIcon,
  titleDelete
}) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const collapseIcon = row.isExpanded ? <Add style={{ color: theme.palette.error.main, transform: 'rotate(45deg)' }} /> : <Eye />;

  return (
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
      {!isHiddenView && (
        <Tooltip
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                opacity: 0.9
              }
            }
          }}
          title={<FormattedMessage id="view-details" />}
        >
          <span>
            <IconButton
              color="secondary"
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                if (row.values && setViewRecord) {
                  setViewRecord(row.original);
                }
                row.toggleRowExpanded();
              }}
            >
              {collapseIcon}
            </IconButton>
          </span>
        </Tooltip>
      )}
      {!isHiddenEdit && setRecord && (
        <Tooltip
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                opacity: 0.9
              }
            }
          }}
          title={titleEdit ? <FormattedMessage id={titleEdit} /> : <FormattedMessage id="edit" />}
        >
          <span>
            <IconButton
              color="primary"
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setRecord(row.original);
                handleAdd();
              }}
            >
              <Edit />
            </IconButton>
          </span>
        </Tooltip>
      )}
      {!isHiddenDelete && setRecordDelete && (
        <Tooltip
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                opacity: 0.9
              }
            }
          }}
          title={titleDelete ? <FormattedMessage id={titleDelete} /> : <FormattedMessage id="delete" />}
        >
          <span>
            <IconButton
              color="error"
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                handleClose();
                setRecordDelete(row.original);
              }}
              disabled={isDeletable}
            >
              {newDeleteIcon ? newDeleteIcon : <Trash />}
            </IconButton>
          </span>
        </Tooltip>
      )}
    </Stack>
  );
};

export default ColumnActions;
