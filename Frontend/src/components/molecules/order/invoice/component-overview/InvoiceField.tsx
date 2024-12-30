import React from 'react';
import { TextField, FormHelperText } from '@mui/material';
import { getIn } from 'formik'; // Thường được sử dụng với Formik để truy cập giá trị theo đường dẫn

const InvoiceField = React.memo(({ onEditItem, onBlur, cellData, formik }: any) => {
  // Trích xuất lỗi và trạng thái touched từ formik dựa trên 'name' của field
  const error = getIn(formik.errors, cellData.name);
  const touched = getIn(formik.touched, cellData.name);

  return (
    <div>
      <TextField
        sx={{
          lineHeight: '24px'
        }}
        type={cellData.type}
        placeholder={cellData.placeholder}
        name={cellData.name}
        id={cellData.id}
        value={cellData.type === 'number' ? (cellData.value > 0 ? cellData.value.toLocaleString('vi-VN') : '') : cellData.value}
        onChange={onEditItem}
        onBlur={onBlur}
        label={cellData.label}
        error={Boolean(touched && error)}
        helperText={touched && error ? error : ''}
        InputProps={{
          readOnly: cellData.readOnly
        }}
        disabled={cellData.disable}
      />
      {/* Thêm FormHelperText để hiển thị thông báo lỗi nếu có */}
      {touched && error && <FormHelperText error>{error}</FormHelperText>}
    </div>
  );
});

export default InvoiceField;
