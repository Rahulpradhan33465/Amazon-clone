import Head from 'next/head';
import React, { useContext, useState } from 'react';
import {
  AppBar,
  Container,
  Typography,
  Toolbar,
  ThemeProvider,
  Switch,
  CssBaseline,
  Badge,
  Link,
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';
import useStyles from './styles';
import NextLink from 'next/link';
import { Store } from '../../utils/Store';
import Cookies from 'js-cookie';
import { ShoppingBasket } from '@material-ui/icons';
import { useRouter } from 'next/router';
const Layout = ({ children, title }) => {
  const classes = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;
  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };
  const logOutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });

    router.push('/');
  };
  const theme = createTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });
  const SwitchThemeColor = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newCookie = !darkMode;
    Cookies.set('darkMode', newCookie ? 'ON' : 'OFF');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.layout}>
        <Head>
          <title>{title ? `${title}` : 'BRAND'}</title>
          <meta name="description" content="A amazon clone by Rahul Pradhan" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <AppBar position="sticky" className={classes.navbar}>
          <Toolbar>
            <NextLink href="/" passHref>
              <Typography variant="h5" className={classes.link}>
                BRAND
              </Typography>
            </NextLink>
            <div className={classes.grow}></div>
            <div className={classes.right}>
              <Switch checked={darkMode} onChange={SwitchThemeColor} />
              <NextLink href="/cart" passHref>
                <Link>
                  {cart.cartItems.length > 0 ? (
                    <Badge badgeContent={cart.cartItems.length} color="primary">
                      <ShoppingBasket className={classes.bag} />
                    </Badge>
                  ) : (
                    <ShoppingBasket className={classes.bag} />
                  )}
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    className={classes.navButton}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, '/orderHistory')}
                    >
                      Order History
                    </MenuItem>
                    <MenuItem onClick={logOutClickHandler}>Log out</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Typography variant="subtitle1" className={classes.link}>
                    Login
                  </Typography>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Typography>
            Amazon Clone by <span>Rahul Pradhan</span>
          </Typography>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
