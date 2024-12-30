import { Grid, Typography, Stack } from '@mui/material';
import { AttributesPropsChipView } from 'types';
import ChipStatus from 'components/atoms/ChipStatus';

function StatusView({ name, id, successLabel, errorLabel, warningLabel }: AttributesPropsChipView) {
  return (
    <Grid item xs={12} md={6}>
      <Stack spacing={0.5}>
        <Typography color="secondary">{name}</Typography>
        <div>
          <ChipStatus id={id} successLabel={successLabel} errorLabel={errorLabel} warningLabel={warningLabel} />
        </div>
      </Stack>
    </Grid>
  );
}

export default StatusView;
