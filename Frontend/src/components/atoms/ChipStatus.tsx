import { Chip } from '@mui/material';
import { FormattedMessage } from 'react-intl';

interface ChipStatusProps {
  id: number;
  successLabel: string;
  errorLabel: string;
  warningLabel?: string;
  dangerLabel?: string;
  infoLabel?: string;
}

const ChipStatus = ({ id, successLabel, errorLabel, warningLabel = '', dangerLabel = '', infoLabel = '' }: ChipStatusProps) => {
  switch (id) {
    case 6:
    case 21:
    case 31:
      return <Chip color="warning" label={<FormattedMessage id={warningLabel} />} size="small" variant="light" />;
    case 14:
    case 32:
    case 29:
    case 34:
      return <Chip color="success" label={<FormattedMessage id={successLabel} />} size="small" variant="light" />;
    case 27:
      return <Chip sx={{ bgcolor: '#FE9900' }} label={<FormattedMessage id={dangerLabel} />} size="small" variant="light" />;
    case 28:
      return <Chip color="warning" label={<FormattedMessage id={successLabel} />} size="small" variant="light" />;
    case 33:
      return <Chip color="info" label={<FormattedMessage id={infoLabel} />} size="small" variant="light" />;
    default:
      return <Chip color="error" label={<FormattedMessage id={errorLabel} />} size="small" variant="light" />;
  }
};

export default ChipStatus;
