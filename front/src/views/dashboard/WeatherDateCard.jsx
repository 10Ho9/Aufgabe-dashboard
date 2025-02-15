import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2'; // Grid 추가

// project imports
import MainCard from 'ui-component/cards/MainCard';

// weather icons
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';

const CardWrapper = styled(MainCard)(({ theme, weather }) => {
  const weatherBackgrounds = {
    sunny: {
      bgColor: '#FFA07A',
      color: theme.palette.getContrastText('#FFA07A')
    },
    cloudy: {
      bgColor: '#87CEEB',
      color: theme.palette.getContrastText('#87CEEB')
    },
    rainy: {
      bgColor: '#4682B4',
      color: theme.palette.getContrastText('#4682B4')
    },
    snowy: {
      bgColor: '#B0E2FF',
      color: theme.palette.getContrastText('#B0E2FF')
    },
    stormy: {
      bgColor: '#6A5ACD',
      color: theme.palette.getContrastText('#6A5ACD')
    }
  };

  const selectedBackground = weatherBackgrounds[weather] || weatherBackgrounds.sunny;

  return {
    backgroundColor: selectedBackground.bgColor,
    color: selectedBackground.color,
    overflow: 'hidden',
    position: 'relative'
  };
});

const weatherIcons = {
  sunny: <WbSunnyIcon fontSize="large" />,
  cloudy: <WbCloudyIcon fontSize="large" />,
  rainy: <UmbrellaIcon fontSize="large" />,
  snowy: <AcUnitIcon fontSize="large" />,
  stormy: <ThunderstormIcon fontSize="large" />
};

export default function WeatherDateCard({ date, weekday, weather, temperature }) {
  const theme = useTheme();

  const WeatherIcon = weatherIcons[weather] || weatherIcons.sunny;

  return (
    <CardWrapper border={false} content={false} weather={weather}>
      <Box sx={{ p: 2.25 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <ListItem alignItems="center" disableGutters sx={{ p: 0 }}>
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: 'transparent',
                    color: '#fff',
                    width: 'auto',
                    height: 'auto'
                  }}
                >
                  {WeatherIcon}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                sx={{
                  py: 0,
                  mt: 0.45,
                  mb: 0.45
                }}
                primary={
                  <Typography variant="h2" sx={{ color: '#fff' }}>
                    {temperature}°C
                  </Typography>
                }
              />
            </ListItem>
          </Grid>
          <Grid>
            <Typography variant="h4" sx={{ color: '#fff', fontSize: '1.5rem' }}>
              {date.substring(0, 10)}
            </Typography>
            <Typography variant="h5" sx={{ color: '#fff', fontSize: '1.2rem', textAlign: 'right' }}>
              {weekday}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </CardWrapper>
  );
}

WeatherDateCard.propTypes = {
  date: PropTypes.string.isRequired,
  weekday: PropTypes.string.isRequired,
  weather: PropTypes.oneOf(['sunny', 'cloudy', 'rainy', 'snowy', 'stormy']).isRequired,
  temperature: PropTypes.string.isRequired
};
