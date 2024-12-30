import { useEffect } from 'react';
//third-party
import vn from 'date-fns/locale/vi';
import { addDays as addDaysFn, format } from 'date-fns';
import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import * as CryptoJS from 'crypto-js';

//types
import { NewRole } from 'types/end-user';
import { OptionList } from 'types/general';

let lang = 'en';

interface ChartData {
  categories: string[];
  series: { name: string; data: number[] }[];
}

export function useLangUpdate(i18n: string) {
  useEffect(() => {
    lang = i18n;
  }, [i18n]);
}

export const addDays = (date: string, days: number): string => {
  const result = addDaysFn(new Date(date), days);
  return format(result, 'yyyy/MM/dd'); // Định dạng ngày tháng theo kiểu YYYY/MM/DD
};

export function getInitialDate(setFilter: any, filter: {}) {
  const now = moment();
  const fifteenDaysAgo = moment().subtract(14, 'days');
  const filterValue = filter;
  setFilter({
    ...filterValue,
    start_date: fifteenDaysAgo.format('YYYY/MM/DD'),
    end_date: now.format('YYYY/MM/DD')
  });
}

export function getStartOfMonth(date = new Date()) {
  const startOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return {
    start_of_current_month: formatDate(startOfCurrentMonth),
    current_date: addDays(formatDate(date), 1)
  };
}

function extractAirportCode(airportName: string): string {
  const match = airportName.match(/\(([^)]+)\)/);
  return match ? match[1].split(' /')[0] : airportName;
}

export function getRouteHistory(array: any[]) {
  return array.map((item: any) => {
    let route: string;
    if ('departure_airport' in item && 'arrival_airport' in item) {
      // Handle direct flight data by extracting airport codes
      const departureCode = extractAirportCode(item.departure_airport);
      const arrivalCode = extractAirportCode(item.arrival_airport);
      route = departureCode + ' - ' + arrivalCode;
    } else if (
      'flight' in item &&
      item.flight != null && // Ensure flight is not null
      'departure_airport' in item.flight &&
      'arrival_airport' in item.flight
    ) {
      // Handle nested flight data within an order by extracting airport codes
      const departureCode = extractAirportCode(item.flight.departure_airport);
      const arrivalCode = extractAirportCode(item.flight.arrival_airport);
      route = departureCode + ' - ' + arrivalCode;
    } else {
      // Fallback if no recognized structure is found
      route = 'Route not available';
    }

    return { ...item, route: route };
  });
}

export function getTailModel(array: any[]) {
  return array.map((item: any) => {
    let tailModel: string = 'not available';

    if (item.tail_number && item.model) {
      tailModel = item.tail_number + ' - ' + item.model;
    } else if (item.aircraft && item.aircraft.tail_number && item.aircraft.model) {
      tailModel = item.aircraft.tail_number + ' - ' + item.aircraft.model;
    }

    return { ...item, tail_model: tailModel };
  });
}

export function getTimeFlight(array: any[]) {
  return array.map((item: any) => {
    // Determine if the item is a flight or contains a flight

    let flightTimes: string;
    if ('departure_time' in item && 'arrival_time' in item) {
      // Handle direct flight data
      flightTimes = item.departure_time + '  -  ' + item.arrival_time;
    } else if ('flight' in item && 'departure_time' in item.flight && 'arrival_time' in item.flight) {
      // Handle nested flight data within an order
      flightTimes = item.departure_time + '  -  ' + item.arrival_time;
    } else {
      // Fallback if no recognized structure is found
      flightTimes = 'Time not available';
    }
    return { ...item, flight_times: flightTimes };
  });
}

export function getTimeSession(array: any[]) {
  return array.map((item: any) => {
    let sessionTime: string;
    if ('start_time' in item && 'stop_time' in item) {
      sessionTime = item.start_time + '  -  ' + item.stop_time;
    } else if ('session' in item && 'start_time' in item.session && 'stop_time' in item.session) {
      sessionTime = item.session.start_time + '  -  ' + item.session.stop_time;
    } else {
      sessionTime = 'Time not available';
    }
    return { ...item, session_times: sessionTime };
  });
}

function transformDates(array: any[], keysToFormat: string[], dateFormat: { vi: string; en: string }) {
  return array.map((item) => {
    const newItem = { ...item };
    keysToFormat.forEach((keyPath) => {
      const keyParts = keyPath.split('.');
      let dateHolder: any = newItem;
      let lastKey = keyParts.pop()!; // Assume last key is always valid

      // Navigate to the last key's parent object if nested
      for (const part of keyParts) {
        if (dateHolder[part] === null || dateHolder[part] === undefined) {
          // If any part is null or undefined, skip formatting for this keyPath
          return;
        }
        if (dateHolder[part] === undefined) {
          dateHolder[part] = {}; // Optionally create a nested structure if it doesn't exist
        }
        dateHolder = dateHolder[part];
      }

      // Format the date if it exists and is not an empty string
      if (dateHolder[lastKey] && dateHolder[lastKey] !== '') {
        const date = new Date(dateHolder[lastKey]);
        const formattedDate = lang === 'vi' ? format(date, dateFormat.vi, { locale: vn }) : format(date, dateFormat.en);
        dateHolder[lastKey] = formattedDate;
      }
    });
    return newItem;
  });
}
export function formatDateTime(array: any[], keysToFormat: string[]) {
  const dateFormat = {
    vi: 'dd/MM/yyyy, HH:mm',
    en: 'MM/dd/yyyy, HH:mm'
  };
  return transformDates(array, keysToFormat, dateFormat);
}

export function formatDate(array: any[], keysToFormat: string[]) {
  const dateFormat = {
    vi: 'dd/MM/yyyy',
    en: 'MM/dd/yyyy'
  };
  return transformDates(array, keysToFormat, dateFormat);
}

export const formatYear = (dateString: string | null) => {
  if (!dateString) return null; // Kiểm tra nếu không có giá trị ngày, trả về null
  const date = new Date(dateString);
  return date.getFullYear().toString(); // Trả về năm dưới dạng chuỗi
};

export function formatTime(array: any[], keysToFormat: string[]) {
  const dateFormat = {
    en: 'HH:mm',
    vi: 'HH:mm'
  };
  return transformDates(array, keysToFormat, dateFormat);
}

export const getOption = (
  data: any[],
  labelPath: string,
  valuePath: string,
  secondaryLabelPath?: string,
  subPrimaryLabelPath?: string
): OptionList[] => {
  // Hàm trợ giúp để lấy giá trị từ một đối tượng dựa trên đường dẫn (chuỗi đường dẫn như 'aircraft.flight_number')
  const getValueFromPath = (item: any, path: string): any => {
    const keys = path.split('.');
    let result = item;
    for (let key of keys) {
      if (result && key in result) {
        result = result[key];
      } else {
        return undefined; // Trả về undefined nếu không tìm thấy đường dẫn
      }
    }
    return result;
  };

  return data.map((item) => {
    const label = getValueFromPath(item, labelPath);
    const value = getValueFromPath(item, valuePath);
    let secondaryLabel;
    let subPrimaryLabel;

    if (secondaryLabelPath) {
      secondaryLabel = getValueFromPath(item, secondaryLabelPath);
    }

    if (subPrimaryLabelPath) {
      subPrimaryLabel = getValueFromPath(item, subPrimaryLabelPath);
    }

    const result: OptionList = {
      label: label !== undefined ? label : 'Unknown',
      value: value !== undefined ? value : undefined,
      secondaryLabel: secondaryLabel,
      subPrimaryLabel: subPrimaryLabel
    };

    return result;
  });
};

export const modifyPermissions = (data: NewRole) => {
  return {
    ...data,
    permission: `[${data.permission.map((p: any) => `"${data.title}_${p}"`)}]`
  };
};

export function formatDateToSV(date: string | null | undefined) {
  if (date && date !== 'Invalid date') {
    return moment(date, ['MM/DD/YYYY', 'DD/MM/YYYY']).format('YYYY/MM/DD');
  } else {
    return null;
  }
}

export const adjustDateForTimezone = (date: Date | null | string) => {
  if (date) {
    const dateInput = new Date(date);
    const localDate = new Date(date);
    localDate.setMinutes(dateInput.getMinutes() - dateInput.getTimezoneOffset());
    return new Date(localDate.toISOString());
  } else {
    return null;
  }
};

export const limitTextToWords = (text: string | null, charLimit: number): string => {
  if (!text) return '';

  // Trim text to remove unnecessary white spaces
  const trimmedText = text.trim();
  if (!trimmedText) return '';

  if (trimmedText.length > charLimit) {
    return trimmedText.substring(0, charLimit) + '...';
  }
  return trimmedText;
};

export function excelSerialDateToDate(serial: number) {
  const excelEpoch = new Date(1899, 11, 30); // Ngày 30 tháng 12 năm 1899
  const excelEpochAsUnixTimestamp = excelEpoch.getTime();
  const missingLeapYearDay = 24 * 60 * 60 * 1000;
  const delta = excelEpochAsUnixTimestamp - missingLeapYearDay;
  const excelSerialDayAsUnixTimestamp = serial * 24 * 60 * 60 * 1000;

  return new Date(delta + excelSerialDayAsUnixTimestamp);
}

export function downloadFile(blob: Blob, filename: string) {
  const fileURL = window.URL.createObjectURL(blob);
  const fileLink = document.createElement('a');
  fileLink.href = fileURL;
  fileLink.setAttribute('download', filename);
  document.body.appendChild(fileLink);
  fileLink.click();
  document.body.removeChild(fileLink);
  window.URL.revokeObjectURL(fileURL);
}

export function formatDataUsage(dataUsage: number): string {
  const GB = 1024;
  const TB = GB * 1024;
  const PB = TB * 1024;

  if (dataUsage < GB) {
    return `${dataUsage.toFixed(2)} MB`; // Keep as MB if below 1 GB
  } else if (dataUsage < TB) {
    return `${(dataUsage / GB).toFixed(2)} GB`; // Convert to GB
  } else if (dataUsage < PB) {
    return `${(dataUsage / TB).toFixed(2)} TB`; // Convert to TB
  } else {
    return `${(dataUsage / PB).toFixed(2)} PB`; // Convert to PB
  }
}

export function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((current: any, key: string) => {
    return current ? current[key] : undefined;
  }, obj);
}

dayjs.extend(customParseFormat);

export const formatChartData = (chartData: ChartData, format: string): ChartData => {
  return {
    ...chartData,
    categories: chartData.categories.map((date) => {
      const parsedDate = dayjs(date, ['DD/MM/YYYY', 'YYYY-MM-DD'], true);
      return parsedDate.isValid() ? parsedDate.format(format) : 'Invalid Date';
    })
  };
};

export const decryptSessionStorage = () => {
  const accessPermission = sessionStorage.getItem('accessPermission');
  if (!accessPermission) return null;

  const decrypted = CryptoJS.AES.decrypt(accessPermission, process.env.REACT_APP_SECRET_KEY as string);
  const originalMessage = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(originalMessage);
};
