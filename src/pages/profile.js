import dynamic from 'next/dynamic';
import React, { useContext, useEffect } from 'react';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import { getError } from '../utils/error';
import Layout from '../components/Layout/Layout';
import {
  Typography,
  Grid,
  Button,
  Card,
  List,
  ListItem,
  TextField,
} from '@material-ui/core';
import useStyles from '../styles/styles';
import NextLink from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

function Profile() {
  const { state, dispatch } = useContext(Store);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    setValue('name', userInfo.name);
    setValue('email', userInfo.email);
  }, []);
  const submitHandler = async ({ name, email, password, confirmPassword }) => {
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords don't match", { variant: 'error' });
      return;
    }
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));

      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  return (
    <Layout title={`User Profile`}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem selected button>
                <NextLink href="/profile">
                  <Typography variant="subtitle1">User Profile</Typography>
                </NextLink>
              </ListItem>
              <ListItem button>
                <NextLink href="/orderHistory">
                  <Typography variant="subtitle1">Order History</Typography>
                </NextLink>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h4">Profile</Typography>
              </ListItem>
              <ListItem>
                <form
                  className={classes.form}
                  onSubmit={handleSubmit(submitHandler)}
                >
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
                                  ? 'Name at least 3 charecter'
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
                          validate: (value) =>
                            value === '' ||
                            value.length > 5 ||
                            'Password Length is more than 5',
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
                                ? 'Password Should be 6 charecter long'
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
                          validate: (value) =>
                            value === '' ||
                            value.length > 5 ||
                            'Password Length is more than 5',
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
                              errors.password
                                ? 'Confirm Password Should be 6 charecter long'
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
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                      >
                        Update
                      </Button>
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
export default dynamic(() => Promise.resolve(Profile), { ssr: false });
