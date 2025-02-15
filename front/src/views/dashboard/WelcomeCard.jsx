import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles'; // styled import 추가

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import WavingHandIcon from '@mui/icons-material/WavingHand'; // 손 흔드는 아이콘 👋

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.light,
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

export default function WelcomeCard({ isLoading, userName = 'Mats' }) {
  const theme = useTheme();

  return (
    <>
      <CardWrapper border={false} content={false}>
        <Box sx={{ p: 2 }}>
          <List sx={{ py: 0 }}>
            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.largeAvatar,
                    bgcolor: 'primary.800',
                    color: '#fff'
                  }}
                >
                  <WavingHandIcon fontSize="inherit" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                sx={{
                  py: 0,
                  mt: 0.45,
                  mb: 0.45
                }}
                primary={
                  <Typography variant="h4" sx={{ color: '#fff', fontSize: '1.5rem' }}>
                    Willkommen, {userName}!
                  </Typography>
                }
                secondary={
                  <Typography variant="subtitle2" sx={{ color: 'primary.light', mt: 0.25 }}>
                    Schön, dass du da bist!
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Box>
      </CardWrapper>
    </>
  );
}

WelcomeCard.propTypes = {
  userName: PropTypes.string
};
