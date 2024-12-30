import { useMemo, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { FormikValues, useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';

import { bundleAirlineFields } from 'components/ul-config/form-config';
import GenericForm from 'components/organisms/GenericForm';

import useValidationSchemas from 'utils/validateSchema';
import { NewBundle, BundleData } from 'types/product';

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { OptionList } from 'types';

const getInitialValues = (plan: FormikValues | null) => {
  if (!plan) {
    return {
      id: 0,
      name: '',
      ticketPlan: '',
      productId: 0,
      type: 'airline',
      description: ''
    };
  }

  return {
    id: plan.id,
    name: plan.name,
    ticketPlan: plan.ticket_plan,
    productId: plan.product_id,
    type: 'airline',
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

const AddPackagesAirfare = ({ plan, onCancel, handleAdd, handleEdit, open, optionProduct }: Props) => {
  const intl = useIntl();
  const { BundleAirlineSchema } = useValidationSchemas();

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
      } else if (res.code === -1 && res.message === 'Sản phẩm đã tồn tại') {
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
    validationSchema: BundleAirlineSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true
  });

  useEffect(() => {
    formik.resetForm({ values: initialValues });
    //eslint-disable-next-line
  }, [plan, initialValues]);

  const fieldsWithOptions = bundleAirlineFields.map((field) => {
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

export default AddPackagesAirfare;
