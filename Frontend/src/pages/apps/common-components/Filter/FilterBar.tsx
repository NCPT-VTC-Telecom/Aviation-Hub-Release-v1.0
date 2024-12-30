import React, { useState, MouseEvent } from 'react';
import { FormattedMessage } from 'react-intl';
//mui
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
//third-party
import { format } from 'date-fns';

interface ChildProps {
  sendFilter: (value: any) => void;
}

interface FilterItem {
  id: string;
  optionList: string[];
}

interface ValueFilter {
  [key: string]: string;
}

interface filterList {
  id: string;
  haveDatePicker: boolean;
  filterItem: FilterItem[];
}

const Filter: React.FC<
  ChildProps & {
    filterList: filterList;
    sendFilter?: any;
  }
> = ({ sendFilter, filterList }) => {
  const [valueFilter, setValueFilter] = useState<ValueFilter>({});
  const [slot, setSlot] = useState('day');
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [datePickerValues, setDatePickerValues] = useState<{ [key: string]: Date | null }>({});
  const handleChange = (event: MouseEvent<HTMLElement>, newAlignment: string) => {
    if (newAlignment) setSlot(newAlignment);
  };

  function getValueFilters(event: any) {
    const key = event.target.name;
    const value = event.target.value;
    setValueFilter((values) => ({ ...values, [key]: value }));
    setSelectedOptions((options) => ({ ...options, [key]: value }));
  }

  function handleDatePickerChange(date: Date | null, id: string) {
    setDatePickerValues((prevValues) => ({ ...prevValues, [id]: date }));
  }

  const collectFilterValues = () => {
    // Format dates right before sending
    const formattedDates = Object.keys(datePickerValues).reduce((acc, key) => {
      const date = datePickerValues[key];
      acc[key] = date ? format(date, 'yyyy/MM/dd') : null;
      return acc;
    }, {} as { [key: string]: string | null });

    return {
      ...valueFilter,
      ...formattedDates,
      slot
    };
  };

  function sendFilterValue(event: any) {
    event.preventDefault();
    const allFilterValues = collectFilterValues();
    sendFilter(allFilterValues);
  }

  function resetFilters(event: any) {
    event.preventDefault();
    const resetSelectedOptions: { [key: string]: string } = {};
    filterList.filterItem.forEach((item) => {
      resetSelectedOptions[item.id] = 'all';
    });
    setSlot('day');
    setSelectedOptions(resetSelectedOptions);
    setDatePickerValues({});
    setValueFilter({});
    sendFilter({});
  }

  return (
    <header className="bg-white rounded-lg">
      <form className="grid grid-cols-6 max-lg:grid-cols-4 max-md:grid-cols-2 items-end gap-4">
        {filterList.haveDatePicker && (
          <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <div className="block w-full">
                <label className="block font-medium mb-2">
                  <FormattedMessage id="date-start" />
                </label>
                <DatePicker
                  className="!w-full"
                  format="yyyy/MM/dd"
                  disableFuture
                  value={datePickerValues['start_date']}
                  onChange={(date) => handleDatePickerChange(date, 'start_date')}
                />
              </div>
              <div className="block w-full">
                <label className="block font-medium mb-2">
                  <FormattedMessage id="date_end" />
                </label>
                <DatePicker
                  className="!w-full"
                  format="yyyy/MM/dd"
                  value={datePickerValues['end_date']}
                  onChange={(date) => handleDatePickerChange(date, 'end_date')}
                />
              </div>
            </LocalizationProvider>
          </>
        )}

        {filterList.filterItem.map((itemFilter: FilterItem, index: number) => (
          <div key={index}>
            <label className="block font-medium mb-2" htmlFor={itemFilter.id}>
              <FormattedMessage id={itemFilter.id} />
            </label>
            <Select
              className="bg-white w-full !text-base"
              onChange={getValueFilters}
              name={itemFilter.id}
              value={selectedOptions[itemFilter.id] || 'all'}
              sx={{
                '.css-1mgeynb-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input': {
                  padding: '12px'
                }
              }}
            >
              <MenuItem className="!text-base" value="all">
                <FormattedMessage id="all" />
              </MenuItem>
              {itemFilter.optionList.map((item: string, index: number) => (
                <MenuItem className="!text-base" key={index} value={item}>
                  <FormattedMessage id={item} />
                </MenuItem>
              ))}
            </Select>
          </div>
        ))}

        <div className={`col-span-2 !w-full ${filterList.haveDatePicker ? 'block' : 'hidden'}`}>
          <label className="block font-medium mb-2">
            <FormattedMessage id="time-period-aggregation" />
          </label>
          <ToggleButtonGroup className="!w-full" exclusive onChange={handleChange} value={slot}>
            <ToggleButton className="w-full h-[49px]" disabled={slot === 'day'} value="day">
              <FormattedMessage id="day" />
            </ToggleButton>
            <ToggleButton className="w-full h-[49px]" disabled={slot === 'week'} value="week">
              <FormattedMessage id="week" />
            </ToggleButton>
            <ToggleButton className="w-full h-[49px]" disabled={slot === 'month'} value="month">
              <FormattedMessage id="month" />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div className="col-span-2 flex gap-6">
          <button
            className="p-3 mx-auto !w-1/2 rounded-[4px] bg-gray-200 bg-opacity-90 border-b-4 border-solid border-blue-800 hover:opacity-95 hover:shadow-xl font-medium"
            onClick={sendFilterValue}
          >
            <FormattedMessage id="apply" />
          </button>
          <button
            className=" bg-blue-800 mx-auto !w-1/2 p-[10px] rounded-[4px] text-white hover:opacity-95 hover:shadow-xl font-medium"
            type="reset"
            onClick={resetFilters}
          >
            <FormattedMessage id="clear" />
          </button>
        </div>
      </form>
    </header>
  );
};

export default Filter;
