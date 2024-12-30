import { ReactNode } from 'react';
import { OptionList } from './general';

export interface AttributesPropsInputField {
  name: string;
  field: string;
  placeholder: string;
  formik: any;
  inputLabel?: ReactNode | string;
  required?: boolean;
  disable?: boolean;
  spacing?: number;
  readOnly?: boolean;
  type?: string;
  unit?: string | ReactNode;
  row?: number;
  xs?: number;
  sm?: number;
  md?: number;
}

export interface AttributesPropsSelectField {
  name: string;
  field: string;
  placeholder: string;
  formik: any;
  arrayOption: OptionList[];
  noOptionText?: string;
  required?: boolean;
  readOnly?: boolean;
  subPrimaryLabel?: string | null;
  secondaryLabel?: string | null;
  inputLabel?: ReactNode | string;
  spacing?: number;
  xs?: number;
  sm?: number;
  md?: number;
}

export interface AttributesPropsAutocompleteField extends AttributesPropsSelectField {}

export interface AttributesPropsSelectCheckmark extends AttributesPropsSelectField {
  subOptions?: OptionList[];
}

export interface AttributesPropsDatePickerField {
  name: string;
  field: string;
  formik: any;
  inputLabel: ReactNode | string;
  required?: boolean;
  onlyPast?: boolean;
  onlyYear?: boolean;
  onlyFuture?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  startDate?: string;
}

export interface AttributesPropsRangePicker extends AttributesPropsDatePickerField {
  secondField: string;
}

export interface AttributesPropsFieldView {
  name: string;
  field: any;
  xs?: number;
  sm?: number;
  md?: number;
}

export interface AttributesPropsChipView {
  name: string | ReactNode;
  id: number;
  successLabel: string;
  errorLabel: string;
  warningLabel?: string;
  xs?: number;
  sm?: number;
  md?: number;
}

export interface AttributesPropsCheckbox {
  name: string;
  field: string;
  formik: any;
  arrayOption: any[];
  inputLabel: ReactNode | string;
  required?: boolean;
  xsCheckBox?: number;
  mdCheckBox?: number;
  xs?: number;
  sm?: number;
  md?: number;
  handleBlur?: () => void;
}

export interface AttributesPropsDetailRow {
  name: string | ReactNode;
  field: any;
  xs?: number;
  sm?: number;
  md?: number;
}
