import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function SalesStatusCard({ isLoading, monthSales, monthProgress, daySales, dayProgress }) {
  const theme = useTheme();

  const [timeValue, setTimeValue] = React.useState(false);
  const handleChangeTime = (event, newValue) => {
    setTimeValue(newValue);
  };

  const progressValue = timeValue ? dayProgress : monthProgress;
  const salesValue = timeValue ? daySales : monthSales;
  const salesLabel = timeValue ? 'Tagesverkauf' : 'Monatsverkauf';

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: 'secondary.dark',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            height: '100%',
            '&>div': {
              position: 'relative',
              zIndex: 5
            },
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.secondary[800],
              borderRadius: '50%',
              top: { xs: -85 },
              right: { xs: -95 }
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.secondary[800],
              borderRadius: '50%',
              top: { xs: -125 },
              right: { xs: -15 },
              opacity: 0.5
            }
          }}
        >
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid>
                <Grid container sx={{ justifyContent: 'space-between' }}>
                  <Grid></Grid>
                  <Grid>
                    <Box sx={{ mb: 2 }}>
                      <Button
                        disableElevation
                        variant={timeValue ? 'contained' : 'text'}
                        size="small"
                        sx={{
                          bgcolor: timeValue ? 'secondary.main' : 'transparent',
                          color: timeValue ? 'white' : 'inherit',
                          mr: 1
                        }}
                        onClick={(e) => handleChangeTime(e, true)}
                      >
                        Tag
                      </Button>
                      <Button
                        disableElevation
                        variant={!timeValue ? 'contained' : 'text'}
                        size="small"
                        sx={{
                          bgcolor: !timeValue ? 'secondary.main' : 'transparent',
                          color: !timeValue ? 'white' : 'inherit'
                        }}
                        onClick={(e) => handleChangeTime(e, false)}
                      >
                        Monat
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container sx={{ justifyContent: 'space-between' }}>
                  <Grid>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}></Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid>
                <Grid container sx={{ alignItems: 'center' }}>
                  <Grid size={6}>
                    <Grid container sx={{ alignItems: 'baseline', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex' }}>
                        <Typography
                          sx={{
                            fontSize: '4.8rem',
                            fontWeight: 500,
                            mr: 2
                          }}
                        >
                          {salesValue.toLocaleString('de-DE')}
                        </Typography>
                        <Avatar
                          sx={{
                            ...theme.typography.Avatar,
                            bgcolor: progressValue >= 100 ? 'success.main' : progressValue >= 50 ? 'warning.main' : 'error.main',
                            color:
                              progressValue >= 100
                                ? 'success.contrastText'
                                : progressValue >= 50
                                  ? 'warning.contrastText'
                                  : 'error.contrastText'
                          }}
                        >
                          {progressValue >= 100 ? <TrendingUpIcon fontSize="inherit" /> : <TrendingDownIcon fontSize="inherit" />}
                        </Avatar>
                      </Box>
                      <Grid size={12}>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 500, color: 'secondary.200' }}>{salesLabel}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
}

SalesStatusCard.propTypes = {
  isLoading: PropTypes.bool,
  monthSales: PropTypes.number,
  monthProgress: PropTypes.number,
  daySales: PropTypes.number,
  dayProgress: PropTypes.number
};
