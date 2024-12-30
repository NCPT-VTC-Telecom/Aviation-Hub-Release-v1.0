//Hook
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import useConfig from 'hooks/useConfig';
import { useIntl } from 'react-intl';

//third-party
import { enqueueSnackbar } from 'notistack';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { columnsRecentOrder } from 'components/ul-config/table-config/order';

//types
import { formatDateTime, useLangUpdate } from 'utils/handleData';
import { Order } from 'types/order';

//model
import { getOrder } from './model';

const TabHistoryPrice = () => {
  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [record, setRecord] = useState<any>();

  const [historyPrice, setHistoryPrice] = useState<Order[]>([]);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);

  const intl = useIntl();
  const { params } = useParams();
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  async function getHistoryPrice(pageSize: number, pageIndex: number, productID: number) {
    try {
      const res = await getOrder(pageIndex, pageSize, productID);
      if (res.code === 0) {
        setTotalPages(res.totalPages);
        setTotalRecord(res.total);
        const formattedDateTime = formatDateTime(res.data, ['created_date']);
        setHistoryPrice(formattedDateTime);
      } else {
        setHistoryPrice([]);
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
    return columnsRecentOrder(pageIndex, pageSize, handleAdd, handleClose);
    //eslint-disable-next-line
  }, [setRecord]);

  useEffect(() => {
    if (params) {
      const [id] = params!.split('-');
      getHistoryPrice(pageIndex, pageSize, parseInt(id));
    }
    if (isReload) {
      setIsReload(false);
    }
    //eslint-disable-next-line
  }, [params, i18n, isReload, pageIndex, pageSize]);

  return (
    <MainCard content={false}>
      <ScrollX>
        <GeneralizedTable
          isReload={isReload}
          columns={columns}
          data={historyPrice}
          handleAdd={handleAdd}
          // renderRowSubComponent={renderRowSubComponent}
          onPageChange={handlePageChange}
          totalPages={totalPages}
          sortColumns="index"
          size={pageSize}
          isDecrease={true}
          hiddenPagination={totalRecord > 5 ? false : true}
        />
      </ScrollX>
    </MainCard>
  );
};

export default TabHistoryPrice;
