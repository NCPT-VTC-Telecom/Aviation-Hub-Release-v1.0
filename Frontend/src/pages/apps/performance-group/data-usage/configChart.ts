export const chartConfigTotalData = {
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
  tooltip: {
    y: {
      formatter: function (value: number) {
        if (value >= 1000000000) {
          // Nếu lớn hơn hoặc bằng 1 Petabyte (PB)
          return (value / 1000000000).toFixed(1) + 'PB';
        } else if (value >= 1000000) {
          // Nếu lớn hơn hoặc bằng 1 Terabyte (TB)
          return (value / 1000000).toFixed(1) + 'TB';
        } else if (value >= 1000) {
          // Nếu lớn hơn hoặc bằng 1 Gigabyte (GB)
          return (value / 1000).toFixed(1) + 'GB';
        } else {
          // Nếu nhỏ hơn 1 Gigabyte (GB)
          return value.toFixed(1) + 'MB';
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
//2
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
  xaxis: {
    labels: {
      formatter: function (value: number) {
        if (value >= 1000000000) {
          // Nếu lớn hơn hoặc bằng 1 Petabyte (PB)
          return (value / 1000000000).toFixed(1) + 'PB';
        } else if (value >= 1000000) {
          // Nếu lớn hơn hoặc bằng 1 Terabyte (TB)
          return (value / 1000000).toFixed(1) + 'TB';
        } else if (value >= 1000) {
          // Nếu lớn hơn hoặc bằng 1 Gigabyte (GB)
          return (value / 1000).toFixed(1) + 'GB';
        } else {
          // Nếu nhỏ hơn 1 Gigabyte (GB)
          return value.toFixed(1) + 'MB';
        }
      }
    },
    formatter: function (value: any) {
      return value && value.length > 15 ? value.slice(0, 15) + '...' : value; // Rút gọn nhãn nếu dài quá 15 ký tự
    }
  },
  tooltip: {
    y: {
      formatter: function (value: number) {
        if (value >= 1000000000) {
          // Nếu lớn hơn hoặc bằng 1 Petabyte (PB)
          return (value / 1000000000).toFixed(1) + 'PB';
        } else if (value >= 1000000) {
          // Nếu lớn hơn hoặc bằng 1 Terabyte (TB)
          return (value / 1000000).toFixed(1) + 'TB';
        } else if (value >= 1000) {
          // Nếu lớn hơn hoặc bằng 1 Gigabyte (GB)
          return (value / 1000).toFixed(1) + 'GB';
        } else {
          // Nếu nhỏ hơn 1 Gigabyte (GB)
          return value.toFixed(1) + 'MB';
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
//3
export const chartConfigTotalSelected = {
  chart: {
    type: 'bar',
    height: 350,
    stacked: true
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
    labels: {
      formatter: function (value: number) {
        if (value >= 1000000000) {
          // Nếu lớn hơn hoặc bằng 1 Petabyte (PB)
          return (value / 1000000000).toFixed(1) + 'PB';
        } else if (value >= 1000000) {
          // Nếu lớn hơn hoặc bằng 1 Terabyte (TB)
          return (value / 1000000).toFixed(1) + 'TB';
        } else if (value >= 1000) {
          // Nếu lớn hơn hoặc bằng 1 Gigabyte (GB)
          return (value / 1000).toFixed(1) + 'GB';
        } else {
          // Nếu nhỏ hơn 1 Gigabyte (GB)
          return value.toFixed(1) + 'MB';
        }
      }
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (value: number) {
        if (value >= 1000000000) {
          // Nếu lớn hơn hoặc bằng 1 Petabyte (PB)
          return (value / 1000000000).toFixed(1) + 'PB';
        } else if (value >= 1000000) {
          // Nếu lớn hơn hoặc bằng 1 Terabyte (TB)
          return (value / 1000000).toFixed(1) + 'TB';
        } else if (value >= 1000) {
          // Nếu lớn hơn hoặc bằng 1 Gigabyte (GB)
          return (value / 1000).toFixed(1) + 'GB';
        } else {
          // Nếu nhỏ hơn 1 Gigabyte (GB)
          return value.toFixed(1) + 'MB';
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

export const chartConfigTotalRoleSelected = {
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
    labels: {
      formatter: function (value: number) {
        if (value >= 1000000000) {
          // Nếu lớn hơn hoặc bằng 1 Petabyte (PB)
          return (value / 1000000000).toFixed(1) + 'PB';
        } else if (value >= 1000000) {
          // Nếu lớn hơn hoặc bằng 1 Terabyte (TB)
          return (value / 1000000).toFixed(1) + 'TB';
        } else if (value >= 1000) {
          // Nếu lớn hơn hoặc bằng 1 Gigabyte (GB)
          return (value / 1000).toFixed(1) + 'GB';
        } else {
          // Nếu nhỏ hơn 1 Gigabyte (GB)
          return value.toFixed(1) + 'MB';
        }
      }
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (value: number) {
        if (value >= 1000000) {
          return (value / 1000000).toFixed(1) + 'PB';
        } else if (value >= 1000) {
          return (value / 1000).toFixed(1) + 'TB';
        } else {
          return value.toFixed(2) + 'GB';
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
//4
export const chartConfigTotalSelectedDataUse = {
  chart: {
    type: 'bar',
    height: 350,
    stacked: true
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
    labels: {
      formatter: function (value: number) {
        if (value >= 1000000000) {
          // Nếu lớn hơn hoặc bằng 1 Petabyte (PB)
          return (value / 1000000000).toFixed(1) + 'PB';
        } else if (value >= 1000000) {
          // Nếu lớn hơn hoặc bằng 1 Terabyte (TB)
          return (value / 1000000).toFixed(1) + 'TB';
        } else if (value >= 1000) {
          // Nếu lớn hơn hoặc bằng 1 Gigabyte (GB)
          return (value / 1000).toFixed(1) + 'GB';
        } else {
          // Nếu nhỏ hơn 1 Gigabyte (GB)
          return value.toFixed(1) + 'MB';
        }
      }
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (value: number) {
        if (value >= 1000000000) {
          // Nếu lớn hơn hoặc bằng 1 Petabyte (PB)
          return (value / 1000000000).toFixed(1) + 'PB';
        } else if (value >= 1000000) {
          // Nếu lớn hơn hoặc bằng 1 Terabyte (TB)
          return (value / 1000000).toFixed(1) + 'TB';
        } else if (value >= 1000) {
          // Nếu lớn hơn hoặc bằng 1 Gigabyte (GB)
          return (value / 1000).toFixed(1) + 'GB';
        } else {
          // Nếu nhỏ hơn 1 Gigabyte (GB)
          return value.toFixed(1) + 'MB';
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
