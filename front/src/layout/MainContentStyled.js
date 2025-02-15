// material-ui
import { styled } from '@mui/material/styles';

// ==============================|| MAIN LAYOUT - STYLED ||============================== //

const MainContentStyled = styled('main', {
  shouldForwardProp: (prop) => prop !== 'borderRadius'
})(({ theme, borderRadius }) => ({
  backgroundColor: theme.palette.grey[100],
  width: '100%',
  minHeight: 'calc(100vh - 88px)',
  flexGrow: 1,
  padding: 20,
  marginTop: 88,
  marginRight: 20,
  borderRadius: `${borderRadius}px`,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,

  [theme.breakpoints.down('md')]: {
    marginLeft: 20,
    padding: 16,
    marginTop: 88
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: 10,
    marginRight: 10,
    padding: 10
  }
}));

export default MainContentStyled;
