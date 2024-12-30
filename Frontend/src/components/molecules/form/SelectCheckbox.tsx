import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Checkbox, FormControlLabel, Grid, Stack, InputLabel, FormHelperText, Select, MenuItem } from '@mui/material';

// types
import { AttributesPropsCheckbox } from 'types/input-field';

interface SelectCheckBoxProps extends AttributesPropsCheckbox {
  arrayOption: any[];
  handleChange?: any;
}

const SelectCheckBoxField: React.FC<SelectCheckBoxProps> = ({
  name,
  field,
  formik,
  arrayOption,
  xs,
  md,
  inputLabel,
  required,
  handleBlur,
  handleChange
}) => {
  const { errors, touched, setFieldValue, values } = formik;
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>(values[field] || []);
  const typeOfValue = typeof arrayOption[0]?.value;

  useEffect(() => {
    setFieldValue(field, selectedValues);
  }, [selectedValues, setFieldValue, field]);

  const toggleSelectItem = (value: string | number) => {
    setSelectedValues((prev) => {
      const newValue = prev.includes(value) ? prev.filter((item: string | number) => item !== value) : [...prev, value];
      return newValue;
    });
  };

  return (
    <Grid item xs={xs || 12} md={md || 12}>
      <Stack spacing={1.25}>
        <InputLabel htmlFor={name}>
          {inputLabel}
          {required ? <span className="text-red-500 text-[16px]"> *</span> : ''}
        </InputLabel>
        <Select
          onChange={handleChange}
          multiple
          onBlur={handleBlur}
          value={values[field] || []}
          renderValue={(selected) => {
            const labelsMap = new Map(arrayOption.map((opt) => [opt.value, opt.label]));
            return selected.map((value: string | number) => labelsMap.get(value) || value).join(', ');
          }}
          fullWidth
        >
          {arrayOption.length > 0 ? (
            arrayOption.map((option) => (
              <MenuItem key={option.value} value={option.value} onClick={() => toggleSelectItem(option.value)} dense>
                <FormControlLabel
                  control={<Checkbox checked={values[field]?.includes(option.value)} onChange={() => toggleSelectItem(option.value)} />}
                  label={option.label}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              </MenuItem>
            ))
          ) : (
            <MenuItem value={typeOfValue === 'string' ? '' : 0} disabled>
              <FormattedMessage id="no-data-available" />
            </MenuItem>
          )}
        </Select>
        {touched[field] && errors[field] && (
          <FormHelperText error id={`${name}-error-text`} sx={{ pl: 1.75 }}>
            {errors[field]}
          </FormHelperText>
        )}
      </Stack>
    </Grid>
  );
};

export default SelectCheckBoxField;
