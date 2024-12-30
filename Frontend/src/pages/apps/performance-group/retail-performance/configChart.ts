export const chartConfigPlans = {
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
//2

export const chartConfigPaymentMethod = {
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
export const chartConfigCampaign = {
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

export const chartConfigTotalPlan = {
  chart: {
    type: 'line',
    height: 350,
    zoom: {
      enabled: false
    }
    // stacked: true
  },
  // plotOptions: {
  //   bar: {
  //     horizontal: false,
  //     columnWidth: '55%',
  //     endingShape: 'rounded'
  //   }
  // },
  stroke: {
    curve: 'straight'
  },
  dataLabels: {
    enabled: false
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
