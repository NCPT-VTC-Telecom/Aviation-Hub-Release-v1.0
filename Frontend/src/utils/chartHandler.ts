//types
import { EndUser } from 'types/end-user';

interface ChartData {
  series: { name: string; data: number[] }[];
  categories: string[];
}

export function handleChartByDate(
  data: any[],
  groupByField: keyof EndUser,
  valueField: keyof EndUser,
  aggregateField: keyof EndUser
): ChartData {
  const aggregatedData: { [key: string]: { [key: string]: number } } = {};

  data.forEach((item) => {
    const key = String(item[groupByField]);
    const value = String(item[valueField]);
    if (!aggregatedData[key]) {
      aggregatedData[key] = {};
    }
    if (!aggregatedData[key][value]) {
      aggregatedData[key][value] = 0;
    }
    aggregatedData[key][value] += item[aggregateField];
  });

  const categories = Object.keys(aggregatedData).sort();
  const subcategories = Array.from(new Set(data.map((item) => String(item[valueField]))));

  const series = subcategories.map((sub) => ({
    name: sub,
    data: categories.map((cat) => aggregatedData[cat][sub] || 0)
  }));

  return { categories, series };
}

export function handleChartByDateCount(data: any[], groupByField: string, valueField: string): ChartData {
  const aggregatedData: { [key: string]: { [key: string]: number } } = {};

  data.forEach((item) => {
    const key = String(item[groupByField]);
    const value = String(item[valueField]);
    if (!aggregatedData[key]) {
      aggregatedData[key] = {};
    }
    if (!aggregatedData[key][value]) {
      aggregatedData[key][value] = 0;
    }
    aggregatedData[key][value]++;
  });

  const categories = Object.keys(aggregatedData).sort();
  const subcategories = Array.from(new Set(data.map((item) => String(item[valueField]))));

  const series = subcategories.map((sub) => ({
    name: sub,
    data: categories.map((cat) => aggregatedData[cat][sub] || 0)
  }));

  return { categories, series };
}

export function handleChartByType(data: any, groupByField: any, aggregateField: any): ChartData {
  const aggregatedData: { [key: string]: number } = {};

  data.forEach((item: any) => {
    const key = String(item[groupByField]);
    if (!aggregatedData[key]) {
      aggregatedData[key] = 0;
    }
    aggregatedData[key] += item[aggregateField];
  });

  const categories = Object.keys(aggregatedData).sort();
  const seriesData = categories.map((cat) => aggregatedData[cat]);

  return {
    categories,
    series: [
      {
        name: 'PAX Data Usage',
        data: seriesData
      }
    ]
  };
}

export function handleChartByTypeCount(data: any, groupByField: any, annotation: string): ChartData {
  const aggregatedData: { [key: string]: number } = {};

  data.forEach((item: any) => {
    const key = String(item[groupByField]);
    if (!aggregatedData[key]) {
      aggregatedData[key] = 0;
    }
    aggregatedData[key]++;
  });

  const categories = Object.keys(aggregatedData).sort();
  const seriesData = categories.map((cat) => aggregatedData[cat]);

  return {
    categories,
    series: [
      {
        name: annotation,
        data: seriesData
      }
    ]
  };
}
