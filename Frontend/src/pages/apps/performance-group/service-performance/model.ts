export const chartConfigSLA = {
  chart: {
    type: 'bar',
    height: 350,
    stacked: true,
    stackType: '100%'
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 1,
    colors: ['transparent']
  },
  yaxis: {
    labels: {
      formatter: (val: any) => {
        return `${val} %`;
      }
    },
    title: {
      text: 'Availability'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter(val: number) {
        return `${val} %`;
      }
    }
  },
  legend: {
    show: true,
    fontFamily: `Inter var`,
    position: 'bottom',
    offsetX: 10,
    offsetY: 10,
    labels: {
      useSeriesColors: false
    },
    markers: {
      width: 16,
      height: 16,
      radius: 5
    },
    itemMargin: {
      horizontal: 15,
      vertical: 8
    }
  }
};

export const chartConfigBandwidth = {
  chart: {
    type: 'bar',
    height: 350,
    stacked: true,
    stackType: '100%'
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {},
  yaxis: {
    labels: {
      formatter: (val: number) => {
        return val + '%';
      }
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter(val: number) {
        return `${val} %`;
      }
    }
  },
  legend: {
    show: true,
    fontFamily: `Inter var`,
    position: 'bottom',
    offsetX: 10,
    offsetY: 10,
    labels: {
      useSeriesColors: false
    },
    markers: {
      width: 16,
      height: 16,
      radius: 5
    },
    itemMargin: {
      horizontal: 15,
      vertical: 8
    }
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        yaxis: {
          show: false
        }
      }
    }
  ]
};

export const chartAvailability = {
  en: {
    series: [
      {
        data: [4, 4, 6, 8, 9, 5, 4, 7, 7, 6, 6, 9, 8, 8, 10, 13],
        name: 'PAX Service availability'
      },
      {
        data: [4, 7, 9, 3, 1, 2, 4, 6, 8, 8, 2, 1, 1, 3, 1, 1],
        name: 'Regulatory restrictions'
      },
      {
        data: [3, 1, 5, 4, 1, 1, 9, 7, 6, 4, 2, 9, 7, 6, 5, 5],
        name: 'Scheduled maintenance'
      },
      {
        data: [2, 1, 1, 4, 8, 7, 3, 2, 2, 1, 6, 7, 9, 4, 4, 1],
        name: 'Crew handling'
      },
      {
        data: [1, 1, 0, 3, 2, 4, 0, 0, 5, 1, 2, 2, 4, 5, 2, 1],
        name: 'Structural blockage'
      },
      {
        data: [5, 3, 4, 1, 9, 6, 1, 2, 2, 4, 3, 4, 6, 2, 1, 1],
        name: 'Satellite handovers and out of coverage'
      }
    ],
    categories: [
      '4. Mar',
      '6. Mar',
      '8. Mar',
      '10. Mar',
      '12. Mar',
      '14. Mar',
      '16. Mar',
      '18. Mar',
      '20. Mar',
      '22. Mar',
      '24. Mar',
      '26. Mar',
      '28. Mar',
      '30. Mar',
      '1. Apr',
      '3. Apr'
    ]
  },
  vi: {
    series: [
      {
        data: [4, 4, 6, 8, 9, 5, 4, 7, 7, 6, 6, 9, 8, 8, 10, 13],
        name: 'Mức độ khả dụng dịch vụ PAX'
      },
      {
        data: [4, 7, 9, 3, 1, 2, 4, 6, 8, 8, 2, 1, 1, 3, 1, 1],
        name: 'Hạn chế về quy định'
      },
      {
        data: [3, 1, 5, 4, 1, 1, 9, 7, 6, 4, 2, 9, 7, 6, 5, 5],
        name: 'Bảo dưỡng định kỳ'
      },
      {
        data: [2, 1, 1, 4, 8, 7, 3, 2, 2, 1, 6, 7, 9, 4, 4, 1],
        name: 'Xử lý phi hành đoàn'
      },
      {
        data: [1, 1, 0, 3, 2, 4, 0, 0, 5, 1, 2, 2, 4, 5, 2, 1],
        name: 'Chặn cản cấu trúc'
      },
      {
        data: [5, 3, 4, 1, 9, 6, 1, 2, 2, 4, 3, 4, 6, 2, 1, 1],
        name: 'Chuyển giao và mất sóng vệ tinh'
      }
    ],
    categories: [
      '4. Tháng 3',
      '6. Tháng 3',
      '8. Tháng 3',
      '10. Tháng 3',
      '12. Tháng 3',
      '14. Tháng 3',
      '16. Tháng 3',
      '18. Tháng 3',
      '20. Tháng 3',
      '22. Tháng 3',
      '24. Tháng 3',
      '26. Tháng 3',
      '28. Tháng 3',
      '30. Tháng 3',
      '1. Tháng 4',
      '3. Tháng 4'
    ]
  }
};

export const chartBandwidth = {
  en: {
    series: [
      {
        name: 'Bandwidth',
        data: [4, 4, 6, 8, 9, 5, 4, 7, 7, 6, 6, 9, 8, 8, 10, 13]
      }
    ],
    categories: [
      '4. Mar',
      '6. Mar',
      '8. Mar',
      '10. Mar',
      '12. Mar',
      '14. Mar',
      '16. Mar',
      '18. Mar',
      '20. Mar',
      '22. Mar',
      '24. Mar',
      '26. Mar',
      '28. Mar',
      '30. Mar',
      '1. Apr',
      '3. Apr'
    ]
  },
  vi: {
    series: [
      {
        name: 'Băng thông',
        data: [4, 4, 6, 8, 9, 5, 4, 7, 7, 6, 6, 9, 8, 8, 10, 13]
      }
    ],
    categories: [
      '4. Tháng 3',
      '6. Tháng 3',
      '8. Tháng 3',
      '10. Tháng 3',
      '12. Tháng 3',
      '14. Tháng 3',
      '16. Tháng 3',
      '18. Tháng 3',
      '20. Tháng 3',
      '22. Tháng 3',
      '24. Tháng 3',
      '26. Tháng 3',
      '28. Tháng 3',
      '30. Tháng 3',
      '1. Tháng 4',
      '3. Tháng 4'
    ]
  }
};
