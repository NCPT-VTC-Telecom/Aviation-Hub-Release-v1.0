import { useEffect, useState, useMemo } from 'react';
import useConfig from 'hooks/useConfig';

// material-ui
import { Dialog } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { PopupTransition } from 'components/@extended/Transitions';
// import DeviceView from './DeviceView';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import ViewDialog from 'components/template/ViewDialog';

//config
import { columnsDevicesMonitoring } from 'components/ul-config/table-config/devices';
import { deviceViewConfig } from 'components/ul-config/view-dialog-config';

// model & utils
import { getAllDevices } from './model';
import { formatDate, useLangUpdate } from 'utils/handleData';

// types
import { DeviceData } from 'types/device';
import { useNavigate } from 'react-router';

const ListDevicePage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitial, setIsInitial] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);

  const [record, setRecord] = useState<DeviceData | null>(null);
  const [data, setData] = useState<DeviceData[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  const getDataDevices = async (pageSize: number, pageIndex: number, searchValue?: string) => {
    try {
      const res = await getAllDevices(pageIndex, pageSize, searchValue);
      if (res.code === 0) {
        setTotalPages(res.totalPages);
        setData(formatDate(res.data, ['activation_date', 'deactivation_date', 'manufacturer_date']));
      } else {
        setTotalPages(0);
        setData([]);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isInitial) {
      getDataDevices(pageSize, pageIndex, searchValue);
      setIsInitial(false);
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isReload) {
      getDataDevices(pageSize, pageIndex, searchValue);
      setIsReload(false);
      setSearchValue('');
    }
    //eslint-disable-next-line
  }, [isReload]);

  useEffect(() => {
    if (!isInitial) {
      getDataDevices(pageSize, pageIndex, searchValue);
    }
    //eslint-disable-next-line
  }, [pageIndex, searchValue, pageSize, i18n]);

  const handlePageChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex + 1);
    setPageSize(newPageSize);
  };

  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const onViewClick = (row: DeviceData) => {
    navigate(`/device/profile/${row.id_device}`);
  };

  const handleRowClick = (row: DeviceData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const columns = useMemo(() => {
    return columnsDevicesMonitoring(pageIndex, pageSize, handleAdd, handleClose, setRecord, onViewClick);
    //eslint-disable-next-line
  }, [setRecord, pageIndex, pageSize]);

  return (
    <MainCard content={false}>
      <ScrollX>
        <GeneralizedTable
          isReload={isReload}
          columns={columns}
          data={data}
          handleAdd={handleAdd}
          onPageChange={handlePageChange}
          totalPages={totalPages}
          onRowClick={handleRowClick}
          searchFilter={setSearchValue}
          sortColumns="index"
          isDecrease={false}
          isLoading={isLoading}
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
        <ViewDialog title="device-info" config={deviceViewConfig} open={openDialog} onClose={handleCloseView} data={record} />
      </Dialog>
    </MainCard>
  );
};

export default ListDevicePage;
