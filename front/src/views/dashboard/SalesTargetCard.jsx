import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

export default function SalesTargetCard({ isLoading, monthProgress, monthTarget, dayProgress, dayTarget }) {
  const theme = useTheme();

  const [timeValue, setTimeValue] = React.useState(false);
  const handleChangeTime = (event, newValue) => {
    setTimeValue(newValue);
  };

  const progressValue = timeValue ? dayProgress : monthProgress;
  const targetValue = timeValue ? dayTarget : monthTarget;
  const targetLabel = timeValue ? 'Tagesziel' : 'Monatsziel';
  const getProgressColor = (value) => {
    if (value >= 90) {
      return theme.palette.success.main;
    } else if (value >= 70) {
      return theme.palette.success.light;
    } else if (value >= 50) {
      return theme.palette.warning.main;
    } else {
      return theme.palette.error.main;
    }
  };
  const progressColor = getProgressColor(progressValue);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: 'primary.dark',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            '&>div': {
              position: 'relative',
              zIndex: 5
            },
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.primary[800],
              borderRadius: '50%',
              top: { xs: -85 },
              right: { xs: -95 }
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.primary[800],
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
                        sx={{ color: 'inherit', mr: 1 }}
                        onClick={(e) => handleChangeTime(e, true)}
                      >
                        Tag
                      </Button>
                      <Button
                        disableElevation
                        variant={!timeValue ? 'contained' : 'text'}
                        size="small"
                        sx={{ color: 'inherit' }}
                        onClick={(e) => handleChangeTime(e, false)}
                      >
                        Monat
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid>
                <Grid container sx={{ alignItems: 'center' }}>
                  <Grid size={6}>
                    <Grid container sx={{ alignItems: 'baseline', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                          sx={{
                            fontSize: '5rem',
                            fontWeight: 500
                          }}
                        >
                          {targetValue.toLocaleString('de-DE')}
                        </Typography>
                        <DirectionsCarIcon sx={{ fontSize: '5rem', ml: 1, mr: 1, color: progressColor }} />
                      </Box>
                      <Grid size={12}>
                        <Typography
                          sx={{
                            fontSize: '1.2rem',
                            fontWeight: 500,
                            color: 'primary.200'
                          }}
                        >
                          {targetLabel}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    size={6}
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress
                        variant="determinate"
                        value={progressValue > 100 ? 100 : progressValue}
                        size={100}
                        thickness={4}
                        sx={{
                          color: progressColor,
                          '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round'
                          },
                          '& .MuiCircularProgress-circleIndeterminate': {
                            animation: 'none'
                          },
                          '& .MuiCircularProgress-circleDeterminate': {
                            transition: 'stroke-dashoffset 0.3s ease-in-out'
                          }
                        }}
                      />
                      {progressValue <= 0 && (
                        <CircularProgress
                          variant="determinate"
                          value={100}
                          size={100}
                          thickness={4}
                          sx={{
                            color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            '& .MuiCircularProgress-circle': {
                              strokeLinecap: 'round'
                            }
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography
                          variant="h5"
                          component="div"
                          sx={{
                            color: 'inherit',
                            fontWeight: 'bold',
                            fontSize: '1.25rem'
                          }}
                        >
                          {`${Math.round(progressValue)}%`}
                        </Typography>
                      </Box>
                    </Box>
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

SalesTargetCard.propTypes = {
  isLoading: PropTypes.bool,
  monthProgress: PropTypes.number,
  monthTarget: PropTypes.number,
  dayProgress: PropTypes.number,
  dayTarget: PropTypes.number
};
