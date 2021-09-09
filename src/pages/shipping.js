import {
  List,
  ListItem,
  TextField,
  Typography,
  Button,
} from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import useStyles from '../styles/styles';

import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import CheckOut from '../components/CheckOut';

const Shipping = () => {
  const router = useRouter();
  const { redirect } = router.query;
  const { dispatch, state } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping');
    }
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('postal', shippingAddress.postal);
    setValue('country', shippingAddress.country);
  }, []);

  const handleSignUp = ({ fullName, address, city, country, postal }) => {
    Cookies.set(
      'shippingAddress',
      JSON.stringify({ fullName, address, city, country, postal })
    );
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, country, postal },
    });

    router.push('/payment');
  };
  const classes = useStyles();
  return (
    <Layout title="Shipping">
      <CheckOut activeStep={1} />
      <form className={classes.form} onSubmit={handleSubmit(handleSignUp)}>
        <Typography variant="h4">Shipping Address</Typography>
        <List>
          <ListItem>
            <Controller
              name="fullName"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 3,
              }}
              render={({ field }) => (
                <TextField
                  label="Full Name"
                  fullWidth
                  variant="outlined"
                  id="name"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === 'minLength'
                        ? 'Name at least 3 charrecter'
                        : 'Name is required'
                      : ''
                  }
                  {...field}
                />
              )}
            >
              {' '}
            </Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 3,
              }}
              render={({ field }) => (
                <TextField
                  label="Address"
                  fullWidth
                  variant="outlined"
                  id="address"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.address)}
                  helperText={
                    errors.address
                      ? errors.address.type === 'minLength'
                        ? 'Address at least 3 charrecter'
                        : 'Address is required'
                      : ''
                  }
                  {...field}
                />
              )}
            >
              {' '}
            </Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="city"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 3,
              }}
              render={({ field }) => (
                <TextField
                  label="City"
                  fullWidth
                  variant="outlined"
                  id="city"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city
                      ? errors.city.type === 'minLength'
                        ? 'City at least 3 charrecter'
                        : 'City is required'
                      : ''
                  }
                  {...field}
                />
              )}
            >
              {' '}
            </Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="country"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 3,
              }}
              render={({ field }) => (
                <TextField
                  label="Country"
                  fullWidth
                  variant="outlined"
                  id="country"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.country)}
                  helperText={
                    errors.country
                      ? errors.country.type === 'minLength'
                        ? 'Country at least 3 charrecter'
                        : 'Country is required'
                      : ''
                  }
                  {...field}
                />
              )}
            >
              {' '}
            </Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="postal"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 3,
              }}
              render={({ field }) => (
                <TextField
                  label="Postal Code"
                  fullWidth
                  variant="outlined"
                  id="postal"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.postal)}
                  helperText={
                    errors.postal
                      ? errors.postal.type === 'minLength'
                        ? 'Postal at least 3 charrecter'
                        : 'Postal is required'
                      : ''
                  }
                  {...field}
                />
              )}
            >
              {' '}
            </Controller>
          </ListItem>

          <ListItem>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};
export default Shipping;
