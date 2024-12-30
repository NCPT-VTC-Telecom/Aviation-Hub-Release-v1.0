import { Grid, Stack, Typography } from '@mui/material';
import { AttributesPropsDetailRow } from 'types';

const DetailRow = ({ name, field, xs, md }: AttributesPropsDetailRow) => {
  return (
    <Grid item xs={xs || 12} md={md || 6}>
      <Stack spacing={0.5}>
        <Typography color="secondary">{name}</Typography>
        <Typography>{field}</Typography>
      </Stack>
    </Grid>
  );
};

export default DetailRow;
