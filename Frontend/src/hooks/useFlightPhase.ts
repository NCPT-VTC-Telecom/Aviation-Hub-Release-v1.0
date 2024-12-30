import { useMemo } from 'react';
import { useIntl } from 'react-intl';

const useFlightPhaseTooltip = (flightPhase: number) => {
  const intl = useIntl();

  const flightPhaseTooltip = useMemo(() => {
    switch (flightPhase) {
      case 1:
        return intl.formatMessage({ id: 'pre-departure' });
      case 2:
        return intl.formatMessage({ id: 'clearance-to-taxi' });
      case 3:
        return intl.formatMessage({ id: 'take-off' });
      case 4:
        return intl.formatMessage({ id: 'initial-climb' });
      case 5:
        return intl.formatMessage({ id: 'climb-to-cruise-altitude' });
      case 6:
        return intl.formatMessage({ id: 'cruise-altitude' });
      case 7:
        return intl.formatMessage({ id: 'descent' });
      case 8:
        return intl.formatMessage({ id: 'approach' });
      case 9:
        return intl.formatMessage({ id: 'landing' });
      case 10:
        return intl.formatMessage({ id: 'taxi-to-the-terminal' });
      case 11:
        return intl.formatMessage({ id: 'post-flight' });
      default:
        return '';
    }
  }, [flightPhase, intl]);

  return flightPhaseTooltip;
};

export default useFlightPhaseTooltip;
