// material-ui
import { Grid } from '@mui/material';

//Hook
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import useConfig from 'hooks/useConfig';
import { useIntl } from 'react-intl';

//third-party
// import { Row } from 'react-table';
import { enqueueSnackbar } from 'notistack';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
// import SessionView from 'pages/apps/management/session/list-session/SessionView';
import { columnsDevice } from 'components/ul-config/table-config/devices';

//types
import { formatDate, useLangUpdate } from 'utils/handleData';

//model
import { getDevice } from './model';
import { DeviceData } from 'types/device';

const TabSession = () => {
  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [record, setRecord] = useState<any>();

  const [productProvided, setProductProvided] = useState<DeviceData[]>([]);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);

  const intl = useIntl();
  const { providerID } = useParams();
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  async function getOrderByPackage(pageSize: number, pageIndex: number, productID: string) {
    try {
      const res = await getDevice(productID, pageSize, pageIndex);
      if (res.code === 0) {
        setTotalPages(res.totalPages);
        setTotalRecord(res.total);
        const formattedDate = formatDate(res.data, ['created_date']);
        setProductProvided(formattedDate);
      }
    } catch (err) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
    }
  }

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

  const columns = useMemo(() => {
    return columnsDevice(pageIndex, pageSize, handleAdd, handleClose, setRecord);
    //eslint-disable-next-line
  }, [setRecord]);

  useEffect(() => {
    if (providerID) {
      getOrderByPackage(pageSize, pageIndex, providerID);
    }
    if (isReload) {
      setIsReload(false);
    }
    //eslint-disable-next-line
  }, [providerID, i18n, isReload, pageIndex, pageSize]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard content={false}>
          <ScrollX>
            <GeneralizedTable
              isReload={isReload}
              columns={columns}
              data={productProvided}
              handleAdd={handleAdd}
              // renderRowSubComponent={renderRowSubComponent}
              onPageChange={handlePageChange}
              totalPages={totalPages}
              size={pageSize}
              sortColumns="index"
              isDecrease={false}
              hiddenPagination={totalRecord > 5 ? false : true}
            />
          </ScrollX>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default TabSession;
