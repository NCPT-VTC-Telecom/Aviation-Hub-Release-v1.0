import React, { useEffect, useState, useCallback } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  Box,
  Button,
  Stack,
  TableCell,
  Tooltip,
  Typography,
  FormHelperText,
  TextField,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { dispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import InvoiceSelect from './InvoiceSelect';
import AlertProductDelete from './AlertProductDelete';
// import { useTheme } from '@mui/material/styles';
// import { ThemeMode } from 'types/config';
import { Trash } from 'iconsax-react';
import { SelectChangeEvent } from '@mui/material';
import { OptionList } from 'types/general';
import { getProduct } from 'pages/service-management/order/create-order/model';
import { getOption } from 'utils/handleData';
import { debounce } from 'lodash';

const InvoiceItem = ({
  id,
  name,
  quantity,
  price,
  onDeleteItem,
  onEditItem,
  index,
  Blur,
  errors,
  touched,
  getTypeProduct,
  typeProductOptions
}: any) => {
  const intl = useIntl();
  // const theme = useTheme();
  // const mode = theme.palette.mode;
  const { country } = useSelector((state) => state.invoice);

  const [selectedType, setSelectedType] = useState<any>();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productOptions, setProductOptions] = useState<any[]>([]);
  const [productData, setProductData] = useState<any>();

  const [open, setOpen] = useState(false);

  const handleModalClose = (status: boolean) => {
    setOpen(false);
    if (status) {
      onDeleteItem(index);
      dispatch(
        openSnackbar({
          open: true,
          message: intl.formatMessage({ id: 'product-deleted-successfully' }),
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
    }
  };

  const handleTypeChange = async (event: SelectChangeEvent<any>) => {
    const selectedValue = event.target.value;
    const type = typeProductOptions.find((option: OptionList) => option.value === selectedValue) || null;

    setSelectedType(type);

    if (type) {
      onEditItem({ target: { name: `itemList.${index}.type`, value: type.value } } as React.ChangeEvent<HTMLInputElement>);
      const newProductOptions = await getProduct(type.value);
      setProductOptions(getOption(newProductOptions.data, 'title', 'id'));
    }
  };

  const handleProductChange = (product: any | null) => {
    setSelectedProduct(product);

    if (product) {
      onEditItem({ target: { name: `itemList.${index}.price`, value: product.price.new_price } } as React.ChangeEvent<HTMLInputElement>);
      onEditItem({ target: { name: `itemList.${index}.name`, value: product.title } } as React.ChangeEvent<HTMLInputElement>);
      onEditItem({ target: { name: `itemList.${index}.productId`, value: product.id } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const getProductInfo = async (type: string) => {
    try {
      const res = await getProduct(type);
      setProductOptions(getOption(res.data, 'title', 'id'));
      setProductData(res.data);
    } catch {}
  };

  useEffect(() => {
    if (selectedType) {
      getProductInfo(selectedType.value);
    }
  }, [selectedType]);

  //eslint-disable-next-line
  const debouncedOnEditItem = useCallback(debounce(onEditItem, 800), []);

  return (
    <>
      <TableCell>
        <FormControl fullWidth error={Boolean(touched.itemList?.[index]?.type && errors.itemList?.[index]?.type)}>
          <Select
            sx={{ display: 'flex', alignItems: 'center' }}
            labelId="type-select-label"
            id="type-select"
            value={selectedType?.value || ''}
            onChange={handleTypeChange}
          >
            <MenuItem key={0} value={''} disabled>
              <FormattedMessage id="select-type-product" />
            </MenuItem>
            {typeProductOptions.map((type: OptionList, idx: number) => (
              <MenuItem key={idx} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box minHeight="24px">
          {touched.itemList && errors.itemList && errors.itemList[index]?.type && (
            <FormHelperText error>{errors.itemList[index].type}</FormHelperText>
          )}
        </Box>
      </TableCell>

      <TableCell>
        <InvoiceSelect
          key={'product-name-input'}
          fullProductData={productData}
          productOptions={productOptions}
          selectedProductId={selectedProduct?.id || ''}
          onProductChange={handleProductChange}
          errors={touched.itemList && !!errors.itemList && !!errors.itemList[index]?.productId}
        />
        <Box minHeight="24px">
          {touched.itemList && errors.itemList && errors.itemList[index]?.productId && (
            <FormHelperText error>{errors.itemList[index].productId}</FormHelperText>
          )}
        </Box>
      </TableCell>

      <TableCell>
        <TextField
          sx={{ textAlign: 'center', lineHeight: '24px' }}
          placeholder={intl.formatMessage({ id: 'enter-quantity' })}
          type="number"
          name={`itemList.${index}.quantity`}
          value={quantity}
          onChange={(e) => debouncedOnEditItem(e)}
          onBlur={Blur}
          error={Boolean(touched.itemList?.[index]?.quantity && errors.itemList?.[index]?.quantity)}
        />
        <Box minHeight="24px">
          {touched.itemList && errors.itemList && errors.itemList[index]?.quantity && (
            <FormHelperText error>{errors.itemList[index].quantity}</FormHelperText>
          )}
        </Box>
      </TableCell>

      <TableCell>
        <TextField
          sx={{ textAlign: 'center', lineHeight: '24px' }}
          type="number"
          name={`itemList.${index}.price`}
          value={price.toLocaleString('vi-VN')}
          onChange={onEditItem}
          onBlur={Blur}
          InputProps={{ readOnly: true }}
          error={Boolean(touched.itemList?.[index]?.price && errors.itemList?.[index]?.price)}
        />
        <Box minHeight="24px">
          {touched.itemList && errors.itemList && errors.itemList[index]?.price && (
            <FormHelperText error>{errors.itemList[index].price}</FormHelperText>
          )}
        </Box>
      </TableCell>

      <TableCell>
        <Stack direction="column" justifyContent="flex-end" alignItems="flex-end" spacing={2}>
          <Box sx={{ pr: 2, pl: 2 }}>
            <Typography>
              {country?.code === 'VN'
                ? `${(price * quantity).toLocaleString('vi-VN')} ${country?.prefix}`
                : `${country?.prefix}${(price * quantity).toFixed(2)}`}
            </Typography>
          </Box>
        </Stack>
      </TableCell>

      <TableCell>
        <Tooltip title={intl.formatMessage({ id: 'remove-product' })}>
          <Button color="error" onClick={() => setOpen(true)}>
            <Trash />
          </Button>
        </Tooltip>
      </TableCell>

      <AlertProductDelete title={name} open={open} handleClose={handleModalClose} />
    </>
  );
};

export default InvoiceItem;
