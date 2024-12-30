import { useCallback, useEffect, useState, useMemo } from 'react';
import useConfig from 'hooks/useConfig';
import { FormattedMessage, useIntl } from 'react-intl';
import useValidationSchemas from 'utils/validateSchema';
import useHandleRestriction from 'hooks/useHandleRestriction';

// material-ui
import { Dialog } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Alert from 'components/template/Alert';
import { PopupTransition } from 'components/@extended/Transitions';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import { columnsRestrictionDomain } from 'components/ul-config/table-config/restriction';
import GenericForm from 'components/organisms/GenericForm';
import ViewDialog from 'components/template/ViewDialog';

//ul-config
import { restrictionDomainViewFields } from 'components/ul-config/view-dialog-config';
import { restrictionDomainFields } from 'components/ul-config/form-config';

//utils
import { useLangUpdate } from 'utils/handleData';

//third-party
import { useFormik } from 'formik';

//types
import { BlackListDomainData, NewBlackListDomain, OptionList } from 'types';

const RestrictionDomainList = () => {
  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [record, setRecord] = useState<BlackListDomainData | null>(null);
  const [recordDelete, setRecordDelete] = useState<BlackListDomainData | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState<BlackListDomainData[]>([]);
  const [optionCategories, setOptionCategories] = useState<OptionList[]>([]);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const intl = useIntl();
  const { i18n } = useConfig();
  const { RestrictionDomainSchema } = useValidationSchemas();
  const { getDataRestriction, isLoading, isReload, totalPages, handleActionRestriction } = useHandleRestriction();

  useLangUpdate(i18n);

  const getData = useCallback(
    async (pageIndex: number, pageSize: number, searchValue?: string) => {
      const dataRestrictionDevice = await getDataRestriction({ type: 'domain', page: pageIndex, pageSize, filters: searchValue });
      const dataCategoryRestriction = await getDataRestriction({ type: 'category', page: pageIndex, pageSize, filters: searchValue });
      setData(dataRestrictionDevice);
      setOptionCategories(dataCategoryRestriction);
    },
    //eslint-disable-next-line
    []
  );

  const handlePageChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex + 1);
    setPageSize(newPageSize);
  };

  useEffect(() => {
    getData(pageIndex, pageSize, searchValue);

    //eslint-disable-next-line
  }, [pageIndex, pageSize, i18n, searchValue, isReload]);

  async function handleActionDomain(data: NewBlackListDomain) {
    const action = record ? 'edit' : 'add';
    const res = await handleActionRestriction(action, 'domain', { id: data.id, dataBody: data });
    if (res && res.code === -1) {
      if (res.message === 'Tên miền này đã tồn tại') {
        formik.setFieldError('name', intl.formatMessage({ id: 'duplicate-domain' }));
      }
    } else if (res.code === 0) {
      handleAdd();
    }
    formik.setSubmitting(false);
  }

  async function handleDelete(status: boolean) {
    if (status && recordDelete) {
      await handleActionRestriction('delete', 'domain', { id: recordDelete.id });
    }
  }

  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleRowClick = (row: BlackListDomainData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const columns = useMemo(() => {
    return columnsRestrictionDomain(pageIndex, pageSize, handleAdd, handleClose, setRecord, setRecordDelete);
    //eslint-disable-next-line
  }, [setRecord, pageIndex, pageSize]);

  const initialValues = useMemo(() => getInitialValues(record), [record]);

  var formik = useFormik({
    initialValues,
    validationSchema: RestrictionDomainSchema,
    onSubmit: handleActionDomain,
    enableReinitialize: true
  });

  const fieldsWithOptions = restrictionDomainFields.map((field) => {
    if (field.name === 'categoryId') {
      return { ...field, options: optionCategories };
    }
    return field;
  });

  return (
    <MainCard content={false}>
      <ScrollX>
        <GeneralizedTable
          isLoading={isLoading}
          columns={columns}
          data={data}
          handleAdd={handleAdd}
          csvFilename="restriction-domain-list.csv"
          addButtonLabel={<FormattedMessage id="add-restriction-domain" />}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          sortColumns="index"
          onRowClick={handleRowClick}
          searchFilter={setSearchValue}
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
          title={record ? intl.formatMessage({ id: 'edit-restriction-domain' }) : intl.formatMessage({ id: 'new-restriction-domain' })}
          isEditMode={!!record}
          onCancel={handleAdd}
          fields={fieldsWithOptions}
          formik={formik}
          open={add}
        />
      </Dialog>
      {recordDelete && (
        <Alert
          alertDelete="alert-delete-restriction-domain"
          nameRecord={recordDelete.name}
          open={open}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />
      )}
      <ViewDialog
        title="restriction-domain-info"
        config={restrictionDomainViewFields}
        open={openDialog}
        onClose={handleCloseView}
        data={record}
      />
    </MainCard>
  );
};

export default RestrictionDomainList;

const getInitialValues = (record: BlackListDomainData | null) => {
  if (!record) {
    return {
      id: 0,
      name: '',
      url: '',
      ipAddress: '',
      ipv6Address: '',
      dnsAddress: '',
      reason: '',
      categoryId: 0
    };
  }

  return {
    id: record.id,
    name: record.name,
    url: record.url,
    ipAddress: record.ip_address,
    ipv6Address: record.ipv6_address,
    dnsAddress: record.dns_address,
    reason: record.reason,
    categoryId: record.category.id
  };
};
