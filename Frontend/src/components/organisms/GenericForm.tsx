import React, { useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

//project-import
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Typography } from '@mui/material';
import { InputField, SelectField, CheckboxField, DatePickerField, RangeDatePickerField } from 'components/molecules/form';

//third-party
import { Form, FormikProvider } from 'formik';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

//types
import { FieldConfig } from 'types';

interface GenericFormProps {
  onCancel: () => void;
  title: string;
  isEditMode: boolean;
  fields: FieldConfig[];
  formik: any;
  children?: React.ReactNode;
  open: boolean;
}

const GenericForm: React.FC<GenericFormProps> = ({ onCancel, title, isEditMode, fields, formik, children, open }) => {
  const intl = useIntl();

  const { handleSubmit, isSubmitting, setValues, resetForm } = formik;

  useEffect(() => {
    resetForm();
    setValues(formik.initialValues);
    //eslint-disable-next-line
  }, [formik.initialValues, open]);

  const renderField = (field: FieldConfig) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <InputField
            key={field.name}
            name={field.name}
            inputLabel={intl.formatMessage({ id: field.label })}
            field={field.name}
            placeholder={intl.formatMessage({ id: field.placeholder || ' ' })}
            formik={formik}
            md={field.md}
            type={field.type ? field.type : 'text'}
            row={field.row ? field.row : 1}
            unit={field.unit ? intl.formatMessage({ id: field.unit, defaultMessage: 'unknown' }) : ' '}
            readOnly={field.readOnly}
            required={field.required}
          />
        );
      case 'select':
        return (
          <SelectField
            key={field.name}
            name={field.name}
            inputLabel={intl.formatMessage({ id: field.label })}
            field={field.name}
            arrayOption={field.options || []}
            formik={formik}
            placeholder={intl.formatMessage({ id: field.placeholder || ' ' })}
            md={field.md}
            required={field.required}
          />
        );
      case 'date':
        return (
          <DatePickerField
            key={field.name}
            name={field.name}
            inputLabel={intl.formatMessage({ id: field.label })}
            field={field.name}
            formik={formik}
            md={field.md}
            onlyFuture={field.future ? true : false}
            onlyPast={field.past ? true : false}
            required={field.required}
          />
        );
      case 'categories':
        return (
          <Grid item md={field.md} key={field.label}>
            <Typography variant="h5" component="div" sx={{ mb: 0.5 }}>
              <FormattedMessage id={field.name} />
            </Typography>
          </Grid>
        );
      case 'checkbox':
        return (
          <CheckboxField
            key={field.name}
            name={field.name}
            inputLabel={intl.formatMessage({ id: field.label })}
            field={field.name}
            formik={formik}
            required={field.required}
            arrayOption={field.options || []}
            md={field.md}
          />
        );
      case 'RangeDatePicker':
        return (
          <RangeDatePickerField
            key={field.name}
            md={field.md}
            name={field.name}
            inputLabel={intl.formatMessage({ id: field.label })}
            field={field.name}
            secondField={field.secondField || ''}
            formik={formik}
            required={field.required}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormikProvider value={formik}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle className="text-base">{title}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={1}></Grid>
              <Grid item xs={10}>
                <Grid container spacing={3}>
                  {fields.map((field) => renderField(field))}
                  {children}
                </Grid>
              </Grid>
              <Grid item xs={1}></Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Grid container justifyContent="flex-end" alignItems="center">
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="flex-end">
                  <Button aria-hidden={false} color="error" onClick={onCancel} disabled={isSubmitting}>
                    <FormattedMessage id="cancel" />
                  </Button>
                  <Button aria-hidden={false} type="submit" variant="contained" disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={24} /> : <FormattedMessage id={isEditMode ? 'edit' : 'confirm'} />}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        </Form>
      </LocalizationProvider>
    </FormikProvider>
  );
};

export default GenericForm;
