import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

//project-import
import { Chip, Grid, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { DatePicker } from 'antd';

//utils & third-party
import dayjs from 'dayjs';
import { getInitialDate } from 'utils/handleData';
import useConfig from 'hooks/useConfig';

interface ListStatus {
  label: string;
  value: number | null;
}

interface Props {
  getFilterValue: (value: any) => void;
}

const { RangePicker } = DatePicker;

function FilterMail({ getFilterValue }: Props) {
  const intl = useIntl();
  const listStatus: ListStatus[] = [
    {
      label: intl.formatMessage({ id: 'all' }),
      value: null
    },
    {
      label: intl.formatMessage({ id: 'new-request' }),
      value: 33
    },
    {
      label: intl.formatMessage({ id: 'resolved' }),
      value: 34
    },
    {
      label: intl.formatMessage({ id: 'pending' }),
      value: 31
    },
    {
      label: intl.formatMessage({ id: 'unable-resolve' }),
      value: 35
    }
  ];

  // Initialize state to track the selected chip, if any
  const [selectedChip, setSelectedChip] = useState<number | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({ start_date: null, end_date: null });
  const { i18n } = useConfig();

  // Function to handle chip click
  const handleChipClick = (statusId: number | null) => {
    if (selectedChip === statusId) {
      // Clicked the already selected chip, so deselect it
      setSelectedChip(null);
    } else {
      // Select the new chip
      setSelectedChip(statusId);
    }
  };

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setFilters((prev) => ({
      ...prev,
      start_date: dayjs(dateStrings[0], ['DD/MM/YYYY', 'MM/DD/YYYY']).format('YYYY/MM/DD'),
      end_date: dayjs(dateStrings[1], ['DD/MM/YYYY', 'MM/DD/YYYY']).format('YYYY/MM/DD')
    }));
  };

  useEffect(() => {
    getInitialDate(setFilters, filters);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    getFilterValue({ ...filters, statusID: selectedChip });
    //eslint-disable-next-line
  }, [filters, selectedChip]);

  return (
    <MainCard>
      <Grid container spacing={0.5} justifyContent={'space-between'} alignItems={'center'}>
        <Grid item xs={12} md={7}>
          <Box className="flex items-center gap-4">
            {listStatus.map((type) => (
              <Chip
                key={type.value}
                className="hover:cursor-pointer select-none"
                color={
                  type.value === null
                    ? 'primary'
                    : type.value === 33
                    ? 'info'
                    : type.value === 34
                    ? 'success'
                    : type.value === 31
                    ? 'warning'
                    : 'error'
                }
                size="medium"
                variant={selectedChip === type.value ? 'filled' : 'outlined'}
                onClick={() => handleChipClick(type.value)}
                sx={{ minWidth: '80px' }}
                label={type.label}
              />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <RangePicker
            format={i18n === 'vi' ? 'DD/MM/YYYY' : 'MM/DD/YYYY'}
            value={[
              filters.start_date ? dayjs(filters.start_date, 'YYYY/MM/DD') : null,
              filters.end_date ? dayjs(filters.end_date, 'YYYY/MM/DD') : null
            ]}
            onChange={handleDateChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #1D2630'
            }}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default FilterMail;
