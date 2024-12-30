// project-imports
import dashboard from './dashboard';
import ifcServices from './ifc-services';
import salesSupport from './sales-support';
import managementOptimizeNetwork from './management-optimize-network';
import servicesManagement from './services-management';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [dashboard, ifcServices, salesSupport, servicesManagement, managementOptimizeNetwork]
};

export default menuItems;
