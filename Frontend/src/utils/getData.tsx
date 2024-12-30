import { FormattedMessage } from 'react-intl';

export const getPlacementLocation = (value: string | null) => {
  const placementLocation = value?.toLowerCase();

  switch (placementLocation) {
    case 'first class':
      return <FormattedMessage id="first-class" />;
    case 'business class':
      return <FormattedMessage id="business-class" />;
    case 'economy 1':
      return <FormattedMessage id="eco-1" />;
    case 'economy 2':
      return <FormattedMessage id="eco-2" />;
    case 'economy 3':
      return <FormattedMessage id="eco-3" />;
    default:
      return value;
  }
};

export const getTypePackages = (type: string | undefined) => {
  switch (type) {
    case 'product':
      return <FormattedMessage id="wifi-packages" />;
    case 'airline':
      return <FormattedMessage id="airfare-packages" />;
    case 'telecom':
      return <FormattedMessage id="telecom-packages" />;
    default:
      return <FormattedMessage id="unknown" />;
  }
};

export const getLeasedAircraft = (type: string | undefined | null) => {
  switch (type) {
    case 'owned':
      return <FormattedMessage id="owned" />;
    case 'rent':
      return <FormattedMessage id="rent" />;
    case 'lease':
      return <FormattedMessage id="lease" />;
    default:
      return <FormattedMessage id="unknown" />;
  }
};
