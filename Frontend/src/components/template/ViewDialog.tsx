import React from 'react';
import { useIntl } from 'react-intl';
import { Button, Grid, DialogContent, Dialog, DialogTitle, DialogActions } from '@mui/material';

// import Transitions from 'components/@extended/Transitions';
import FieldView from 'components/molecules/view-modal/DetailRow';
import { getValueByPath } from 'utils/handleData';

interface FieldConfig {
  key: string;
  label: string;
  transform?: (value: any) => string | React.ReactNode | null;
  unit?: string;
  md?: number;
}

interface ViewDialogProps {
  title: string;
  open: boolean;
  onClose: () => void;
  data: any;
  config: FieldConfig[]; // Array of configurations
}

const ViewDialog: React.FC<ViewDialogProps> = ({ title, open, onClose, data, config }) => {
  const intl = useIntl();
  if (!data) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      // TransitionComponent={Transitions}
      aria-labelledby="admin-dialog-title"
      sx={{
        '& .MuiDialog-container': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          '& > .MuiPaper-root': {
            tabIndex: -1 // Ensure this is set if not already
          }
        }
      }}
    >
      <DialogTitle id="admin-dialog-title">{intl.formatMessage({ id: title, defaultMessage: 'Detailed information' })}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {config.map(({ key, label, transform, md }, index) => {
            let value = getValueByPath(data, key);

            if (value === undefined || value === null) {
              value = '';
            } else {
              value = transform ? transform(value) : value;
            }
            const formattedLabel = intl.formatMessage({ id: label });

            return typeof value === 'object' ? value : <FieldView key={index} md={md} name={formattedLabel} field={`${value}`} />;
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          {intl.formatMessage({ id: 'close' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDialog;
