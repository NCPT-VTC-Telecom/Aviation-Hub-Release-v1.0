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
import { columnsRestrictionDevices } from 'components/ul-config/table-config/restriction';
import GenericForm from 'components/organisms/GenericForm';
import ViewDialog from 'components/template/ViewDialog';

//ul-config
import { restrictionDeviceViewFields } from 'components/ul-config/view-dialog-config';
import { restrictionDevicesFields } from 'components/ul-config/form-config';

//utils
import { useLangUpdate } from 'utils/handleData';

//third-party
import { useFormik } from 'formik';

//types
import { BlackListDeviceData, NewBlackListDevice } from 'types';

const RestrictionDeviceList = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [record, setRecord] = useState<BlackListDeviceData | null>(null);
  const [recordDelete, setRecordDelete] = useState<BlackListDeviceData | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [data, setData] = useState<BlackListDeviceData[]>([]);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const intl = useIntl();
  const { i18n } = useConfig();
  const { RestrictionDeviceSchema } = useValidationSchemas();
  const { getDataRestriction, isLoading, totalPages, handleActionRestriction, isReload } = useHandleRestriction();

  useLangUpdate(i18n);

  const getData = useCallback(async (pageIndex: number, pageSize: number, searchValue?: string) => {
    const dataRestrictionDevice = await getDataRestriction({ type: 'devices', page: pageIndex, pageSize, filters: searchValue });
    setData(dataRestrictionDevice);
    //eslint-disable-next-line
  }, []);

  const handlePageChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex + 1);
    setPageSize(newPageSize);
  };

  useEffect(() => {
    getData(pageIndex, pageSize, searchValue);
    //eslint-disable-next-line
  }, [pageIndex, pageSize, isReload, i18n, searchValue]);

  async function handleActionDevice(data: NewBlackListDevice) {
    const action = record ? 'edit' : 'add';
    const res = await handleActionRestriction(action, 'device', { id: data.id, dataBody: data });

    if (res && res.code === -1) {
      if (res.message === 'Thiết bị này đã tồn tại') {
        formik.setFieldError('name', intl.formatMessage({ id: 'duplicate-device' }));
      }
    } else if (res.code === 0) {
      handleAdd();
    }
    formik.setSubmitting(false);
  }

  async function handleDelete(status: boolean) {
    if (status && recordDelete) {
      await handleActionRestriction('delete', 'device', { id: recordDelete.id });
    }
  }

  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleRowClick = (row: BlackListDeviceData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const columns = useMemo(() => {
    return columnsRestrictionDevices(pageIndex, pageSize, handleAdd, handleClose, setRecord, setRecordDelete, true);
    //eslint-disable-next-line
  }, [setRecord, pageIndex, pageSize]);

  //eslint-disable-next-line
  const initialValues = useMemo(() => getInitialValues(record), [record]);

  var formik = useFormik({
    initialValues,
    validationSchema: RestrictionDeviceSchema,
    onSubmit: handleActionDevice,
    enableReinitialize: true
  });

  return (
    <MainCard content={false}>
      <ScrollX>
        <GeneralizedTable
          isLoading={isLoading}
          isReload={isReload}
          columns={columns}
          data={data}
          handleAdd={handleAdd}
          csvFilename="restriction-devices-list.csv"
          addButtonLabel={<FormattedMessage id="add-restriction-device" />}
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
          title={record ? intl.formatMessage({ id: 'edit-restriction-device' }) : intl.formatMessage({ id: 'new-restriction-device' })}
          isEditMode={!!record}
          onCancel={handleAdd}
          fields={restrictionDevicesFields}
          formik={formik}
          open={add}
        />
      </Dialog>
      {recordDelete && (
        <Alert
          alertDelete="alert-delete-restriction-device"
          nameRecord={recordDelete.device_name}
          open={open}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />
      )}
      <ViewDialog
        title="restriction-device-info"
        config={restrictionDeviceViewFields}
        open={openDialog}
        onClose={handleCloseView}
        data={record}
      />
    </MainCard>
  );
};

export default RestrictionDeviceList;

const getInitialValues = (record: BlackListDeviceData | null) => {
  if (!record) {
    return {
      id: 0,
      deviceName: '',
      ipAddress: '',
      ipv6Address: '',
      macAddress: '',
      reason: ''
    };
  }

  return {
    id: record.id,
    deviceName: record.device_name,
    ipAddress: record.ip_address,
    ipv6Address: record.ipv6_address,
    macAddress: record.mac_address,
    reason: record.reason
  };
};
