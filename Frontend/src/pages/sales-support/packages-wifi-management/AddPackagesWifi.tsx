import { useMemo, useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { FormikValues, useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import { debounce } from 'lodash';

import { planFields } from 'components/ul-config/form-config';
import GenericForm from 'components/organisms/GenericForm';

import { formatDateToSV, adjustDateForTimezone } from 'utils/handleData';
import useValidationSchemas from 'utils/validateSchema';
import { NewProduct, ProductData } from 'types/product';

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const getInitialValues = (plan: FormikValues | null) => {
  if (!plan) {
    return {
      id: 0,
      imageLink: '',
      title: '',
      description: '',
      type: 'product',
      totalTime: 0,
      bandwidthUpload: 0,
      bandwidthDownload: 0,
      dataTotal: 0,
      dataUpload: 0,
      dataDownload: 0,
      dataPrice: {
        originalPrice: 0,
        newPrice: 0,
        currency: 'VND',
        startDate: null,
        endDate: null
      }
    };
  }

  const startDate = formatDateToSV(plan.price.start_date);
  const endDate = formatDateToSV(plan.price.end_date);

  return {
    id: plan.id,
    imageLink: plan.image_link,
    title: plan.title,
    description: plan.description,
    type: 'product',
    totalTime: plan.total_time,
    bandwidthUpload: plan.bandwidth_upload,
    bandwidthDownload: plan.bandwidth_download,
    dataTotal: plan.data_total,
    dataUpload: plan.data_upload,
    dataDownload: plan.data_download,
    dataPrice: {
      originalPrice: plan.price.original_price,
      newPrice: plan.price.new_price,
      currency: plan.price.currency,
      startDate: startDate ? adjustDateForTimezone(startDate) : null,
      endDate: endDate ? adjustDateForTimezone(endDate) : null
    }
  };
};

export interface Props {
  plan: ProductData | null;
  onCancel: () => void;
  handleAdd: (values: NewProduct) => void;
  handleEdit: (values: NewProduct) => void;
  open: boolean;
}

const AddPackagesWifi = ({ plan, onCancel, handleAdd, handleEdit, open }: Props) => {
  const intl = useIntl();
  const { PlanSchema } = useValidationSchemas();

  const initialValues: FormikValues = useMemo(() => getInitialValues(plan), [plan]);

  const handleSubmit = async (values: FormikValues, actions: any) => {
    try {
      const actionsFn = plan ? handleEdit : handleAdd;
      const res: any = await actionsFn(values as NewProduct);

      if (res && res.code === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: plan ? intl.formatMessage({ id: 'plan-update-successfully' }) : intl.formatMessage({ id: 'plan-add-successfully' }),
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        actions.setSubmitting(false);
        onCancel();
      } else if (res.code === -1 && res.message === 'Sản phẩm wifi đã tồn tại') {
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
    validationSchema: PlanSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true
  });

  //eslint-disable-next-line
  const calculateDataTotal = useCallback(
    debounce(() => {
      const dataUpload = Number(formik.values.dataUpload) || 0;
      const dataDownload = Number(formik.values.dataDownload) || 0;
      const dataTotal = dataUpload + dataDownload;

      if (formik.values.dataTotal !== dataTotal) {
        formik.setFieldValue('dataTotal', dataTotal);
      }
    }, 1500),
    [formik.values.dataUpload, formik.values.dataDownload, formik.values.dataTotal]
  );

  useEffect(() => {
    calculateDataTotal();
    return () => calculateDataTotal.cancel();
  }, [formik.values.dataUpload, formik.values.dataDownload, calculateDataTotal]);

  useEffect(() => {
    formik.resetForm({ values: initialValues });
    //eslint-disable-next-line
  }, [plan, initialValues]);

  const fieldsWithOptions = planFields.map((field) => {
    if (field.name === 'type') {
      return { ...field, options: arrayTypePlan };
    }
    return field;
  });

  return (
    <GenericForm
      onCancel={onCancel}
      title={plan ? intl.formatMessage({ id: 'edit-plan' }) : intl.formatMessage({ id: 'new-plan' })}
      isEditMode={!!plan}
      fields={fieldsWithOptions}
      formik={formik}
      open={open}
    />
  );
};

export default AddPackagesWifi;

const arrayTypePlan = [
  { label: 'Basic', value: 'Basic' },
  { label: 'Chat', value: 'Chat' },
  { label: 'Premium', value: 'Premium' }
];
