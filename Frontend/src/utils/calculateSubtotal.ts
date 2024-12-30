// import { InvoiceDetailItem } from 'types/invoice';

export const calculateSubtotal = (itemList: any): number => {
  return itemList.reduce((acc: any, item: any) => {
    const quantity = item.quantity || 0;
    const price = parseFloat(item.price) || 0; // Ensure the price is treated as a number
    return acc + quantity * price;
  }, 0);
};
