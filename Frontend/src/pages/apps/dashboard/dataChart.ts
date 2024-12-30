// ==============================|| BAR ||============================== //
//PAX CHART
export const chartConfigPaxData = {
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
  xaxis: {},
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

export const chartPaxData = {
  en: {
    series: [
      {
        name: 'PAX Data Usage',
        data: [1000, 800, 4165, 1877, 9871, 4897, 7489, 418, 4178, 1815, 4517, 1245, 4575]
      }
    ],
    categories: [
      'Browsing: http',
      'Real-time communication',
      'Browsing: https',
      'Facebook',
      'Other social networks',
      'Cloud',
      'Audio/Video',
      'Email',
      'Other content',
      'Tunneling',
      'Updates',
      'App store',
      'System'
    ]
  },
  vi: {
    series: [
      {
        name: 'Lượng dữ liệu sử dụng của hành khách',
        data: [1000, 800, 4165, 1877, 9871, 4897, 7489, 418, 4178, 1815, 4517, 1245, 4575]
      }
    ],
    categories: [
      'Duyệt web: http',
      'Real-time communication',
      'Duyệt web: https',
      'Facebook',
      'Mạng xã hội khác',
      'Cloud',
      'Âm thanh/Video',
      'Email',
      'Nội dung khác',
      'Tunneling',
      'Cập nhật',
      'Cửa hàng ứng dụng',
      'Hệ thống'
    ]
  }
};

// ==============================|| PIE/DONUT ||============================== //
export const chartConfigSummary = {
  chart: {
    type: 'donut',
    height: 400
  },
  dataLabels: {
    enabled: true
  },
  legend: {
    show: true,
    fontFamily: `Inter var`,
    position: 'right',
    offsetX: 10,
    offsetY: 80,
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

export const chartSummary = {
  en: {
    labels: ['Server available', 'Terminal not responding', 'Server not responding', 'Server not available'],
    series: [84.3, 11, 4.6, 0.2]
  },
  vi: {
    labels: ['Máy chủ khả dụng', 'Thiết bị đầu cuối không phản hồi', 'Máy chủ không phản hồi', 'Máy chủ không khả dụng'],
    series: [84.3, 11, 4.6, 0.2]
  }
};

//Plan Chart
export const chartConfigTotalPlan = {
  chart: {
    type: 'donut',
    height: 400
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: number) {
      return val;
    }
  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '22px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            color: undefined,
            offsetY: -10,
            formatter: function (val: number) {
              return val;
            }
          },
          value: {
            show: true,
            fontSize: '16px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            color: undefined,
            offsetY: 16,
            formatter: function (val: number) {
              return val;
            }
          },
          total: {
            show: true,
            label: 'Total',
            fontSize: '22px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            color: '#373d3f',
            formatter: function (w: any) {
              return w.globals.seriesTotals.reduce((a: any, b: any) => {
                return a + b;
              }, 0);
            }
          }
        }
      }
    }
  },
  legend: {
    show: true,
    fontFamily: `Inter var`,
    position: 'left',
    offsetX: 10,
    offsetY: 110,
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

export const chartTotalPlan = {
  en: {
    labels: ['FLY-WIFI-001', 'FLY-WIFI-002', 'FLY-WIFI-003'],
    series: [5, 3, 2]
  },
  vi: {
    labels: ['FLY-WIFI-001', 'FLY-WIFI-002', 'FLY-WIFI-003'],
    series: [5, 3, 2]
  }
};

// ==============================||  COLUMN ||============================== //
export const chartConfigPlan = {
  chart: {
    type: 'bar',
    height: 350,
    stacked: false
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
  fill: {
    opacity: 1
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

export const chartPlan = {
  en: {
    series: [
      {
        data: [4, 8, 6, 7, 17, 11, 9, 8, 7, 5, 16, 15],
        name: 'Free'
      },
      {
        data: [10, 12, 8, 6, 5, 18, 21, 8, 9, 10, 11, 4],
        name: 'Basic'
      },
      {
        data: [8, 6, 11, 4, 5, 8, 7, 5, 12, 10, 11, 10],
        name: 'Premium'
      }
    ],
    categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August ', 'September', 'October', 'November', 'December']
  },
  vi: {
    series: [
      {
        data: [4, 8, 6, 7, 17, 11, 9, 8, 7, 5, 16, 15],
        name: 'Gói miễn phí'
      },
      {
        data: [10, 12, 8, 6, 5, 18, 21, 8, 9, 10, 11, 4],
        name: 'Gói cơ bản'
      },
      {
        data: [8, 6, 11, 4, 5, 8, 7, 5, 12, 10, 11, 10],
        name: 'Gói cao cấp'
      }
    ],
    categories: [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12'
    ]
  }
};
