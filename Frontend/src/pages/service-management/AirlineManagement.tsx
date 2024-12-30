import { useEffect, useState, useMemo } from 'react';
import useConfig from 'hooks/useConfig';
import useHandleAirline from 'hooks/useHandleAirline';

// third-party
import { useFormik } from 'formik';

// material-ui
import { Dialog } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { PopupTransition } from 'components/@extended/Transitions';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import Alert from 'components/template/Alert';
import ViewDialog from 'components/template/ViewDialog';

//ui-config
import { airlineViewConfig } from 'components/ul-config/view-dialog-config';
import { columnsAirline } from 'components/ul-config/table-config';

// model & utils
import { useLangUpdate } from 'utils/handleData';

// types
import { AirlineData, NewAirline } from 'types/aviation';
import useValidationSchemas from 'utils/validateSchema';
import GenericForm from 'components/organisms/GenericForm';
import { airlineFields } from 'components/ul-config/form-config';

const AirlineList = () => {
  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [record, setRecord] = useState<AirlineData | null>(null);
  const [recordDelete, setRecordDelete] = useState<AirlineData | null>(null);
  const [dataAircraft, setDataAircraft] = useState<AirlineData[] | []>([]);
  const [searchFilter, setSearchFilter] = useState('');

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const intl = useIntl();
  const { i18n } = useConfig();

  useLangUpdate(i18n);

  const { AirlineSchema } = useValidationSchemas();
  const { isLoading, isReload, totalPages, getDataAirline, handleActionAirline } = useHandleAirline();

  const getData = async (pageIndex: number, pageSize: number, searchFilter?: string) => {
    const dataAircraft = await getDataAirline({ page: pageIndex, pageSize, filters: searchFilter });
    setDataAircraft(dataAircraft);
  };

  const handlePageChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex + 1);
    setPageSize(newPageSize);
  };

  useEffect(() => {
    getData(pageIndex, pageSize, searchFilter);
    //eslint-disable-next-line
  }, [pageIndex, pageSize, i18n, searchFilter, isReload]);

  async function handleAction(data: NewAirline) {
    const action = record ? 'edit' : 'add';
    const res = await handleActionAirline({ id: data.id, type: action }, data);
    if (res && res.code === -1) {
      if (res.message === 'Hãng bay này đã tồn tại') {
        formik.setFieldError('name', intl.formatMessage({ id: 'duplicate-airline' }));
      }
    } else {
      handleAdd();
    }
    formik.setSubmitting(false);
  }

  async function handleDelete(status: boolean) {
    if (status && recordDelete) {
      await handleActionAirline({ id: recordDelete.id, type: 'delete' });
    }
  }

  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleRowClick = (row: AirlineData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const columns = useMemo(
    () => {
      return columnsAirline(pageIndex, pageSize, handleAdd, handleClose, setRecord, setRecordDelete);
    },
    //eslint-disable-next-line
    [setRecord, pageIndex, pageSize]
  );

  const initialValues = useMemo(() => getInitialValues(record), [record]);

  var formik = useFormik({
    initialValues,
    validationSchema: AirlineSchema,
    onSubmit: handleAction,
    enableReinitialize: true
  });

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
          csvFilename="airline-list.csv"
          addButtonLabel={<FormattedMessage id="add-airline" />}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          sortColumns="index"
          searchFilter={setSearchFilter}
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
        <GenericForm
          title={record ? intl.formatMessage({ id: 'edit-airline' }) : intl.formatMessage({ id: 'add-airline' })}
          isEditMode={!!record}
          onCancel={handleAdd}
          fields={airlineFields}
          formik={formik}
          open={add}
        />
        {recordDelete && (
          <Alert
            alertDelete="alert-delete-airline"
            nameRecord={recordDelete.name}
            open={open}
            handleClose={handleClose}
            handleDelete={handleDelete}
          />
        )}
        <ViewDialog title="airline-info" config={airlineViewConfig} open={openDialog} onClose={handleCloseView} data={record} />
      </Dialog>
    </MainCard>
  );
};

export default AirlineList;

const getInitialValues = (record: AirlineData | null) => {
  if (!record) {
    return {
      id: 0,
      name: '',
      code: '',
      country: '',
      email: '',
      phoneNumber: '',
      description: ''
    };
  }

  return {
    id: record.id,
    name: record.name,
    code: record.code,
    country: record.country,
    email: record.email,
    phoneNumber: record.phone_number,
    description: record.description
  };
};
