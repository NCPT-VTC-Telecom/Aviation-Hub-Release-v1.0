import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
//utils
import { downloadFile } from 'utils/handleData';
import axios from 'utils/axios';
import { API_PATH_HANDLE_EXCEL } from 'utils/constant';
//third-party
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const accessToken = cookies.get('accessToken');

// Define async thunks
export const importExcel = createAsyncThunk(
  'excel/import',
  async (
    {
      type,
      data,
      typeSupplier = null,
      typeProduct = null,
      groupId = null
    }: {
      type: string;
      data: any[];
      typeSupplier?: string | null;
      typeProduct?: string | null;
      groupId?: number[] | null;
    },
    { getState }
  ) => {
    const response = await axios.post(
      `${API_PATH_HANDLE_EXCEL.importExcel}`,
      { dataImportExcel: data },
      { headers: { Authorization: `${accessToken}` }, params: { type, typeSupplier, typeProduct, groupId } }
    );
    return response.data;
  }
);

export const exportExcel = createAsyncThunk(
  'excel/export',
  async (
    {
      type,
      typeSupplier = null,
      typeProduct = null,
      groupId = null
    }: {
      type: string;
      typeSupplier?: string | null;
      typeProduct?: string | null;
      groupId?: number[] | null;
    },
    { getState }
  ) => {
    const response = await axios.get(`${API_PATH_HANDLE_EXCEL.exportExcel}`, {
      headers: { Authorization: `${accessToken}` },
      responseType: 'blob',
      params: { type }
    });
    downloadFile(new Blob([response.data]), `data_${type}.xlsx`);
    return response.data;
  }
);

export const getFormatExcel = createAsyncThunk(
  'excel/getFormat',
  async (
    {
      type,
      typeSupplier = null,
      typeProduct = null,
      groupId = null
    }: {
      type: string;
      typeSupplier?: string | null;
      typeProduct?: string | null;
      groupId?: number[] | null;
    },
    { getState }
  ) => {
    const response = await axios.get(`${API_PATH_HANDLE_EXCEL.exportExcelBlank}`, {
      headers: { Authorization: `${accessToken}` },
      responseType: 'blob',
      params: { type }
    });
    downloadFile(new Blob([response.data]), `data_${type}_blank.xlsx`);
    return response.data;
  }
);

const excelSlice = createSlice({
  name: 'excel',
  initialState: {
    loading: false,
    error: null as string | null | undefined
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(importExcel.pending, (state) => {
        state.loading = true;
      })
      .addCase(importExcel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(importExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(exportExcel.pending, (state) => {
        state.loading = true;
      })
      .addCase(exportExcel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getFormatExcel.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFormatExcel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getFormatExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default excelSlice.reducer;
