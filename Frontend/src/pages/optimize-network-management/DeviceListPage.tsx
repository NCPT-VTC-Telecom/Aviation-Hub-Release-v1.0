import { useEffect, useState, useMemo, useCallback } from 'react';
import useConfig from 'hooks/useConfig';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import useHandleDevice from 'hooks/useHandleDevice';
import useHandleAircraft from 'hooks/useHandleAircraft';
import useHandleSupplier from 'hooks/useHandleSupplier';
import useValidationSchemas from 'utils/validateSchema';

// material-ui
import { Dialog } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { PopupTransition } from 'components/@extended/Transitions';
import Alert from 'components/template/Alert';
import GeneralizedTable from 'components/organisms/GeneralizedTable';
import ViewDialog from 'components/template/ViewDialog';
import GenericForm from 'components/organisms/GenericForm';

//config
import { columnsDevice } from 'components/ul-config/table-config/devices';
import { deviceViewConfig } from 'components/ul-config/view-dialog-config';

// model & utils
import { useLangUpdate, excelSerialDateToDate, formatDateToSV, adjustDateForTimezone, getOption } from 'utils/handleData';

// redux
import { dispatch } from 'store';
import { importExcel, exportExcel, getFormatExcel } from 'store/reducers/excel';

// third-party
import moment from 'moment';

// types
import { DeviceData, NewDevice } from 'types/device';
import { OptionList } from 'types/general';
import { deviceFields } from 'components/ul-config/form-config';
import { useFormik } from 'formik';

const ListDevicePage = () => {
  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [isInitial, setIsInitial] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const [record, setRecord] = useState<DeviceData | null>(null);
  const [recordDelete, setRecordDelete] = useState<DeviceData | null>(null);
  const [data, setData] = useState<DeviceData[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const [aircraftOption, setAircraftOption] = useState<OptionList[]>([]);
  const [deviceType, setDeviceType] = useState<OptionList[]>([]);
  const [supplierOption, setSupplierOption] = useState<OptionList[]>([]);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { DeviceSchema } = useValidationSchemas();
  const intl = useIntl();
  const navigate = useNavigate();
  const { i18n } = useConfig();
  useLangUpdate(i18n);

  const { getDataDevice, handleAction, isLoading, totalPages, isReload } = useHandleDevice();
  const { getDataAircraft } = useHandleAircraft();
  const { getDataSupplier } = useHandleSupplier();

  const fetchInitialData = useCallback(async () => {
    try {
      const [deviceTypeOption, supplierData, aircraftData] = await Promise.all([
        getDataDevice(10, 1, 'device_type'),
        getDataSupplier(10, 1, { type: 'device' }),
        getDataAircraft({ pageSize: 20, page: 1 })
      ]);

      setDeviceType(deviceTypeOption);
      setSupplierOption(getOption(supplierData, 'name', 'name'));
      setAircraftOption(getOption(aircraftData, 'tail_number', 'id'));
    } catch (error) {
      console.error('Error fetching initial data: ', error);
    }
    //eslint-disable-next-line
  }, []);

  const fetchDataDevice = async () => {
    const deviceData = await getDataDevice(pageSize, pageIndex, 'device', { filters: searchValue });
    setData(deviceData);
  };

  useEffect(() => {
    fetchDataDevice();

    if (isInitial) {
      fetchInitialData();
      setIsInitial(false);
    }

    //eslint-disable-next-line
  }, [pageIndex, pageSize, isReload, i18n, searchValue]);

  const handlePageChange = useCallback((newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex + 1);
    setPageSize(newPageSize);
  }, []);

  async function handleDelete(status: boolean) {
    if (status && recordDelete) {
      await handleAction('delete', { id: recordDelete.id_device });
    }
  }

  async function handleActionDevice(data: NewDevice) {
    const type = record ? 'edit' : 'add';
    const res = await handleAction(type, { id: data.id }, data);
    if (res && res.code === -1) {
      if (res.message === 'Thiết bị này đã tồn tại') {
        formik.setFieldError('name', intl.formatMessage({ id: 'duplicate-device' }));
      }
      if (res.message === 'Nhà cung cấp không tồn tại') {
        formik.setFieldError('supplier', intl.formatMessage({ id: 'supplier-not-exits' }));
      }
      if (res.message === 'Máy bay này không tồn tại') {
        formik.setFieldError('idAircraft', intl.formatMessage({ id: 'aircraft-not-exits' }));
      }
    } else {
      handleAdd();
    }
    formik.setSubmitting(false);
  }

  const handleAdd = () => {
    setAdd(!add);
    if (record && !add) setRecord(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const onViewClick = (row: DeviceData) => {
    navigate(`/device/profile/${row.id_device}`);
  };

  const handleRowClick = (row: DeviceData) => {
    setRecord(row);
    setOpenDialog(true);
  };

  const handleCloseView = () => {
    setOpenDialog(false);
    setRecord(null);
  };

  const columns = useMemo(() => {
    return columnsDevice(pageIndex, pageSize, handleAdd, handleClose, setRecord, setRecordDelete, onViewClick);
    //eslint-disable-next-line
  }, [setRecord, setRecordDelete, pageIndex, pageSize]);

  const handleImport = (data: NewDevice[]) => {
    dispatch(importExcel({ type: 'device', data }));
  };

  const handleExport = () => {
    dispatch(exportExcel({ type: 'device' }));
  };

  const handleGetFormat = () => {
    dispatch(getFormatExcel({ type: 'device' }));
  };

  //eslint-disable-next-line
  const initialValues = useMemo(() => getInitialValues(record, deviceType, aircraftOption), [record]);

  var formik = useFormik({
    initialValues,
    validationSchema: DeviceSchema,
    onSubmit: handleActionDevice,
    enableReinitialize: true
  });

  const fieldsWithOptions = deviceFields.map((field) => {
    if (field.name === 'supplier') {
      return { ...field, options: supplierOption };
    }
    if (field.name === 'idTypeDevice') {
      return { ...field, options: deviceType };
    }
    if (field.name === 'idAircraft') {
      return { ...field, options: aircraftOption };
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
          csvFilename="devices-list.csv"
          addButtonLabel={<FormattedMessage id="add-device" />}
          onPageChange={handlePageChange}
          totalPages={totalPages}
          onRowClick={handleRowClick}
          sortColumns="index"
          isDecrease={false}
          handleExportExcel={handleExport}
          searchFilter={setSearchValue}
          handleExportFormat={handleGetFormat}
          getDataExcel={handleImport}
          dataHandlerExcel={(jsonData: NewDevice[]) => {
            return jsonData.slice(1).map((row: any) => ({
              id: row[0],
              name: row[1], // Tên thiết bị
              type: row[2], // Loại
              model: row[3], // Model
              firmware: row[4], // Firmware
              wifiStandard: row[5], // Chuẩn Wifi
              macAddress: row[6], // Địa chỉ MAC
              idAircraft: row[7], // Số hiệu máy bay
              placementLocation: row[8], // Vị trí lắp đặt
              supplier: row[9], // Tên nhà cung cấp
              activationDate: row[10] ? moment(excelSerialDateToDate(row[10])).format('YYYY/MM/DD') : null, // Ngày kích hoạt
              deactivationDate: row[11] ? moment(excelSerialDateToDate(row[11])).format('YYYY/MM/DD') : null // Ngày kết thúc hoạt động
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
        <GenericForm
          title={record ? intl.formatMessage({ id: 'edit-info-device' }) : intl.formatMessage({ id: 'add-device' })}
          onCancel={handleAdd}
          fields={fieldsWithOptions}
          isEditMode={!!record}
          formik={formik}
          open={add}
        />
        {recordDelete && (
          <Alert
            alertDelete="alert-delete-device"
            nameRecord={recordDelete.name}
            open={open}
            handleClose={handleClose}
            handleDelete={handleDelete}
          />
        )}
      </Dialog>
      <ViewDialog title="device-info" config={deviceViewConfig} open={openDialog} onClose={handleCloseView} data={record} />
    </MainCard>
  );
};

export default ListDevicePage;

const mapLabelOptionToID = (OptionList: OptionList[], key: string) => {
  if (key) {
    const OptionsID = OptionList.find((dt) => dt.label === key);
    return OptionsID ? OptionsID.value : 0;
  } else {
    return 0;
  }
};

const getInitialValues = (device: DeviceData | null, devicesType: OptionList[], aircraftOptions: OptionList[]) => {
  const dateOfManufacture = formatDateToSV(device?.manufacturer_date as string);
  const deactivationDate = formatDateToSV(device?.deactivation_date as string);
  const activationDate = formatDateToSV(device?.activation_date as string);

  const newDevice = {
    id: '',
    idAircraft: 0,
    idTypeDevice: 0,
    name: '',
    description: '',
    dateOfManufacture: null as Date | null,
    placementLocation: '',
    activationDate: null as Date | null,
    deactivationDate: null as Date | null,
    ipAddress: '',
    port: '',
    macAddress: '',
    ipv6Address: '',
    firmware: '',
    wifiStandard: '',
    manufacturer: '',
    model: '',
    cpuType: '',
    supplier: ''
  };

  if (device) {
    newDevice.id = device.id_device;
    newDevice.name = device.name;
    newDevice.description = device.description;
    newDevice.placementLocation = device.placement_location;
    newDevice.activationDate = device.activation_date ? adjustDateForTimezone(activationDate) : null;
    newDevice.deactivationDate = device.deactivation_date ? adjustDateForTimezone(deactivationDate) : null;
    newDevice.ipAddress = device.ip_address;
    newDevice.port = device.port;
    newDevice.macAddress = device.mac_address;
    newDevice.ipv6Address = device.ipv6_address;
    newDevice.firmware = device.firmware;
    newDevice.wifiStandard = device.wifi_standard;
    newDevice.manufacturer = device.manufacturer;
    newDevice.dateOfManufacture = device.manufacturer_date ? adjustDateForTimezone(dateOfManufacture) : null;
    newDevice.model = device.model;
    newDevice.cpuType = device.cpu_type;
    newDevice.supplier = device.supplier;
    newDevice.idTypeDevice = mapLabelOptionToID(devicesType, device?.type) as number;
    newDevice.idAircraft = mapLabelOptionToID(aircraftOptions, device?.aircraft.tail_number) as number;

    return newDevice;
  }

  return newDevice;
};
