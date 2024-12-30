//1
export const chartConfigDevice = {
  chart: {
    type: 'bar',
    height: 350
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: true,
      distributed: true
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    labels: {
      formatter: function (value: number) {
        if (value >= 1000000) {
          return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
          return (value / 1000).toFixed(1) + 'K';
        } else {
          return value;
        }
      }
    }
  },
  legend: {
    show: false,
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

export const chartDevice = {
  en: {
    series: [
      {
        name: 'Device',
        data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
      }
    ],
    categories: ['Iphone', 'Android', 'Ipad', 'Laptop', 'Android tablet', 'Other tablet', 'Other phone', 'Other']
  },
  vi: {
    series: [
      {
        name: 'Thiết bị',
        data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
      }
    ],
    categories: ['Iphone', 'Android', 'Ipad', 'Laptop', 'Máy tính bảng Android', 'Máy tính bảng khác', 'Điện thoại khác', 'Khác']
  }
};

//2
export const chartConfigBrowser = {
  chart: {
    type: 'donut',
    height: 350
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: true,
      distributed: true
    }
  },
  dataLabels: {
    enabled: true
  },
  xaxis: {
    labels: {
      formatter: function (value: number) {
        if (value >= 1000000) {
          return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
          return (value / 1000).toFixed(1) + 'K';
        } else {
          return value;
        }
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

export const chartBrowser = {
  en: {
    series: [
      {
        name: 'Browser',
        data: [24000, 15445, 12000, 17000, 18000, 4165, 1877, 9871]
      }
    ],
    categories: ['Safari', 'Chrome', 'Internet Explorer', 'Firefox', 'Chromium', 'Android', 'Unknown']
  },
  vi: {
    series: [
      {
        name: 'Trình duyệt',
        data: [24000, 15445, 12000, 17000, 18000, 4165, 1877, 9871]
      }
    ],
    categories: ['Safari', 'Chrome', 'Internet Explorer', 'Firefox', 'Chromium', 'Android', 'Không xác định']
  }
};

//3

export const chartConfigAverageSessionPerFlight = {
  chart: {
    type: 'line',
    height: 350
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
    curve: 'straight'
  },
  // xaxis: {
  //   type: 'datetime',
  //   labels: {
  //     datetimeFormatter: {
  //       day: 'dd/MM/yyyy'
  //     }
  //   }
  // },
  yaxis: {
    title: {
      // text: '$ (thousands)'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      // formatter(val: number) {
      //   return `$ ${val} thousands`;
      // }
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

export const chartAverageSessionPerFlight = {
  en: {
    series: [
      {
        name: 'Session per flight',
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
        name: 'Phiên trên mỗi chuyến bay',
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

//4
export const chartConfigAverageSessionsDuration = {
  chart: {
    type: 'bar',
    height: 350
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
  // xaxis: {
  //   type: 'datetime',
  //   labels: {
  //     datetimeFormatter: {
  //       day: 'dd/MM/yyyy'
  //     }
  //   }
  // },
  yaxis: {
    title: {
      // text: '$ (thousands)'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      // formatter(val: number) {
      //   return `$ ${val} thousands`;
      // }
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

export const chartAverageSessionsDuration = {
  en: {
    series: [
      {
        name: 'Session duration',
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
        name: 'Thời lượng phiên',
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
