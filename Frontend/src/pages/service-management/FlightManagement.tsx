import { useEffect, useState, useMemo } from 'react';
import useConfig from 'hooks/useConfig';
import { useNavigate } from 'react-router';

//project component
import { PopupTransition } from 'components/@extended/Transitions';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import ViewDialog from 'components/template/ViewDialog';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { Dialog } from '@mui/material';

//config
import { ColumnsHistoryFlight } from 'components/ul-config/table-config/flight-info';
import { flightViewConfig } from 'components/ul-config/view-dialog-config';

//types
import { FlightData } from 'types/aviation';

//model & utils
import { useLangUpdate } from 'utils/handleData';
import useHandleFlight from 'hooks/useHandleFlight';

const FlightManagement = () => {
  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [record, setRecord] = useState<FlightData | null>(null);
  const [data, setData] = useState<FlightData[] | object[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const { i18n } = useConfig();
  const { isLoading, totalPages, getDataFlight } = useHandleFlight();
  useLangUpdate(i18n);

  const getData = async (pageIndex: number, pageSize: number, searchValue?: string) => {
    const dataFlight = await getDataFlight({ page: pageIndex, pageSize, filters: searchValue });
    setData(dataFlight);
  };

  const handlePageChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex + 1);
    setPageSize(newPageSize);
  };

  useEffect(() => {
    getData(pageIndex, pageSize, searchValue);
    //eslint-disable-next-line
  }, [i18n, pageIndex, pageSize, searchValue]);

  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const onViewClick = (row: FlightData) => {
    navigate(`/flight/profile/${row.aircraft.flight_number}`);
  };

  const handleRowClick = (row: FlightData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const columns = useMemo(() => {
    return ColumnsHistoryFlight(pageIndex, pageSize, handleAdd, handleClose, onViewClick);
    //eslint-disable-next-line
  }, [setRecord, pageIndex, pageSize]);

  return (
    <MainCard content={false}>
      <ScrollX>
        <GeneralizedTable
          isLoading={isLoading}
          columns={columns}
          data={data}
          handleAdd={handleAdd}
          onPageChange={handlePageChange}
          searchFilter={setSearchValue}
          totalPages={totalPages}
          sortColumns="index"
          onRowClick={handleRowClick}
        />
      </ScrollX>
      <Dialog
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        fullWidth
        onClose={handleAdd}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      >
        <ViewDialog title="flight-info" config={flightViewConfig} open={openDialog} onClose={handleCloseView} data={record} />
      </Dialog>
    </MainCard>
  );
};

export default FlightManagement;
