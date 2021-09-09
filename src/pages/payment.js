import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../utils/Store';
import Layout from '../components/Layout/Layout';
import CheckOut from '../components/CheckOut';
import useStyles from '../styles/styles';
import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

const Payment = () => {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
  } = state;
  const [paymentMethod, setPaymentMethod] = useState('');
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping');
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '');
    }
  }, []);

  const handleSubmit = (e) => {
    closeSnackbar();

    e.preventDefault();
    if (!paymentMethod) {
      enqueueSnackbar('Payment Method is required', { variant: 'error' });
    } else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      Cookies.set('paymentMethod', paymentMethod);
      router.push('/placeorder');
    }
  };
  const classes = useStyles();
  return (
    <Layout title="Payment Method">
      <CheckOut activeStep={2} />
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h4">Pyment Method</Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="payment Method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label="PayPal"
                  value="Paypal"
                  control={<Radio />}
                />
                <FormControlLabel
                  label="Stripe"
                  value="Stripe"
                  control={<Radio />}
                />
                <FormControlLabel
                  label="Cash"
                  value="Cash"
                  control={<Radio />}
                />
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button fullWidth variant="contained" type="submit" color="primary">
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant="contained"
              onClick={() => router.push('/shipping')}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Payment;
