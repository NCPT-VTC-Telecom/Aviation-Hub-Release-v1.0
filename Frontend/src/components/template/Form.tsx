import { useCallback, useEffect } from 'react';

//third-party
import { debounce } from 'lodash';

//project-import
import GenericForm from 'components/organisms/GenericForm';

//types
import { FieldConfig } from 'types';

export interface Props {
  title: string;
  onCancel: () => void;
  formik: any;
  fieldConfig: FieldConfig[];
  isEditMode: boolean;
  open: boolean;
}

const Form = ({ onCancel, formik, title, fieldConfig, isEditMode, open }: Props) => {
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
    formik.resetForm({ values: formik.initialValues });
    //eslint-disable-next-line
  }, [formik.initialValues]);

  return <GenericForm onCancel={onCancel} title={title} isEditMode={isEditMode} fields={fieldConfig} formik={formik} open={open} />;
};

export default Form;
