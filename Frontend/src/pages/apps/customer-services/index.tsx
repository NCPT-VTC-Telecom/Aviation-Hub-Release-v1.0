import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import useConfig from 'hooks/useConfig';

// third-party
import { enqueueSnackbar } from 'notistack';
import { Row } from 'react-table';
import { debounce } from 'lodash';

// material-ui
import { Dialog, Grid } from '@mui/material';
import { useIntl } from 'react-intl';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { PopupTransition } from 'components/@extended/Transitions';
import MailContentView from './MailContentView';
import ResponseMailModal from './ResponseMailModal';
// import AlertCustomerDelete from 'pages/apps/users/AlertCustomerDelete';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { columnsCustomerServices } from 'components/ul-config/table-config/customer-services';

// model & utils
import { getDataMail, postResponseMail } from './model';
import { formatDateTime, useLangUpdate } from 'utils/handleData';

// types
import { DataMail, ResponseMail } from 'types/customer-services';

import FilterMail from './FilterMail';

interface StatusChange {
  statusId: number;
  requestNumber: string;
}

interface FilterValues {
  start_date: string;
  end_date: string;
  statusID: number | null;
}

const ListTicketCustomerServices = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [filterValues, setFilterValues] = useState<FilterValues>();
  const [statusChange, setStatusChange] = useState<StatusChange>();
  const [record, setRecord] = useState<DataMail | null>(null);
  const [dataAircraft, setDataAircraft] = useState<DataMail[] | []>([]);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const prevValues = useRef({ pageIndex, pageSize, filterValues });

  const intl = useIntl();
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  const getData = async (pageIndex: number, pageSize: number, filter: any) => {
    try {
      const res = await getDataMail(pageIndex, pageSize, filter);
      if (res && res.code === 0) {
        const formattedData = formatDateTime(res.data, ['created_date']);
        setTotalPages(res.totalPages);
        setDataAircraft(formattedData);
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

  const debouncedGetData = debounce(getData, 300);

  const handleResponseMail = async (requestNumber: string, data: ResponseMail) => {
    try {
      const res = await postResponseMail(requestNumber, data);
      return res;
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  };

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

  const statusOnChange = (id: number, requestNumber: string) => {
    setStatusChange({ statusId: id, requestNumber: requestNumber });
  };

  const columns = useMemo(
    () => {
      return columnsCustomerServices(handleAdd, handleClose, setRecord, statusOnChange);
    },
    //eslint-disable-next-line
    [setRecord]
  );

  const renderRowSubComponent = useCallback(
    ({ row }: { row: Row<{}> }) => <MailContentView data={dataAircraft[Number(row.id)]} />,
    [dataAircraft]
  );

  useEffect(
    () => {
      if (isReload) {
        getData(pageIndex, pageSize, filterValues);
        setIsReload(false);
      }
    },
    //eslint-disable-next-line
    [isReload, i18n]
  );

  useEffect(() => {
    const hasChanged =
      prevValues.current.pageIndex !== pageIndex ||
      prevValues.current.pageSize !== pageSize ||
      JSON.stringify(prevValues.current.filterValues) !== JSON.stringify(filterValues);

    if (hasChanged) {
      debouncedGetData(pageIndex, pageSize, filterValues);
      prevValues.current = { pageIndex, pageSize, filterValues }; // Update the ref with current values
    }

    // Cleanup function to cancel debounce on unmount
    return () => {
      debouncedGetData.cancel();
    };
  }, [pageIndex, pageSize, filterValues, debouncedGetData]);

  useEffect(() => {
    if (statusChange) {
      handleResponseMail(statusChange.requestNumber, statusChange as ResponseMail);
      setIsReload(true);
    }
    //eslint-disable-next-line
  }, [statusChange]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FilterMail getFilterValue={setFilterValues}></FilterMail>
      </Grid>
      <Grid item xs={12}>
        <MainCard content={false}>
          <ScrollX>
            <GeneralizedTable
              isLoading={isLoading}
              isReload={isReload}
              columns={columns}
              data={dataAircraft}
              handleAdd={handleAdd}
              renderRowSubComponent={renderRowSubComponent}
              //   csvFilename="list-aircraft-model.csv"
              //   addButtonLabel={<FormattedMessage id="add-aircraft-model" />}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              sortColumns="request_number"
            />
          </ScrollX>
          <Dialog
            maxWidth="lg"
            TransitionComponent={PopupTransition}
            keepMounted
            fullWidth
            onClose={handleAdd}
            open={add}
            sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
            aria-describedby="alert-dialog-slide-description"
          >
            <ResponseMailModal record={record} open={add} onCancel={handleAdd} handleResponseMail={handleResponseMail} />
          </Dialog>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default ListTicketCustomerServices;
