import React, { useState } from 'react';
import {
  Button,
  Grid,
  TextField
  // , Typography
} from '@mui/material';
import { DatePicker } from 'antd';
import useConfig from 'hooks/useConfig';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const FilterBar: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ start_date: null, end_date: null });
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const { i18n } = useConfig();
  const intl = useIntl();

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    if (!dates) {
      setFilters((prev) => ({
        ...prev,
        start_date: null,
        end_date: null
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        start_date: dates[0] ? dates[0].format('YYYY/MM/DD') : null,
        end_date: dates[1] ? dates[1].format('YYYY/MM/DD') : null
      }));
    }
  };

  const handleApplyFilters = () => {
    console.log('Applying filters with dates:', filters);
  };

  const handleResetFilters = () => {
    setFilters([null, null]);
    console.log('Filters reset');
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={6} md={4}>
        <RangePicker
          format={i18n === 'vi' ? 'DD/MM/YYYY' : 'MM/DD/YYYY'}
          className="col-span-4 max-xl:col-span-6 max-md:col-span-12"
          onChange={handleDateChange}
          value={[filters.start_date ? dayjs(filters.start_date) : null, filters.end_date ? dayjs(filters.end_date) : null]}
          placeholder={[intl.formatMessage({ id: 'departure_start' }), intl.formatMessage({ id: 'departure_end' })]}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #1D2630',
            height: 'auto', // Adjust height to prevent stretching
            minHeight: '40px', // Set a minimum height for consistency
            maxWidth: '320px' // Ensure it doesn't take up too much space
          }}
        />{' '}
      </Grid>
      <Grid item>
        <Button variant="outlined" onClick={() => setShowMoreFilters(!showMoreFilters)}>
          {showMoreFilters ? 'Hide Filters' : 'Show More Filters'}
        </Button>
      </Grid>
      <Grid item>
        <Button variant="outlined" onClick={handleResetFilters}>
          Reset
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={handleApplyFilters}>
          Apply
        </Button>
      </Grid>
      {showMoreFilters && (
        <Grid container item xs={12} spacing={2} style={{ marginTop: '10px' }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField fullWidth label="Search Record" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField fullWidth label="Additional Filter" variant="outlined" />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default FilterBar;
