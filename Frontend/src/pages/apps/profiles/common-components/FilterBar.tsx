import { Grid, TextField, Autocomplete } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

//types
import { OptionList } from 'types/general';

interface FilterItems {
  name: string;
  optionList: OptionList[];
}

interface Props {
  totalRecord: number;
  getFilterValues: (value: any) => void;
  filterItems?: FilterItems[];
}

function FilterBar({ totalRecord, getFilterValues, filterItems }: Props) {
  const intl = useIntl();

  const handleFilterChange = (field: string, value: string | number) => {
    getFilterValues((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <Grid item xs={12}>
      <Grid container spacing={3} justifyContent={filterItems ? 'flex-end' : 'left'} alignItems="end">
        <Grid item xs={12} sm={6} lg={6}>
          <FormattedMessage id="total-record" />: {totalRecord || 0}
        </Grid>
        {filterItems && (
          <Grid item xs={12} sm={6} lg={6}>
            <Grid container spacing={3} justifyContent={'flex-end'}>
              {filterItems.map((item: any) => (
                <Grid item xs={12} sm={6} md={4} key={item.name}>
                  <Autocomplete
                    key={item.name}
                    options={item.optionList}
                    getOptionLabel={(option: any) => option.label}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        label={intl.formatMessage({ id: item.name || ' ' })}
                        variant="outlined"
                        sx={{ border: 'none' }}
                        InputProps={{
                          ...params.InputProps
                        }}
                      />
                    )}
                    onChange={(event, newValue: any) => {
                      if (newValue) {
                        handleFilterChange(item.name, newValue.value);
                      } else {
                        handleFilterChange(item.name, '');
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default FilterBar;
