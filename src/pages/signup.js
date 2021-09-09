import {
  List,
  ListItem,
  TextField,
  Typography,
  Button,
  Link,
} from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import useStyles from '../styles/styles';
import NextLink from 'next/link';
import axios from 'axios';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

const SignUp = () => {
  const router = useRouter();
  const { redirect } = router.query;
  const { dispatch, state } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, []);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleSignUp = async ({ name, email, password, confirmPassword }) => {
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar('Password does not match', {
        variant: 'error',
      });
      return;
    }
    try {
      const { data } = await axios.post('/api/users/signup', {
        name,
        email,
        password,
      });
      Cookies.set('userInfo', JSON.stringify(data));
      dispatch({ type: 'USER_LOGIN', payload: data });

      router.push(redirect || '/');
    } catch (error) {
      enqueueSnackbar(
        error.response.data ? error.response.data.message : error.message,
        { variant: 'error' }
      );
    }
  };
  const classes = useStyles();
  return (
    <Layout title="Sign Up">
      <form className={classes.form} onSubmit={handleSubmit(handleSignUp)}>
        <Typography variant="h4">Sign Up</Typography>
        <List>
          <ListItem>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 3,
              }}
              render={({ field }) => (
                <TextField
                  label="First Name"
                  fullWidth
                  variant="outlined"
                  id="name"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.name)}
                  helperText={
                    errors.name
                      ? errors.name.type === 'minLength'
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
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  label="Email"
                  fullWidth
                  variant="outlined"
                  id="email"
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? 'Email is not valid'
                        : 'Email is required'
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
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  label="Password"
                  fullWidth
                  variant="outlined"
                  id="password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? 'Password Should be 6 charecter long'
                        : 'Password is required'
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
              name="confirmPassword"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  label="Confirm Password"
                  fullWidth
                  variant="outlined"
                  id="confirmPassword"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.confirmPassword)}
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword.type === 'minLength'
                        ? 'Confirm Password Should be 6 charecter long'
                        : 'Confirm Password is required'
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
              Sign Up
            </Button>
          </ListItem>
          <ListItem>
            <Typography variant="subtitle1">
              Already have an account?{' '}
              <NextLink href={`/login?redirect=${redirect || '/'}`} passHref>
                <Link> Login !</Link>
              </NextLink>{' '}
            </Typography>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};
export default SignUp;
