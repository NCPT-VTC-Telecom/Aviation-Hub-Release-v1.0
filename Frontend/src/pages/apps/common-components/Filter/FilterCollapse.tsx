import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

// project-import
import { Button, TextField, Collapse, InputAdornment, Autocomplete } from '@mui/material';
import { MoreSquare, FilterSquare, Filter, Refresh2 } from 'iconsax-react';
import { DatePicker } from 'antd';

// utils & third-party
import { addDays, getInitialDate } from 'utils/handleData';
import dayjs from 'dayjs';

// types
import { OptionList, FiltersConfig } from 'types/general';
import useConfig from 'hooks/useConfig';

const { RangePicker } = DatePicker;

interface FilterComponentProps {
  filtersConfig: FiltersConfig;
  getFilterValue: any;
  onFiltersChange?: (filters: any) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ filtersConfig, getFilterValue, onFiltersChange }) => {
  const [filters, setFilters] = useState<Record<string, any>>({ start_date: null, end_date: null });
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [isMaxXL, setIsMaxXL] = useState<boolean>(false);
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

  const handleFilterChange = (field: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    getInitialDate(setFilters, filters);

    const handleResize = () => {
      setIsMaxXL(window.innerWidth <= 1280);
    };

    if (onFiltersChange) {
      onFiltersChange({
        ...filters,
        end_date: addDays(filters.end_date, 1)
      });
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="grid grid-cols-12 gap-4 items-center">
        {filtersConfig.haveDatePicker && (
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
          />
        )}
        {/* Empty spacer grid item to balance the layout, hidden on small screens */}
        <div className="col-span-2 max-xl:hidden"></div>
        <div className="grid grid-cols-12 col-span-6 gap-4 max-xl:col-span-6 max-md:col-span-12">
          <Button
            variant={isMaxXL ? 'outlined' : 'text'}
            className="col-span-4 flex items-center justify-center !w-full !h-full max-xl:!text-center"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            style={{
              minWidth: '100px', // Prevent buttons from being too wide
              padding: '8px 16px'
            }}
          >
            <MoreSquare size="24" className="max-xl:m-auto" />
            <span className="ml-2 max-xl:hidden">
              {showMoreFilters ? <FormattedMessage id="hide-filter" /> : <FormattedMessage id="show-more-filter" />}
            </span>
          </Button>
          <Button
            className="col-span-4 flex items-center justify-center !w-full !h-full max-xl:!text-center"
            variant="outlined"
            onClick={() => setFilters({})}
            style={{
              minWidth: '100px',
              padding: '8px 16px'
            }}
          >
            <Refresh2 size="24" className="max-xl:m-auto" />
            <span className="ml-2 max-xl:hidden">
              <FormattedMessage id="reset" />
            </span>
          </Button>
          <Button
            className="col-span-4 flex items-center justify-center !w-full !h-full max-xl:!text-center"
            variant="contained"
            color="primary"
            onClick={() =>
              getFilterValue({
                ...filters,
                end_date: addDays(filters.end_date, 1)
              })
            }
            style={{
              minWidth: '100px',
              padding: '8px 16px'
            }}
          >
            <Filter size="24" className="max-xl:m-auto" />
            <span className="ml-2 max-xl:hidden">
              <FormattedMessage id="apply" />
            </span>
          </Button>
        </div>
      </div>
      <Collapse in={showMoreFilters}>
        <div className="mt-5 grid grid-cols-5 gap-4 max-xl:grid-cols-3 max-md:grid-cols-1">
          {filtersConfig.filterItem.map((item: any) => (
            <Autocomplete
              sx={{ lineHeight: '24px' }}
              key={item.id}
              options={item.optionList}
              getOptionLabel={(option: any) => option.label}
              renderInput={(params) => (
                <TextField
                  sx={{ lineHeight: '24px' }}
                  {...params}
                  label={intl.formatMessage({ id: item.id || ' ' })}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <FilterSquare size="24" />
                      </InputAdornment>
                    )
                  }}
                />
              )}
              onChange={(event, newValue: OptionList | null) => {
                if (newValue) {
                  handleFilterChange(item.id, newValue.value);
                } else {
                  handleFilterChange(item.id, '');
                }
              }}
            />
          ))}
        </div>
      </Collapse>
    </>
  );
};

export default FilterComponent;
