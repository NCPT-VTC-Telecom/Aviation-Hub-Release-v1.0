// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

// project-imports
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';
import { FormattedMessage } from 'react-intl';
// assets
import { Trash } from 'iconsax-react';

// types
interface Props {
  alertDelete: string;
  nameRecord: string;
  labelDeleteButton?: string;
  descDelete?: string;
  open: boolean;
  handleClose: (status: boolean) => void;
  handleDelete: (status: boolean) => void;
}

// ==============================|| CUSTOMER - DELETE ||============================== //

export default function AlertCustomerDelete({
  alertDelete,
  open,
  handleClose,
  handleDelete,
  nameRecord,
  labelDeleteButton,
  descDelete
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <Trash variant="Bold" />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              <FormattedMessage id={alertDelete} />
            </Typography>
            <Typography align="center">
              {descDelete ? descDelete : <FormattedMessage id="alert-delete" />} <strong className="font-bold">"{nameRecord}"</strong> ?
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={() => handleClose(false)} color="secondary" variant="outlined">
              <FormattedMessage id="cancel" />
            </Button>
            <Button
              fullWidth
              color="error"
              variant="contained"
              onClick={() => {
                handleClose(true);
                handleDelete(true);
              }}
            >
              {labelDeleteButton ? labelDeleteButton : <FormattedMessage id="delete" />}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
