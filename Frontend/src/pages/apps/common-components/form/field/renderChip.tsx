import { Chip } from '@mui/material';
import { FormattedMessage } from 'react-intl';

function getChipStatus(
  id: number,
  successLabel: string,
  errorLabel: string,
  warningLabel?: string,
  dangerLabel?: string,
  infoLabel?: string
) {
  switch (id) {
    //general case
    case 6:
      return <Chip color="warning" label={<FormattedMessage id={warningLabel} />} size="small" variant="light" className="min-w-10" />;
    case 14:
      return <Chip color="success" label={<FormattedMessage id={successLabel} />} size="small" variant="light" className="min-w-10" />;
    //device
    case 21:
      return <Chip color="warning" label={<FormattedMessage id={warningLabel} />} size="small" variant="light" className="min-w-10" />;
    //aircraft
    case 31:
      return <Chip color="warning" label={<FormattedMessage id={warningLabel} />} size="small" variant="light" className="min-w-10" />;
    case 32:
      return <Chip color="success" label={<FormattedMessage id={successLabel} />} size="small" variant="light" className="min-w-10" />;
    //ifc
    case 27:
      return (
        <Chip sx={{ bgcolor: '#FE9900' }} label={<FormattedMessage id={dangerLabel} />} size="small" variant="light" className="min-w-10" />
      );
    case 28:
      return <Chip color="warning" label={<FormattedMessage id={successLabel} />} size="small" variant="light" className="min-w-10" />;
    case 29:
      return <Chip color="success" label={<FormattedMessage id={successLabel} />} size="small" variant="light" className="min-w-10" />;
    //customer services
    case 33:
      return <Chip color="info" label={<FormattedMessage id={infoLabel} />} size="small" variant="light" className="min-w-10" />;
    case 34:
      return <Chip color="success" label={<FormattedMessage id={successLabel} />} size="small" variant="light" className="min-w-10" />;
    // case
    default:
      return <Chip color="error" label={<FormattedMessage id={errorLabel} />} size="small" variant="light" className="min-w-10" />;
  }
}

export default getChipStatus;
