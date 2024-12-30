import { useIntl } from 'react-intl';
import { useMemo, useEffect } from 'react';

//project-import
import GenericForm from 'components/organisms/GenericForm';
import { gatewayFields } from 'components/ul-config/form-config';
//third-party
import { FormikValues, useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';

//utils & type
import useValidationSchemas from 'utils/validateSchema';
import { NewGateway, GatewayData } from 'types/order';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const getInitialValues = (record: GatewayData | null): FormikValues => {
  if (!record) {
    return {
      id: 0,
      code: '',
      description: '',
      title: '',
      value: ''
    };
  }

  return {
    id: record.id,
    code: record.code,
    description: record.description,
    title: record.title,
    value: record.value
  };
};

export interface Props {
  record: GatewayData | null;
  onCancel: () => void;
  handleAdd: (values: NewGateway) => void;
  handleEdit: (values: NewGateway) => void;
  open: boolean;
}

const AddGateway = ({ record, onCancel, handleAdd, handleEdit, open }: Props) => {
  const intl = useIntl();
  const { GatewaySchema } = useValidationSchemas();

  const handleSubmit = async (values: FormikValues, actions: any) => {
    try {
      const actionsFn = record ? handleEdit : handleAdd;
      const res: any = await actionsFn(values as NewGateway);

      if (res && res.code === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: record
              ? intl.formatMessage({ id: 'gateway-update-successfully' })
              : intl.formatMessage({ id: 'gateway-add-successfully' }),
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        actions.setSubmitting(false);
        onCancel();
      } else {
        if (res.code === -1 && res.message === 'Cổng thanh toán này đã tồn tại') {
          actions.setFieldError('code', intl.formatMessage({ id: 'duplicate-code-gateway' }));
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
    validationSchema: GatewaySchema,
    onSubmit: handleSubmit,
    enableReinitialize: true
  });

  const fieldsWithReadOnly = gatewayFields.map((field) => {
    if (field.name === 'code') {
      return { ...field, readOnly: record ? true : false };
    }
    return field;
  });

  useEffect(() => {
    formik.resetForm({ values: initialValues });
    //eslint-disable-next-line
  }, [record, initialValues]);

  return (
    <GenericForm
      onCancel={onCancel}
      title={record ? intl.formatMessage({ id: 'edit-gateway' }) : intl.formatMessage({ id: 'new-gateway' })}
      isEditMode={!!record}
      fields={fieldsWithReadOnly}
      formik={formik}
      open={open}
    />
  );
};

export default AddGateway;
