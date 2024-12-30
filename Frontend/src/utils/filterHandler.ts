import moment from 'moment';
// import { FilterSessionPerformance } from 'types/filter';

export const filterRecordsByDateRange = (records: any, startDate: Date, endDate: Date): any => {
  return records.filter((record: any) => {
    const recordDate = new Date(record.date_used);
    return recordDate >= startDate && recordDate <= endDate;
  });
};

export function filterAircraftData(data: any, filterValue: any) {
  if (!filterValue) {
    return data;
  }

  return data.filter((item: any) => {
    let passFilter = true;

    if (filterValue['aircraft_type'] && filterValue['aircraft_type'] !== 'all') {
      passFilter = passFilter && item['aircraft_type'] === filterValue['aircraft_type'];
    }

    if (filterValue['tail_number'] && filterValue['tail_number'] !== 'all') {
      passFilter = passFilter && item['tail_number'] === filterValue['tail_number'];
    }

    if (filterValue['flight_phase'] && filterValue['flight_phase'] !== 'all') {
      passFilter = passFilter && item['flight_phase'] === filterValue['flight_phase'];
    }

    if (filterValue['ifc_status'] && filterValue['ifc_status'] !== 'all') {
      passFilter = passFilter && item['ifc_status'] === filterValue['ifc_status'];
    }

    return passFilter;
  });
}

export function filterDataByDate(data: any[], startDate?: string, endDate?: string) {
  const start = startDate ? moment(startDate, 'YYYY/MM/DD') : null;
  const end = endDate ? moment(endDate, 'YYYY/MM/DD') : null;

  return data.filter((session) => {
    const sessionDate = moment(session.date, 'YYYY/MM/DD');
    return sessionDate.isBetween(start, end, 'days', '[]');
  });
}
