// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// project imports
import LogoSection from '../LogoSection';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

export default function Header() {
  const theme = useTheme();

  return (
    <>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <LogoSection />
        <Typography variant="h1" component="h1" sx={{ ml: 2, fontWeight: 600, fontSize: '1.75rem' }}>
          Verkauf Dashboard
        </Typography>
      </Box>
    </>
  );
}
