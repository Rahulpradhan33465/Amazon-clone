import { Step, StepLabel, Stepper } from '@material-ui/core';
import React from 'react';

const CheckOut = ({ activeStep = 0 }) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {['Login', 'Shiping Address', 'Payment Method', 'Place Order'].map(
        (step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        )
      )}
    </Stepper>
  );
};

export default CheckOut;
