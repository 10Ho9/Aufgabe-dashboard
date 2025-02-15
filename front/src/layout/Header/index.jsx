// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// project imports
import LogoSection from '../LogoSection';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

export default function Header() {
  const theme = useTheme();

  return (
    <>
      <Box sx={{ auto: 228, display: 'flex' }}>
        <LogoSection />
      </Box>
    </>
  );
}
