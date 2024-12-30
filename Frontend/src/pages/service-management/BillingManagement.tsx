import { useEffect, useState, useMemo } from 'react';
import useConfig from 'hooks/useConfig';

//project component
import { Grid } from '@mui/material';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { columnsBilling } from 'components/ul-config/table-config/transaction';

//model & utils
import { useLangUpdate } from 'utils/handleData';

//types
import { Billing } from 'types/order';
import useHandleTransaction from 'hooks/useHandleTransaction';

const BillingManagement = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);

  const [record, setRecord] = useState<Billing | null>(null);
  const [data, setData] = useState<Billing[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  const { fetchDataBilling, totalPages, isLoading } = useHandleTransaction();

  const getData = async (pageIndex: number, pageSize: number, searchValue?: string) => {
    const dataBilling = await fetchDataBilling({ page: pageIndex, pageSize, filters: searchValue });
    setData(dataBilling);
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

  const columns = useMemo(() => {
    return columnsBilling(pageIndex, pageSize, handleAdd, handleClose);
    //eslint-disable-next-line
  }, [setRecord]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
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
            />
          </ScrollX>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default BillingManagement;
