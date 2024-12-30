// AddPaymentMethod.tsx
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

//third-party
import { FormikValues, useFormik } from 'formik';
import useValidationSchemas from 'utils/validateSchema';
import { NewPaymentMethod, PaymentMethodData } from 'types/order';
import GenericForm from 'components/organisms/GenericForm';
import { paymentMethodFields } from 'components/ul-config/form-config';

//redux
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { enqueueSnackbar } from 'notistack';

const getInitialValues = (record: PaymentMethodData | null): FormikValues => {
  return {
    id: record ? record.id : 0,
    code: record ? record.code : '',
    description: record ? record.description : '',
    title: record ? record.title : '',
    value: record ? record.value : ''
  };
};

export interface Props {
  record: PaymentMethodData | null;
  onCancel: () => void;
  handleAdd: (values: NewPaymentMethod) => void;
  handleEdit: (values: NewPaymentMethod) => void;
  open: boolean;
}

const AddPaymentMethod = ({ record, onCancel, handleAdd, handleEdit, open }: Props) => {
  const intl = useIntl();
  const { PaymentMethodSchema } = useValidationSchemas();

  const handleSubmit = async (values: FormikValues, actions: any) => {
    try {
      const actionsFn = record ? handleEdit : handleAdd;
      const res: any = await actionsFn(values as NewPaymentMethod);

      if (res && res.code === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: record
              ? intl.formatMessage({ id: 'payment-method-update-successfully' })
              : intl.formatMessage({ id: 'payment-method-add-successfully' }),
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        actions.setSubmitting(false);
        onCancel();
      } else {
        if (res.code === -1 && res.message === 'Phương thức thanh toán này đã tồn tại') {
          actions.setFieldError('code', intl.formatMessage({ id: 'duplicate-code-payment-method' }));
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

  const initialValues = useMemo(
    () => getInitialValues(record),
    //eslint-disable-next-line
    [record]
  );

  const formik = useFormik({
    initialValues,
    validationSchema: PaymentMethodSchema,
    onSubmit: handleSubmit
  });

  const fieldsWithReadOnly = paymentMethodFields.map((field) => {
    if (field.name === 'code') {
      return { ...field, readOnly: record ? true : false };
    }
    return field;
  });

  return (
    <GenericForm
      onCancel={onCancel}
      title={record ? intl.formatMessage({ id: 'edit-payment-method' }) : intl.formatMessage({ id: 'new-payment-method' })}
      isEditMode={!!record}
      fields={fieldsWithReadOnly}
      formik={formik}
      open={open}
    />
  );
};

export default AddPaymentMethod;
