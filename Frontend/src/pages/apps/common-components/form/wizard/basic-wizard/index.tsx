import { useState } from 'react';

// material-ui
import { Button, Step, Stepper, StepLabel, Stack, Typography } from '@mui/material';

// project-imports
import UserInfoForm from './UserInfo';
import PaymentForm from './PaymentForm';
import Review from './Review';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { EditUser, NewUser, EndUserData } from 'types/end-user';
import { OptionList } from 'types/general';
import { useIntl } from 'react-intl';

// step options

export interface Props {
  endUser: EndUserData | null;
  onCancel: () => void;
  handleEdit: (values: EditUser) => void;
  handleAdd: (values: NewUser) => void;
  open: boolean;
  roleOptions: OptionList[];
}

// ==============================|| FORMS WIZARD - BASIC ||============================== //

const BasicWizard = ({ endUser, onCancel, handleEdit, handleAdd, open, roleOptions }: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const intl = useIntl();

  const steps = [
    intl.formatMessage({ id: 'enter-user-info' }),
    intl.formatMessage({ id: 'enter-permission-user' }),
    intl.formatMessage({ id: 'check-info' })
  ];

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <UserInfoForm
            open={open}
            handleAdd={handleAdd}
            endUser={endUser}
            onCancel={onCancel}
            handleEdit={handleEdit}
            roleOptions={roleOptions}
          />
        );
      case 1:
        return <PaymentForm />;
      case 2:
        return <Review />;
      default:
        throw new Error('Unknown step');
    }
  }

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <MainCard title={intl.formatMessage({ id: 'add-admin' })}>
      <Stepper activeStep={activeStep} sx={{ pt: 1, pb: 1 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <>
        {activeStep === steps.length ? (
          <>
            <Typography variant="h5" gutterBottom>
              Thank you for your order.
            </Typography>
            <Typography variant="subtitle1">
              Your order number is #2001539. We have emailed your order confirmation, and will send you an update when your order has
              shipped.
            </Typography>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button variant="contained" color="error" onClick={() => setActiveStep(0)} sx={{ my: 3, ml: 1 }}>
                  Reset
                </Button>
              </AnimateButton>
            </Stack>
          </>
        ) : (
          <>
            {getStepContent(activeStep)}
            <Stack direction="row" justifyContent={activeStep !== 0 ? 'space-between' : 'flex-end'}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ my: 3, ml: 1 }}>
                  {intl.formatMessage({ id: 'back' })}
                </Button>
              )}
              <AnimateButton>
                <Button variant="contained" onClick={handleNext} sx={{ my: 3, ml: 1 }}>
                  {activeStep === steps.length - 1 ? intl.formatMessage({ id: 'add' }) : intl.formatMessage({ id: 'next' })}
                </Button>
              </AnimateButton>
            </Stack>
          </>
        )}
      </>
    </MainCard>
  );
};

export default BasicWizard;
