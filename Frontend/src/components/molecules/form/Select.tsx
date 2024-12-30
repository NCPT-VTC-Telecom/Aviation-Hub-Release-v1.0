import {
  FormControl,
  Grid,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  Typography
} from '@mui/material';
import { AttributesPropsSelectField } from 'types';

const SelectInputField = ({
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
  required,
  readOnly
}: AttributesPropsSelectField) => {
  const { errors, touched, getFieldProps, setFieldValue } = formik;
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
            id="column-hiding"
            displayEmpty
            disabled={readOnly}
            {...getFieldProps(field)}
            onChange={(event: SelectChangeEvent<string>) => setFieldValue(field, event.target.value as string)}
            input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
            renderValue={(selected: string) => {
              // Find the label associated with the selected value
              const selectedItem = arrayOption.find((option) => option.value === selected);
              return selectedItem ? (
                <Typography variant="subtitle2" className="text-[14px]">
                  {selectedItem.label}
                </Typography>
              ) : (
                <Typography variant="subtitle2" className="text-[14px]">
                  {placeholder}
                </Typography>
              );
            }}
          >
            <MenuItem key={0} value={typeOfValue === 'string' ? '' : 0} disabled>
              {placeholder}
            </MenuItem>
            {arrayOption.map((option: any, index: number) => (
              <MenuItem key={index + 1} value={option.value}>
                <ListItemText
                  primary={
                    <div className="flex justify-between mb-2">
                      <span>{option.label}</span>
                      {option.subPrimaryLabel && <span>{option.subPrimaryLabel}</span>}
                    </div>
                  }
                  secondary={option.secondaryLabel || null}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {touched[field] && errors[field] && (
          <FormHelperText className="!mt-[2px]" error id="standard-weight-helper-text-email-login" sx={{ pl: 1, marginTop: 0 }}>
            {errors[field]}
          </FormHelperText>
        )}
      </Stack>
    </Grid>
  );
};

export default SelectInputField;
