import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';
import Layout from '../components/Layout/Layout';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import db from '../utils/db';
import Product from '../models/Product';

export default function Home({ products }) {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Layout>
        <h1>Products</h1>
        {/* Render Products */}
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item key={product.name} md={4} xs={12}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                    />
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>₹{product.price}</Typography>
                  <Button
                    color="primary"
                    size="small"
                    onClick={() => router.push(`/product/${product.slug}`)}
                  >
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Layout>
    </div>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
