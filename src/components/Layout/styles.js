import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  navbar: {
    backgroundColor: '#203040',
    '& h5': {
      color: '#fff',
      marginLeft: 20,
      fontWeight: 'bold',
      textDecoration: 'none',
    },
  },
  main: {
    padding: '20px',
  },
  grow: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: '#203040',
    color: '#fff',
    textAlign: 'center',
    padding: '20px 5px',
    ' & span': {
      color: 'cyan',
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
  },
  layout: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    height: '100vh',
  },
  link: {
    textDecoration: 'none',
    cursor: 'pointer',
    color: '#fff',
    margin: '0px 9px',
  },
  right: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bag: {
    color: '#fff',
  },
  navButton: {
    background: 'inherit',
    color: '#fff',
  },
});

export default useStyles;
