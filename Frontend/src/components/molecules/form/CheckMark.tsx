import {
  FormControl,
  Grid,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Checkbox
} from '@mui/material';
import { AttributesPropsSelectField } from 'types';
import { useState } from 'react';

const CheckMark = ({
  name,
  field,
  placeholder,
  formik,
  arrayOption,
  xs,
  md,
  sm,
  spacing,
  inputLabel,
  required
}: AttributesPropsSelectField) => {
  const { errors, touched, getFieldProps, setFieldValue } = formik;
  const [selected, setSelected] = useState<number[]>([]);

  const typeOfValue = typeof arrayOption[0]?.value;

  const error = errors[field];
  const touchedField = touched[field];

  return (
    <Grid item xs={xs || 12} sm={sm} md={md || 12}>
      <Stack spacing={spacing || 1.25}>
        <InputLabel htmlFor={name}>
          {inputLabel} {required ? <span className="text-red-500 text-[16px]"> *</span> : ''}
        </InputLabel>
        <FormControl fullWidth error={Boolean(touchedField && error)}>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={selected}
            fullWidth
            {...getFieldProps(field)}
            onChange={(event: SelectChangeEvent<any>) => {
              const value = event.target.value as number[];
              setSelected(value);
              setFieldValue(field, value);
            }}
            renderValue={(selected: number[]) =>
              selected
                .map((val: any) => arrayOption.find((opt) => opt.value === val)?.label)
                .filter(Boolean)
                .join(', ')
            }
          >
            <MenuItem key={0} value={typeOfValue === 'string' ? '' : 0} disabled>
              {placeholder}
            </MenuItem>
            {arrayOption.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={selected.includes(option.value as number)} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {touched[field] && errors[field] && (
          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
            {errors[field]}
          </FormHelperText>
        )}
      </Stack>
    </Grid>
  );
};

export default CheckMark;
