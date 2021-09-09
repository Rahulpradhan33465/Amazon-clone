import {
  Typography,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  Button,
  Card,
  List,
  ListItem,
  CircularProgress,
} from '@material-ui/core';
import dynamic from 'next/dynamic';

import Layout from '../../components/Layout/Layout';
import NextLink from 'next/link';
import React, { useContext, useEffect, useReducer } from 'react';
import { Store } from '../../utils/Store';
import Image from 'next/image';
import useStyles from '../../styles/styles';
import { useRouter } from 'next/router';
import CheckOut from '../../components/CheckOut';
import { getError } from '../../utils/error';
import axios from 'axios';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const Order = ({ params }) => {
  const orderId = params.id;
  const { state } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();
  const classes = useStyles();

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!order._id || order._id & (order._id !== orderId)) {
      fetchOrder();
    }
  }, [order]);

  return (
    <Layout title={`Order ${orderId}`}>
      <CheckOut activeStep={3} />
      <Typography variant="h4" gutterBottom>
        Order {orderId}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography className={classes.error}>{error}</Typography>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h5">Shipping Address</Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="subtitle2">
                    {shippingAddress.fullName},{shippingAddress.address},
                    {shippingAddress.city},{shippingAddress.postal},
                    {shippingAddress.country}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="subtitle2">
                    Status:
                    {isDelivered
                      ? `delivered at ${deliveredAt}`
                      : 'not delivered'}
                  </Typography>
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h5">Payment Method</Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="subtitle2">{paymentMethod}</Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="subtitle2">
                    Status:{isPaid ? `paid at ${paidAt}` : 'not paid'}
                  </Typography>
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h5">Order Items</Typography>
                </ListItem>
              </List>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  height={50}
                                  width={50}
                                ></Image>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Typography variant="subtitle1">
                                  {item.name}
                                </Typography>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>{item.quantity}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>₹{item.price}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h5">Order Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Items:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>₹{itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Taxs:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>₹{taxPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Shipping Price::</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>₹{shippingPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Total:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>
                        <strong> ₹{totalPrice} </strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });
