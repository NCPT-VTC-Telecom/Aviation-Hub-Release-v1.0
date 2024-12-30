import { v4 as uuidv4 } from 'uuid';

export function handleAddRecord(newRecord: {}, data: any) {
  const newRecordHaveID = { id: uuidv4(), ...newRecord };
  return [...data, newRecordHaveID];
}

export function handleDeleteRecord(deleteRecord: any, data: any) {
  return data.filter((row: any) => row.id !== deleteRecord.id);
}

export function handleEdit(editedRecord: any, data: any) {
  const index = data.findIndex((item: any) => item.id === editedRecord.id);
  if (index !== -1) {
    const newData = [...data.slice(0, index), editedRecord, ...data.slice(index + 1)];
    return newData;
  }
}
