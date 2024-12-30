// third-party
import { sub } from 'date-fns';
import { Chance } from 'chance';
import lodash from 'lodash';

const chance = new Chance();

export const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i += 1) {
    arr.push(i);
  }
  return arr;
};

const skills = [
  'UI Design',
  'Mobile App',
  'Web App',
  'UX',
  'Wireframing',
  'Prototyping',
  'Backend',
  'React',
  'Angular',
  'Javascript',
  'HTML',
  'ES6',
  'Figma',
  'Codeigniter'
];

const nameDevices = [
  'Flywifi-11',
  'Flywifi-25',
  'Flywifi-3411',
  'Flywifi-1871',
  'Flywifi-7891',
  'Flywifi-1791',
  'Flywifi-7911',
  'Flywifi-2411',
  'Flywifi-518'
];

const positionDevices = [
  '12.0055N 97.4633E',
  '12.6221N 120.9079E',
  '12.4426N 111.8111E',
  '11.1430N 103.1172E',
  '13.5265N 106.3897E',
  '12.8677N 114.0093E',
  '16.6274N 119.8482E'
];

const firmwareDevices = ['PAN0.0.1', 'PAN0.0.2', 'PAN0.0.3', 'PAN0.0.4'];

const dateActive = ['01/31/2024', '04/12/2024', '02/14/2024', '04/10/2024', '01/20/2024'];

//End user page
const nameDeviceUser = ['Android', 'Iphone', 'Tablet', 'Ipad', 'Mac', 'Windows'];

const wifiDevices = ['PANO001', 'PANO002', 'PANO003', 'PANO004', 'PANO005', 'PANO006'];

const macAddress = ['ac:52:8d:a5:d6:e8', 'ac:12:8d:a5:d6:e4', 'ac:27:9d:a4:d1:e2', 'ac:48:7d:a1:d1:e4', 'ac:64:7d:a2:d5:e1'];

const plans = ['Wifi Free', 'Wifi Basic', 'Wifi Premium'];
//Plan list
const plansList = [
  'FLY-WIFI-11',
  'FLY-WIFI-25',
  'FLY-WIFI-3411',
  'FLY-WIFI-1871',
  'FLY-WIFI-7891',
  'FLY-WIFI-1791',
  'FLY-WIFI-7911',
  'FLY-WIFI-2411',
  'FLY-WIFI-518'
];

const idPlans = ['PAG01', 'PAG02', 'PAG03', 'PAG04'];

const bandwidth = [64, 128, 256, 512, 1024, 2048];

const departureStart = ['01/31/2024', '04/12/2024', '02/14/2024', '04/10/2024', '01/20/2024', '11/20/2023'];

const departureEnd = ['01/31/2024', '04/12/2024', '02/14/2024', '04/10/2024', '01/20/2024', '11/20/2023'];

//Suppliers
const descSuppliers = ['Provides satellite wifi service', 'Provides wifi service'];

//info aircraft

const flightNo = ['NO.124', 'NO.125', 'NO.126', 'NO.127', 'NO.128'];
const tailNo = ['Tail.1243', 'Tail.1244', 'Tail.1245', 'Tail.1246'];
const route = ['HN - SG', 'KR - JP', 'DL - DN'];
const sessionActive = ['12', '15', '49', '23', '75'];
const time = ['just now', '1 day ago', '2 min ago', '2 days ago', '1 week ago', '1 year ago', '5 months ago', '3 hours ago', '1 hour ago'];

// ==============================|| CUSTOM FUNCTION - TABLE DATA ||============================== //

function mockData(index: number) {
  return {
    id: (index: number) => `${chance.bb_pin()}${index}`,
    email: chance.email({ domain: 'gmail.com' }),
    contact: chance.phone(),
    datetime: sub(new Date(), {
      days: chance.integer({ min: 0, max: 30 }),
      hours: chance.integer({ min: 0, max: 23 }),
      minutes: chance.integer({ min: 0, max: 59 })
    }),
    boolean: chance.bool(),
    role: chance.profession(),
    company: chance.company(),
    address: {
      full: `${chance.address()}, ${chance.city()}, ${chance.country({ full: true })} - ${chance.zip()}`,
      country: chance.country({ full: true }),
      city: chance.city()
    },
    name: {
      first: chance.first(),
      last: chance.last(),
      full: chance.name()
    },
    text: {
      title: chance.sentence({ words: chance.integer({ min: 4, max: 12 }) }),
      sentence: chance.sentence(),
      description: chance.paragraph
    },
    number: {
      percentage: chance.integer({ min: 0, max: 100 }),
      rating: chance.floating({ min: 0, max: 5, fixed: 2 }),
      status: (min: number, max: number) => chance.integer({ min, max }),
      age: chance.age(),
      amount: chance.integer({ min: 1, max: 10000 })
    },
    image: {
      product: (index: number) => `product_${index}`,
      avatar: (index: number) => `avatar_${index}`
    },
    gps: {
      lat: chance.latitude(),
      lng: chance.longitude()
    },
    skill: lodash.sampleSize(skills, chance.integer({ min: 1, max: 1 })),
    nameDevice: lodash.sampleSize(nameDevices, chance.integer({ min: 1, max: 1 })),
    firmwareDevice: lodash.sampleSize(firmwareDevices, chance.integer({ min: 1, max: 1 })),
    positionDevices: lodash.sampleSize(positionDevices, chance.integer({ min: 1, max: 1 })),
    dateActive: lodash.sampleSize(dateActive, chance.integer({ min: 1, max: 1 })),
    deviceUser: lodash.sampleSize(nameDeviceUser, chance.integer({ min: 1, max: 1 })),
    macAddress: lodash.sampleSize(macAddress, chance.integer({ min: 1, max: 1 })),
    wifiDevice: lodash.sampleSize(wifiDevices, chance.integer({ min: 1, max: 1 })),
    plan: lodash.sampleSize(plans, chance.integer({ min: 1, max: 1 })),
    planList: lodash.sampleSize(plansList, chance.integer({ min: 1, max: 1 })),
    idPlan: lodash.sampleSize(idPlans, chance.integer({ min: 1, max: 1 })),
    bandwidth: lodash.sampleSize(bandwidth, chance.integer({ min: 1, max: 1 })),
    departureStart: lodash.sampleSize(departureStart, chance.integer({ min: 1, max: 1 })),
    departureEnd: lodash.sampleSize(departureEnd, chance.integer({ min: 1, max: 1 })),
    descSupplier: lodash.sampleSize(descSuppliers, chance.integer({ min: 1, max: 1 })),
    flightNo: lodash.sampleSize(flightNo, chance.integer({ min: 1, max: 1 })),
    tailNo: lodash.sampleSize(tailNo, chance.integer({ min: 1, max: 1 })),
    route: lodash.sampleSize(route, chance.integer({ min: 1, max: 1 })),
    sessionActive: lodash.sampleSize(sessionActive, chance.integer({ min: 1, max: 1 })),
    time: lodash.sampleSize(time)
  };
}

export default mockData;
