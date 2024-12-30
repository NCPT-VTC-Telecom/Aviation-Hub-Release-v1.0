import { useIntl } from 'react-intl';
import { useMemo, useEffect } from 'react';

//third-party
import { FormikValues, useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';

//utils & types
import useValidationSchemas from 'utils/validateSchema';
import { NewProvider, ProviderData } from 'types/provider';

//project-import
import GenericForm from 'components/organisms/GenericForm';
import { supplierFields } from 'components/ul-config/form-config';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const getInitialValues = (record: ProviderData | null) => {
  if (!record) {
    return {
      id: '',
      name: '',
      description: '',
      address: '',
      contact: '',
      type: 'telecom',
      status: 'active'
    };
  }

  return {
    id: record.id,
    name: record.name,
    description: record.description,
    address: record.address,
    contact: record.contact,
    type: record.type,
    status: record.status_id === 14 ? 'active' : 'inactive'
  };
};

export interface Props {
  record: ProviderData | null;
  onCancel: () => void;
  handleAdd: (values: NewProvider) => void;
  handleEdit: (values: NewProvider) => void;
  open: boolean;
}

const AddTelecommunication = ({ record, onCancel, handleAdd, handleEdit, open }: Props) => {
  const intl = useIntl();
  const { TelecommunicationSchema } = useValidationSchemas();

  const handleSubmit = async (values: FormikValues, actions: any) => {
    try {
      const actionsFn = record ? handleEdit : handleAdd;
      const res: any = await actionsFn(values as NewProvider);
      if (res && res.code === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: record
              ? intl.formatMessage({ id: 'telecom-update-successfully' })
              : intl.formatMessage({ id: 'telecom-add-successfully' }),
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
    validationSchema: TelecommunicationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true
  });

  useEffect(() => {
    formik.resetForm({ values: initialValues });
    //eslint-disable-next-line
  }, [record, initialValues, open]);

  return (
    <GenericForm
      onCancel={onCancel}
      title={record ? intl.formatMessage({ id: 'edit-telecom' }) : intl.formatMessage({ id: 'new-telecom' })}
      isEditMode={!!record}
      fields={supplierFields}
      formik={formik}
      open={open}
    />
  );
};

export default AddTelecommunication;
