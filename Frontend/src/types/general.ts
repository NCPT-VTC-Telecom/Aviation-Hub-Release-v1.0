export interface OptionList {
  label: string;
  value: number | string;
  secondaryLabel?: string;
  subPrimaryLabel?: string;
}

//Filter
export interface FilterItem {
  id: string;
  optionList: OptionList[];
}

export interface FiltersConfig {
  id: string;
  haveDatePicker: boolean;
  filterItem: FilterItem[];
}

export interface ChartData {
  series: { name: string; data: number[] }[];
  categories: string[];
}

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'date' | 'number' | 'checkbox' | 'categories' | 'RangeDatePicker';
  placeholder?: string;
  options?: OptionList[]; // Only for select fields
  required?: boolean;
  unit?: string;
  md?: number; // Grid size
  row?: number; // For text area
  future?: boolean;
  past?: boolean;
  readOnly?: boolean;
  startDate?: string;
  endDate?: string;
  secondField?: string;
}
