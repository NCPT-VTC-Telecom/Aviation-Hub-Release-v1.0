import { memo } from 'react';
import { getIn } from 'formik';
import { AttributesPropsInputField } from 'types';
import { Grid, InputLabel, Stack, TextField, InputAdornment } from '@mui/material';

const InputField = memo(
  ({
    name,
    field,
    placeholder,
    type,
    formik,
    row,
    xs,
    md,
    readOnly,
    spacing,
    disable,
    inputLabel,
    required,
    unit
  }: AttributesPropsInputField) => {
    const {
      errors,
      touched,
      getFieldProps
      // , setFieldValue
    } = formik;

    const error = getIn(errors, field);
    const touch = getIn(touched, field);

    // const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    //   if (type === 'number') {
    //     event.preventDefault();
    //   }
    // };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (type === 'number' && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
        event.preventDefault();
      }
    };

    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   if (type === 'number') {
    //     const value = parseInt(event.target.value, 10);
    //     if (value < 0) {
    //       setFieldValue(field, 0);
    //     } else {
    //       setFieldValue(field, value);
    //     }
    //   } else {
    //     setFieldValue(field, event.target.value);
    //   }
    // };

    const numberInputProps =
      type === 'number'
        ? {
            onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                event.preventDefault();
              }
            },
            onWheel: (e: React.WheelEvent<HTMLInputElement>) => {
              e.target instanceof HTMLElement && e.target.blur(); // Remove focus on wheel
              e.preventDefault(); // Prevent the scroll from changing the number
            },
            // Disable mousewheel when input is focused
            onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
              e.target.addEventListener('mousewheel', (e) => e.preventDefault(), { passive: false });
            },
            // Remove the mousewheel event listener when input loses focus
            onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
              e.target.removeEventListener('mousewheel', (e) => e.preventDefault());
            },
            // Prevent step up/down on arrow keys
            step: 'any'
          }
        : {};

    return (
      <Grid item xs={xs || 12} md={md || 12}>
        <Stack spacing={spacing || 1.25}>
          <InputLabel htmlFor={name}>
            {inputLabel} {required ? <span className="text-red-500 text-[16px]"> *</span> : ''}
          </InputLabel>
          <TextField
            sx={{
              lineHeight: '24px'
            }}
            fullWidth
            id={name}
            type={type || 'text'}
            placeholder={placeholder}
            multiline={row && row >= 2 ? true : false}
            rows={row || 1}
            {...getFieldProps(field)}
            error={Boolean(touch && error)}
            helperText={touch && error ? error : ''}
            // onChange={handleChange}
            onKeyDown={handleKeyDown}
            InputProps={{
              readOnly: readOnly ? true : false,
              endAdornment: unit ? <InputAdornment position="end">{unit}</InputAdornment> : null,
              inputMode: type === 'number' ? 'numeric' : undefined,
              ...numberInputProps
            }}
            disabled={disable ? true : false}
          />
        </Stack>
      </Grid>
    );
  }
);

export default InputField;
