import useConfig from 'hooks/useConfig';
import { useMemo, useState } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Chip } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { FormattedMessage } from 'react-intl';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { useLangUpdate } from 'utils/handleData';

const ListInfoAirCraft = ({
  airCraftInfo,
  onSelectedAirplane,
  totalPages,
  pageSize,
  handlePageChange,
  isLoading
}: {
  airCraftInfo: any;
  onSelectedAirplane: any;
  totalPages: number;
  pageSize: number;
  handlePageChange: any;
  isLoading: boolean;
}) => {
  const theme = useTheme();
  const [customer, setCustomer] = useState<any>(null);
  const [add, setAdd] = useState<boolean>(false);

  const { i18n } = useConfig();
  useLangUpdate(i18n);

  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        className: 'hidden'
      },
      {
        Header: <FormattedMessage id="flight-number" />,
        accessor: 'aircraft.flight_number',
        disableSortBy: true
      },
      {
        Header: <FormattedMessage id="tail-number" />,
        accessor: 'aircraft.tail_number',
        disableSortBy: true
      },
      {
        Header: <FormattedMessage id="route" />,
        accessor: 'route',
        disableSortBy: true,
        className: 'cell-left'
      },
      {
        Header: <FormattedMessage id="departure-time" />,
        accessor: 'departure_time',
        disableSortBy: true
      },
      {
        Header: <FormattedMessage id="ifc-status" />,
        accessor: 'status_id',
        disableSortBy: true,
        className: 'cell-center',
        Cell: ({ value }: { value: number }) => {
          switch (value) {
            case 14:
              return <Chip color="success" label="Online" size="small" variant="light" />;
            default:
              return <Chip color="error" label="Offline" size="small" variant="light" />;
          }
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <GeneralizedTable
          isLoading={isLoading}
          columns={columns}
          data={airCraftInfo}
          handleAdd={handleAdd}
          size={pageSize}
          // renderRowSubComponent={renderRowSubComponent}
          onRowClick={onSelectedAirplane}
          onPageChange={handlePageChange}
          totalPages={totalPages}
          sortColumns="index"
        />
      </ScrollX>
    </MainCard>
  );
};

export default ListInfoAirCraft;
