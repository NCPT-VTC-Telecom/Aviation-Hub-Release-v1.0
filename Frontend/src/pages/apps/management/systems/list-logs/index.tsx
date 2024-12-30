import { useEffect, useState, useMemo } from 'react';
import useConfig from 'hooks/useConfig';
import { useIntl } from 'react-intl';

//project component
import { Grid } from '@mui/material';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { columnsLogs } from 'components/ul-config/table-config/logs';

//model & utils
import { getLogs } from './model';
import { formatDateTime, useLangUpdate } from 'utils/handleData';
import { enqueueSnackbar } from 'notistack';

//types
import { LogsData } from 'types/system';

const ListLogsPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [record, setRecord] = useState<LogsData | null>(null);
  const [data, setData] = useState<LogsData[]>([]);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState<string>();

  const intl = useIntl();
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  const getData = async (pageIndex: number, pageSize: number, searchValue?: string) => {
    try {
      const res = await getLogs(pageIndex, pageSize, searchValue);

      if (res && res.code === 0) {
        setTotalPages(res.totalPages);
        const formattedTime = formatDateTime(res.data, ['action_time']);
        setData(formattedTime);
      } else {
        setTotalPages(0);
        setData([]);
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

  useEffect(() => {
    getData(pageIndex, pageSize, searchValue);
    if (isReload) {
      setIsReload(false);
    }
    //eslint-disable-next-line
  }, [i18n, isReload, pageIndex, pageSize, searchValue]);

  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo(() => {
    return columnsLogs(pageIndex, pageSize, handleAdd, handleClose);
    //eslint-disable-next-line
  }, [setRecord, pageIndex, pageSize]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <MainCard content={false}>
          <ScrollX>
            <GeneralizedTable
              isLoading={isLoading}
              isReload={isReload}
              columns={columns}
              data={data}
              handleAdd={handleAdd}
              onPageChange={handlePageChange}
              totalPages={totalPages}
              searchFilter={setSearchValue}
              sortColumns="index"
            />
          </ScrollX>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default ListLogsPage;
