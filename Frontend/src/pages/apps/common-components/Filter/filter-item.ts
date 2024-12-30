import { FiltersConfig } from 'types/general';

export const filterAircraft: FiltersConfig = {
  id: 'aircraft_dashboard',
  haveDatePicker: true,
  filterItem: [
    {
      id: 'aircraft_type',
      optionList: [{ label: 'Select Aircraft', value: 0 }]
    },
    {
      id: 'tail_number',
      optionList: [{ label: 'Select Tail Number Aircraft', value: 0 }]
    },
    {
      id: 'airline',
      optionList: [{ label: 'Select Airline', value: 0 }]
    },
    {
      id: 'flight_phase',
      optionList: [{ label: 'Flight Phase', value: 0 }]
    },
    {
      id: 'ifc_status',
      optionList: [{ label: 'Select status', value: 0 }]
    }
  ]
};

export const filterServicePerformance = {
  id: 'service_performance',
  haveDatePicker: true,
  filterItem: [
    {
      id: 'departure_airport',
      optionList: [{ label: 'Select departure airport', value: 0 }]
    },
    {
      id: 'arrival_airport',
      optionList: [{ label: 'Select arrival airport', value: 0 }]
    },
    {
      id: 'tail_number',
      optionList: [{ label: 'Select Tail number aircraft', value: 0 }]
    },
    {
      id: 'flight_number',
      optionList: [{ label: 'Select flight number aircraft', value: 0 }]
    }
  ]
};

export const filterSessionPerformance = {
  id: 'session_performance',
  haveDatePicker: true,
  filterItem: [
    {
      id: 'departure_airport',
      optionList: [{ label: 'Select departure airport', value: 0 }]
    },
    {
      id: 'arrival_airport',
      optionList: [{ label: 'Select arrival airport', value: 0 }]
    },
    {
      id: 'tail_number',
      optionList: [{ label: 'Select tail number aircraft', value: 0 }]
    },
    {
      id: 'flight_number',
      optionList: [{ label: 'Select flight number aircraft', value: 0 }]
    },
    {
      id: 'flight_length',
      optionList: [{ label: 'Select flight length', value: 0 }]
    },
    {
      id: 'dpi_profile',
      optionList: [{ label: 'Select dpi profile', value: 0 }]
    },
    {
      id: 'device_type',
      optionList: [{ label: 'Select device type', value: 0 }]
    }
  ]
};

export const filterRetailPerformance = {
  id: 'retail_performance',
  haveDatePicker: true,
  filterItem: [
    {
      id: 'departure_airport',
      optionList: [{ label: 'Select departure airport', value: 0 }]
    },
    {
      id: 'arrival_airport',
      optionList: [{ label: 'Select arrival airport', value: 0 }]
    },
    {
      id: 'tail_number',
      optionList: [{ label: 'Select tail number aircraft', value: 0 }]
    },
    {
      id: 'flight_number',
      optionList: [{ label: 'Select flight number aircraft', value: 0 }]
    },
    {
      id: 'flight_length',
      optionList: [{ label: 'Select flight length', value: 0 }]
    },
    {
      id: 'dpi_profile',
      optionList: [{ label: 'Select dpi profile', value: 0 }]
    },
    {
      id: 'device_type',
      optionList: [{ label: 'Select device type', value: 0 }]
    }
  ]
};

export const filterDataUsage = {
  id: 'data_usage',
  haveDatePicker: true,
  filterItem: [
    {
      id: 'departure_airport',
      optionList: [{ label: 'Select departure airport', value: 0 }]
    },
    {
      id: 'arrival_airport',
      optionList: [{ label: 'Select arrival airport', value: 0 }]
    },
    {
      id: 'tail_number',
      optionList: [{ label: 'Select tail number aircraft', value: 0 }]
    },
    {
      id: 'flight_number',
      optionList: [{ label: 'Select flight number aircraft', value: 0 }]
    },
    {
      id: 'flight_length',
      optionList: [{ label: 'Select flight length', value: 0 }]
    }
    // {
    //   id: 'dpi_profile',
    //   optionList: []
    // }
  ]
};

export const filterDeviceHealth = {
  id: 'data_health',
  haveDatePicker: true,
  filterItems: [
    {
      id: 'tail_number',
      optionList: [{ label: 'Select tail number aircraft', value: 0 }]
    },

    {
      id: 'airline',
      optionList: [{ label: 'Select airline', value: 0 }]
    }
  ]
};

export const filterList = {
  id: 'exampleFilters',
  haveDatePicker: true,
  filterItem: [
    {
      id: 'aircraft_type',
      optionList: [{ label: 'Select type of aircraft', value: 0 }]
    },
    {
      id: 'tail_number',
      optionList: [{ label: 'Select tail number aircraft', value: 0 }]
    }
  ]
};
