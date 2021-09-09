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
  Select,
  MenuItem,
  Button,
  Card,
  List,
  ListItem,
} from '@material-ui/core';
import dynamic from 'next/dynamic';
import { Delete } from '@material-ui/icons';
import Layout from '../components/Layout/Layout';
import NextLink from 'next/link';
import React, { useContext } from 'react';
import { Store } from '../utils/Store';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
const CartScreen = () => {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const router = useRouter();
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);

    if (data.countInStock <= 0) {
      window.alert('Sorry Product is Not avalaible');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };
  const removeCartItem = (item) => {
    dispatch({ type: 'REMOVE_CART_ITEM', payload: item });
  };
  const checkOutHandler = () => {
    router.push('/shipping');
  };
  return (
    <Layout title="Shipping Cart">
      <Typography variant="h4" gutterBottom>
        Shopping Cart List
      </Typography>

      {cartItems.length === 0 ? (
        <Typography>
          Your Cart is Empty Now Please
          <NextLink href="/" passHref>
            <Link> add products</Link>
          </NextLink>
        </Typography>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Action</TableCell>
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
                        <Select
                          value={item.quantity}
                          onChange={(e) =>
                            updateCartHandler(item, e.target.value)
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align="right">
                        <Typography>₹{item.price}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={() => removeCartItem(item)}
                        >
                          <Delete />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h5">
                    Sub Total ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items ) ₹
                    {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={checkOutHandler}
                  >
                    Check Out
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};
export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
