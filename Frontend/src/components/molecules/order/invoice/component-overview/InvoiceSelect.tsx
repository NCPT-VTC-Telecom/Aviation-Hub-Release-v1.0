// ProductSelect.tsx
import React from 'react';
import { Select, MenuItem, FormControl, SelectChangeEvent } from '@mui/material';
import { FormattedMessage } from 'react-intl';

interface Product {
  value: number;
  label: string;
  price: number;
}

interface ProductSelectProps {
  productOptions: Product[];
  fullProductData: any;
  selectedProductId: number | '';
  onProductChange: (event: SelectChangeEvent<number>) => void;
  errors?: boolean;
}

const InvoiceSelect: React.FC<ProductSelectProps> = ({ productOptions, selectedProductId, onProductChange, fullProductData, errors }) => {
  const handleChange = (event: SelectChangeEvent<number>) => {
    const selectedId = event.target.value as number;
    const selectedProduct = fullProductData.find((p: any) => p.id === selectedId) || null;
    onProductChange(selectedProduct);
  };
  return (
    <FormControl fullWidth error={errors}>
      <Select labelId="product-select-label" id="product-select" value={selectedProductId} onChange={handleChange}>
        <MenuItem key={0} value={0} disabled>
          <FormattedMessage id="select-product" />
        </MenuItem>
        {productOptions.map((product, index) => (
          <MenuItem key={index} value={product.value}>
            {product.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default InvoiceSelect;
