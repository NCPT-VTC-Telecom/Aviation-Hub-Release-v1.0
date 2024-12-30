// third-party
import { combineReducers } from 'redux';

// project-imports
import menu from './menu';
import snackbar from './snackbar';
import authSlice from './auth';
import invoice from './invoice';
import calendar from './calendar';
// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  calendar,
  menu,
  snackbar,
  authSlice,
  invoice
});

export default reducers;
