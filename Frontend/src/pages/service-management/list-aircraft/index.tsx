import { useEffect, useState, useMemo } from 'react';
import useMapStatus from 'utils/mapStatus';
import useConfig from 'hooks/useConfig';

// third-party
import { enqueueSnackbar } from 'notistack';
import moment from 'moment';

// material-ui
import { Dialog } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { PopupTransition } from 'components/@extended/Transitions';
// import AircraftView from './AircraftView';
import AddAircraft from './AddAircraft';
import AlertCustomerDelete from '../../apps/users/AlertCustomerDelete';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { ColumnsAircraft } from 'components/ul-config/table-config/aircraft-info';

// model & utils
import { getAircraft, postAddAircraft, postDeleteAircraft, postEditAircraft } from './model';
import { formatDate, getTailModel, useLangUpdate, excelSerialDateToDate } from 'utils/handleData';

// types
import { AircraftData, NewAircraft } from 'types/aviation';

// redux
import { dispatch } from 'store';
import { importExcel, exportExcel, getFormatExcel } from 'store/reducers/excel';
import { openSnackbar } from 'store/reducers/snackbar';
import { useNavigate } from 'react-router';
import ViewDialog from 'components/template/ViewDialog';
import { aircraftViewConfig } from 'components/ul-config/view-dialog-config';

const ListAircraftPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);

  const [record, setRecord] = useState<AircraftData | null>(null);
  const [recordDelete, setRecordDelete] = useState<AircraftData | null>(null);
  const [dataAircraft, setDataAircraft] = useState<AircraftData[] | []>([]);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const intl = useIntl();
  const navigate = useNavigate();
  const { i18n } = useConfig();
  const { getStatusMessage } = useMapStatus();
  useLangUpdate(i18n);

  const getData = async (pageIndex: number, pageSize: number, searchFilter?: string) => {
    try {
      const res = await getAircraft(pageIndex, pageSize, searchFilter);
      if (res && res.code === 0) {
        const formattedDate = formatDate(res.data, ['maintenance_schedule', 'last_maintenance_date', 'year_manufactured']);
        const formattedTailModel = getTailModel(formattedDate);
        setTotalPages(res.totalPages);
        setDataAircraft(formattedTailModel);
      } else {
        setTotalPages(0);
        setDataAircraft([]);
      }
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex + 1);
    setPageSize(newPageSize);
  };

  useEffect(
    () => {
      if (isReload) {
        getData(pageIndex, pageSize, searchFilter);
        setIsReload(false);
      }
    },
    //eslint-disable-next-line
    [isReload]
  );

  useEffect(() => {
    getData(pageIndex, pageSize, searchFilter);
    //eslint-disable-next-line
  }, [pageIndex, pageSize, i18n, searchFilter]);

  async function handleAddRecord(newRecord: NewAircraft) {
    const res = await postAddAircraft(newRecord);
    setIsReload(true);
    return res;
  }

  async function handleDelete(status: boolean) {
    if (status && recordDelete) {
      try {
        const res = await postDeleteAircraft(recordDelete.id);
        if (res && res.code === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: intl.formatMessage({ id: 'delete-aircraft-successfully' }),
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
          setIsReload(true);
        } else {
          enqueueSnackbar(getStatusMessage('general', res.code), {
            variant: 'error'
          });
        }
      } catch (err) {
        enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
          variant: 'error'
        });
      }
    }
  }

  async function handleEdit(editedRecord: NewAircraft) {
    try {
      const res = await postEditAircraft(editedRecord.id, editedRecord);
      setIsReload(true);
      return res;
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  }
  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const onRowClick = (row: AircraftData) => {
    navigate(`/aircraft/profile/${row.tail_number}`);
  };

  const handleRowClick = (row: AircraftData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const columns = useMemo(
    () => {
      return ColumnsAircraft(pageIndex, pageSize, handleAdd, handleClose, setRecord, setRecordDelete, onRowClick);
    },
    //eslint-disable-next-line
    [setRecord, pageIndex, pageSize]
  );

  const handleImport = (data: NewAircraft[]) => {
    dispatch(importExcel({ type: 'aircraft', data }));
  };

  const handleExport = () => {
    dispatch(exportExcel({ type: 'aircraft' }));
  };

  const handleGetFormat = () => {
    dispatch(getFormatExcel({ type: 'aircraft' }));
  };

  return (
    <MainCard content={false}>
      <ScrollX>
        <GeneralizedTable
          onRowClick={handleRowClick}
          isLoading={isLoading}
          isReload={isReload}
          columns={columns}
          data={dataAircraft}
          handleAdd={handleAdd}
          csvFilename="list-aircraft-model.csv"
          addButtonLabel={<FormattedMessage id="add-aircraft-model" />}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          sortColumns="index"
          searchFilter={setSearchFilter}
          handleExportExcel={handleExport}
          handleExportFormat={handleGetFormat}
          getDataExcel={handleImport}
          dataHandlerExcel={(jsonData: NewAircraft[]) => {
            return jsonData.slice(1).map((row: any) => ({
              flightNumber: row[1] ? row[1].toString() : '',
              tailNumber: row[2] ? row[2].toString() : '',
              model: row[3] ? row[3].toString() : '',
              modelType: row[4] ? row[4].toString() : '',
              maintenanceSchedule: row[5] ? moment(excelSerialDateToDate(row[5])).format('YYYY/MM/DD') : null,
              lastMaintenanceDate: row[6] ? moment(excelSerialDateToDate(row[6])).format('YYYY/MM/DD') : null,
              manufacturer: row[7] ? row[7].toString() : '',
              yearManufactured: row[8] ? row[8].toString() : '',
              leasedAircraftStatus: row[9] ? row[9].toString() : '',
              ownership: row[10] ? row[10].toString() : ''
            }));
          }}
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
        <AddAircraft record={record} open={add} onCancel={handleAdd} handleAdd={handleAddRecord} handleEdit={handleEdit} />
        {recordDelete && (
          <AlertCustomerDelete
            alertDelete="alert-delete-aircraft"
            nameRecord={recordDelete.tail_number}
            open={open}
            handleClose={handleClose}
            handleDelete={handleDelete}
          />
        )}
        {/* <AircraftView open={openDialog} onClose={handleCloseView} data={record} /> */}
        <ViewDialog title="aircraft-info" config={aircraftViewConfig} open={openDialog} onClose={handleCloseView} data={record} />
      </Dialog>
    </MainCard>
  );
};

export default ListAircraftPage;
