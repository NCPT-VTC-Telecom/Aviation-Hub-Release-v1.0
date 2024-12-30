import { useEffect, useState, useMemo } from 'react';
import useConfig from 'hooks/useConfig';
import { formatDateTime, useLangUpdate } from 'utils/handleData';
import { useNavigate } from 'react-router';
import {
  // FormattedMessage,
  useIntl
} from 'react-intl';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { columnsOrder } from 'components/ul-config/table-config/order';

//model & utils
import { getAllOrder } from './model';
import { enqueueSnackbar } from 'notistack';

//types
import { Order } from 'types/order';

const OrderManagement = () => {
  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [record, setRecord] = useState<Order | null>(null);
  const [data, setData] = useState<Order[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { i18n } = useConfig();
  const intl = useIntl();
  const navigate = useNavigate();
  useLangUpdate(i18n);

  const getData = async (pageIndex: number, pageSize: number, searchValue?: string) => {
    try {
      const res = await getAllOrder(pageIndex, pageSize, searchValue);
      if (res && res.code === 0) {
        setTotalPages(res.totalPages);
        const formattedDate = formatDateTime(res.data, ['created_date']);
        setData(formattedDate);
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

  function clickView(record: Order) {
    navigate(`/order-management/details-order/${record.order_number}`);
  }

  useEffect(() => {
    getData(pageIndex, pageSize, searchValue);
    //eslint-disable-next-line
  }, [pageSize, searchValue, pageIndex, i18n]);

  const handleAdd = () => {
    if (record && !add) {
      navigate(`/order-management/edit-order/${record.order_number}`);
    } else {
      setAdd(!add);
      navigate(`/order-management/create-order`);
    }
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo(() => {
    return columnsOrder(pageIndex, pageSize, handleAdd, handleClose, setRecord, clickView);
    //eslint-disable-next-line
  }, [setRecord]);

  return (
    <MainCard content={false}>
      <ScrollX>
        <GeneralizedTable
          isLoading={isLoading}
          onRowClick={clickView}
          columns={columns}
          data={data}
          handleAdd={handleAdd}
          searchFilter={setSearchValue}
          csvFilename="order-list.csv"
          // addButtonLabel={<FormattedMessage id="add-order" />}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          sortColumns="index"
        />
      </ScrollX>
    </MainCard>
  );
};

export default OrderManagement;
