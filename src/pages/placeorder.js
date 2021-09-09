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
import { useSnackbar } from 'notistack';
import Layout from '../components/Layout/Layout';
import NextLink from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../utils/Store';
import Image from 'next/image';
import useStyles from '../styles/styles';
import { useRouter } from 'next/router';
import CheckOut from '../components/CheckOut';
import { getError } from '../utils/error';
import axios from 'axios';
import Cookies from 'js-cookie';
const PlaceOrder = () => {
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;
  const router = useRouter();
  const classes = useStyles();

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, []);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const placeOrderHandler = async () => {
    closeSnackbar();
    try {
      setLoading(true);
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'CART_CLEAR' });
      Cookies.remove('cartItems');
      setLoading(false);
      router.push(`/order/${data._id}`);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  };

  return (
    <Layout title="Shipping Cart">
      <CheckOut activeStep={3} />
      <Typography variant="h4" gutterBottom>
        Place Order
      </Typography>

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
                    {cartItems.map((item) => (
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
              <ListItem>
                <Button
                  variant="contained"
                  onClick={placeOrderHandler}
                  color="primary"
                  fullWidth
                >
                  PLace Order
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};
export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
