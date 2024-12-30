import { useIntl } from 'react-intl';
import { FormikValues, useFormik } from 'formik';
import useValidationSchemas from 'utils/validateSchema';
import { NewProvider, ProviderData } from 'types/provider';
import GenericForm from 'components/organisms/GenericForm'; // Adjust the import path as needed
import { supplierFields } from 'components/ul-config/form-config'; // Adjust the import path as needed
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { enqueueSnackbar } from 'notistack';
import { useMemo, useEffect } from 'react';

const getInitialValues = (supplier: FormikValues | null) => {
  if (!supplier) {
    return {
      id: '',
      name: '',
      description: '',
      address: '',
      contact: '',
      type: 'device',
      status: 'active'
    };
  }

  return {
    id: supplier.id,
    name: supplier.name,
    description: supplier.description,
    address: supplier.address,
    contact: supplier.contact,
    type: supplier.type,
    status: supplier.status_id === 14 ? 'active' : 'inactive'
  };
};

export interface Props {
  record: ProviderData | null;
  onCancel: () => void;
  handleAdd: (values: NewProvider) => void;
  handleEdit: (values: NewProvider) => void;
  open: boolean;
}

const AddDeviceProvider = ({ record, onCancel, handleAdd, handleEdit, open }: Props) => {
  const intl = useIntl();
  const { SupplierSchema } = useValidationSchemas();

  const handleSubmit = async (values: FormikValues, actions: any) => {
    try {
      const actionsFn = record ? handleEdit : handleAdd;
      const res: any = await actionsFn(values as NewProvider);
      if (res && res.code === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: record
              ? intl.formatMessage({ id: 'supplier-update-successfully' })
              : intl.formatMessage({ id: 'supplier-add-successfully' }),
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
        actions.setSubmitting(false);
        onCancel();
      } else {
        if (res.code === -1 && res.message === 'Nhà cung cấp đã tồn tại') {
          actions.setFieldError('name', intl.formatMessage({ id: 'duplicate-supplier' }));
        }
        if (res.code === -1 && res.message === 'Tên đối tác cung cấp này đã tồn tại') {
          actions.setFieldError('name', intl.formatMessage({ id: 'duplicate-supplier' }));
        }

        enqueueSnackbar(record ? intl.formatMessage({ id: 'update-failed' }) : intl.formatMessage({ id: 'add-failed' }), {
          variant: 'error'
        });
        actions.setSubmitting(false);
      }
    } catch (error) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
      actions.setSubmitting(false);
    }
  };

  const initialValues: FormikValues = useMemo(() => getInitialValues(record), [record]);

  const formik = useFormik({
    initialValues,
    validationSchema: SupplierSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true
  });

  useEffect(() => {
    formik.resetForm({ values: initialValues });
    //eslint-disable-next-line
  }, [record, initialValues]);

  return (
    <GenericForm
      onCancel={onCancel}
      title={record ? intl.formatMessage({ id: 'edit-supplier' }) : intl.formatMessage({ id: 'new-supplier' })}
      isEditMode={!!record}
      fields={supplierFields}
      formik={formik}
      open={open}
    />
  );
};

export default AddDeviceProvider;
