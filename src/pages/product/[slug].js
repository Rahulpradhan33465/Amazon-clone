import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import Image from 'next/image';

import Error from '../../components/Error';
import Layout from '../../components/Layout/Layout';

import useStyles from '../../styles/DetailProduct';
import NextLink from 'next/link';
import db from '../../utils/db';
import Product from '../../models/Product';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';
const Products = ({ product }) => {
  const router = useRouter();
  const classes = useStyles();
  const { dispatch } = useContext(Store);
  if (!product) {
    return <Error message="Page Not Found!!.." />;
  }
  const addToCartHnadler = async () => {
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock <= 0) {
      window.alert('Sorry Product is Not avalaible');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: 1 } });
    router.push('/cart');
  };
  return (
    <Layout title={product.name}>
      <div className={classes.section}>
        <NextLink href="/">
          <Button variant="outlined" color="primary">
            Back To Home
          </Button>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography variant="h5">{product.name}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Rating: {product.rating} stars , {product.numReviews} reviews
              </Typography>
            </ListItem>

            <ListItem>
              <Typography>Desctiption: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <List>
              <ListItem>
                <Grid container spacing={1}>
                  <Grid item md={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item md={6}>
                    <Typography>₹{product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container spacing={1}>
                  <Grid item md={6}>
                    <Typography>Stack</Typography>
                  </Grid>
                  <Grid item md={6}>
                    <Typography>
                      {product.countInStock < 0 ? '0' : product.countInStock}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  onClick={addToCartHnadler}
                >
                  Add to Cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};
export default Products;

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
