import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { FormikValues, useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';

import { bundleTelecomFields } from 'components/ul-config/form-config';
import GenericForm from 'components/organisms/GenericForm';

import useValidationSchemas from 'utils/validateSchema';
import { BundleData, NewBundle } from 'types/product';

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { OptionList } from 'types';

const getInitialValues = (plan: FormikValues | null) => {
  if (!plan) {
    return {
      id: 0,
      name: '',
      productType: '',
      productId: 0,
      type: 'telecom',
      description: ''
    };
  }

  return {
    id: plan.id,
    name: plan.name,
    productType: plan.product_type,
    productId: plan.product_id,
    type: 'telecom',
    description: plan.description
  };
};

export interface Props {
  plan: BundleData | null;
  onCancel: () => void;
  handleAdd: (values: NewBundle) => void;
  handleEdit: (values: NewBundle) => void;
  open: boolean;
  optionProduct: OptionList[];
}

const AddPackagesWifi = ({ plan, onCancel, handleAdd, handleEdit, open, optionProduct }: Props) => {
  const intl = useIntl();
  const { BundleTelecomSchema } = useValidationSchemas();

  const initialValues: FormikValues = useMemo(() => getInitialValues(plan), [plan]);

  const handleSubmit = async (values: FormikValues, actions: any) => {
    try {
      const actionsFn = plan ? handleEdit : handleAdd;
      const res: any = await actionsFn(values as NewBundle);

      if (res && res.code === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: plan
              ? intl.formatMessage({ id: 'bundle-update-successfully' })
              : intl.formatMessage({ id: 'bundle-add-successfully' }),
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        actions.setSubmitting(false);
        onCancel();
      } else if (res.code === -1 && res.message === 'Sản phẩm viễn thông đã tồn tại') {
        actions.setFieldError('title', intl.formatMessage({ id: 'duplicate-product' }));
        actions.setSubmitting(false);
      } else {
        actions.setSubmitting(false);
        enqueueSnackbar(plan ? intl.formatMessage({ id: 'update-failed' }) : intl.formatMessage({ id: 'add-failed' }), {
          variant: 'error'
        });
      }
    } catch (error) {
      enqueueSnackbar(intl.formatMessage({ id: 'process-error' }), {
        variant: 'error'
      });
      actions.setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: BundleTelecomSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true
  });

  const fieldsWithOptions = bundleTelecomFields.map((field) => {
    if (field.name === 'productId') {
      return { ...field, options: optionProduct };
    }
    return field;
  });

  return (
    <GenericForm
      onCancel={onCancel}
      title={plan ? intl.formatMessage({ id: 'edit-bundle' }) : intl.formatMessage({ id: 'new-bundle' })}
      isEditMode={!!plan}
      fields={fieldsWithOptions}
      formik={formik}
      open={open}
    />
  );
};

export default AddPackagesWifi;
