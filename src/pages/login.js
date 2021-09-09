import {
  List,
  ListItem,
  TextField,
  Typography,
  Button,
  Link,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import useStyles from '../styles/styles';
import NextLink from 'next/link';
import axios from 'axios';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
const Login = () => {
  const router = useRouter();
  const { redirect } = router.query;
  const { dispatch, state } = useContext(Store);
  const { userInfo } = state;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, []);

  const handleLogin = async ({ email, password }) => {
    closeSnackbar();
    console.log('Hello From login page');
    try {
      const { data } = await axios.post('/api/users/login', {
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
    <Layout title="Login">
      <form className={classes.form} onSubmit={handleSubmit(handleLogin)}>
        <Typography variant="h4">Log in</Typography>
        <List>
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
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Log In
            </Button>
          </ListItem>
          <ListItem>
            <Typography variant="subtitle1">
              Don not have an account?{' '}
              <NextLink href={`/signup?redirect=${redirect || '/'}`} passHref>
                <Link> SignUp !</Link>
              </NextLink>{' '}
            </Typography>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};
export default Login;
