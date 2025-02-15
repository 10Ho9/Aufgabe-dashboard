// material-ui
import { useTheme } from '@mui/material/styles';

// project imports
import logoPng from 'assets/images/logo.png';

// ==============================|| LOGO ||============================== //

export default function Logo() {
  const theme = useTheme();

  return <img src={logoPng} width="50" height="50" />;
}
