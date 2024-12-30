import { Grid, InputLabel, Stack, FormControl } from '@mui/material';
import { getIn } from 'formik';
import { AttributesPropsDatePickerField } from 'types';

import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useIntl } from 'react-intl';
import useConfig from 'hooks/useConfig';
dayjs.extend(customParseFormat);

const DatePickerField = ({
  name,
  field,
  formik,
  xs,
  md,
  sm,
  onlyFuture,
  onlyPast,
  onlyYear,
  inputLabel,
  startDate,
  required
}: AttributesPropsDatePickerField) => {
  const { errors, touched, setFieldValue, values } = formik;
  const intl = useIntl();
  const { i18n } = useConfig();

  const dateFormat = onlyYear ? 'YYYY' : i18n === 'vi' ? 'DD/MM/YYYY' : 'MM/DD/YYYY';

  const error = getIn(errors, field);
  const touch = getIn(touched, field);
  const value = getIn(values, field);

  const handleChange = (dates: any) => {
    if (dates) {
      const date = dates.format('YYYY/MM/DD');
      setFieldValue(field, date);
    }
  };

  return (
    <Grid item xs={xs || 12} md={md || 12} sm={sm}>
      <Stack spacing={1.25}>
        <InputLabel htmlFor={name}>
          {inputLabel} {required ? <span className="text-red-500 text-[16px]"> *</span> : ''}
        </InputLabel>
        <FormControl fullWidth error={Boolean(touch && error)}>
          <DatePicker
            picker={onlyYear ? 'year' : 'date'}
            format={dateFormat}
            value={value ? dayjs(value, ['YYYY/MM/DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY']) : null}
            onChange={handleChange}
            getPopupContainer={(triggerNode) => {
              return triggerNode.parentNode instanceof HTMLElement ? triggerNode.parentNode : document.body; // Trả về document.body nếu parentNode không phải là HTMLElement
            }}
            placeholder={intl.formatMessage({ id: 'select-date' })}
            disabledDate={(current: Dayjs) => {
              return !!(
                (onlyFuture && current.isBefore(dayjs().startOf('day'))) ||
                (onlyPast && current.isAfter(dayjs().endOf('day'))) ||
                (startDate && values[startDate] && current.isBefore(dayjs(values[startDate], dateFormat)))
              );
            }}
            style={{
              fontFamily: 'Arial, Helvetica, sans-serif',
              width: '100%',
              height: '48px',
              color: '#1D2630',
              borderColor: '#BEC8D0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              lineHeight: '1.4375em'
            }}
          />
        </FormControl>
      </Stack>
    </Grid>
  );
};

export default DatePickerField;
