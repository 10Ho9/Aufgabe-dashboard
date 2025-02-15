import { useEffect, useState, useMemo } from 'react';

// material-ui
import Grid from '@mui/material/Grid2';

// project imports
import SalesStatusCard from './SalesStatusCard';
import SalesTargetCard from './SalesTargetCard';
import WelcomeCard from './WelcomeCard';
import WeatherDateCard from './WeatherDateCard';
import SalesPerformanceChart from './SalesPerformanceChart';

import { gridSpacing } from 'store/constant';

import { fetchDashboardData } from '../../api/dashboard';

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const today = useMemo(() => {
    return new Date(2025, 2, 31);
  }, []);
  const [isLoading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  const yearMonth = `${today.getFullYear()}0${today.getMonth() + 1}`;

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchDashboardData(yearMonth);
        setDashboardData(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [yearMonth]);

  const { dayData, dayTarget, daySales, monthSales, monthTarget, monthProgress, dayProgress } = useMemo(() => {
    if (!dashboardData) {
      return {
        dayData: null,
        dayTarget: 0,
        monthTarget: 0,
        daySales: 0,
        monthSales: 0,
        monthProgress: 0,
        dayProgress: 0
      };
    }
    const todayData = dashboardData.dailySales.find((item) => item.day === today.getDate());
    const workingDays = dashboardData.workingDaysCount;
    const dayTarget = parseFloat((dashboardData.plannedSales / workingDays).toFixed(1));
    const monthProg = dashboardData.plannedSales > 0 ? (dashboardData.actualSales / dashboardData.plannedSales) * 100 : 0;
    const dayProg = todayData.sales > 0 ? (todayData.sales / dayTarget) * 100 : 0;

    return {
      dayData: todayData,
      dayTarget: dayTarget,
      daySales: todayData.sales,
      monthSales: dashboardData.actualSales,
      monthTarget: dashboardData.plannedSales,
      monthProgress: monthProg,
      dayProgress: dayProg
    };
  }, [dashboardData, today]);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <SalesStatusCard
              isLoading={isLoading}
              monthSales={monthSales}
              monthProgress={monthProgress}
              daySales={daySales}
              dayProgress={dayProgress}
            />
          </Grid>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <SalesTargetCard
              isLoading={isLoading}
              monthProgress={monthProgress}
              monthTarget={monthTarget}
              dayProgress={dayProgress}
              dayTarget={dayTarget}
            />
          </Grid>
          <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <WelcomeCard />
              </Grid>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <WeatherDateCard date={'2025-03-31'} weekday={dayData ? dayData.weekday : ''} weather="cloudy" temperature={'-3 / 5'} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={12}>
            <SalesPerformanceChart />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
