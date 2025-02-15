import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

// third party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import useConfig from 'hooks/useConfig';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

export default function SalesPerformanceChart({ isLoading, dailySales, dayTarget }) {
  const theme = useTheme();
  const { mode } = useConfig();

  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const divider = theme.palette.divider;
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.primary[200];
  const error = theme.palette.error.main;

  const [chartData, setChartData] = useState({
    series: [],
    options: {}
  });

  const [totalSales, setTotalSales] = useState(0);
  const [chartTitle, setChartTitle] = useState('Gesamt Verkauf');
  const [targetExceededCount, setTargetExceededCount] = useState(0);
  const [totalWorkingDays, setTotalWorkingDays] = useState(0);
  const [exceedPercentage, setExceedPercentage] = useState(0);
  useEffect(() => {
    function getFilteredSales(data) {
      return data
        .filter((item) => item.isWorkingDay)
        .map((item) => ({
          ...item,
          exceedsTarget: item.sales >= dayTarget
        }));
    }

    const filteredSales = dailySales ? getFilteredSales(dailySales) : [];
    const currentTargetExceededCount = filteredSales.filter((item) => item.exceedsTarget).length;
    setTargetExceededCount(currentTargetExceededCount);

    const currentTotalWorkingDays = filteredSales.length;
    setTotalWorkingDays(currentTotalWorkingDays);

    const currentExceedPercentage = currentTotalWorkingDays > 0 ? (currentTargetExceededCount / currentTotalWorkingDays) * 100 : 0;
    setExceedPercentage(currentExceedPercentage.toFixed(2));

    const sales = filteredSales.map((item) => {
      return { sales: item.sales, exceedsTarget: item.exceedsTarget };
    });
    const dates = filteredSales.map((item) => item.date.substring(0, 10));
    const currentTotalSales = sales.reduce((acc, item) => acc + item.sales, 0);

    setTotalSales(currentTotalSales);

    let title = 'Gesamt Verkauf';
    const monthNames = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember'
    ];

    if (dailySales && dailySales.length > 0) {
      const firstDate = new Date(dailySales[0].date);
      const monthIndex = firstDate.getMonth();
      const year = firstDate.getFullYear();
      title = `${monthNames[monthIndex]} ${year} Gesamt Verkauf`;
    }
    setChartTitle(title);

    const newChartData = {
      series: [
        {
          name: 'Verkauf',
          type: 'column',
          data: sales.map((item) => item.sales)
        }
      ],
      options: {
        chart: { id: `bar-chart`, type: 'bar' },
        xaxis: {
          categories: dates,
          labels: {
            style: { colors: primary, fontSize: '12px' },
            rotate: -45,
            rotateAlways: true,
            formatter: function (value) {
              const date = new Date(value);
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const weekday = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][date.getDay()];
              return `${weekday} ${month}/${day} `;
            }
          },
          tooltip: {
            enabled: false
          },
          tickAmount: 'dataPoints'
        },
        yaxis: {
          title: { text: 'Verkauf', style: { color: primary } },
          labels: { style: { colors: primary, fontSize: '12px' } },
          max: function (max) {
            return max + 1;
          }
        },
        tooltip: {
          theme: mode,
          style: {
            color: '#000',
            fontSize: '15px',
            opacity: 1
          }
        },
        legend: { labels: { colors: grey500 } },
        plotOptions: {
          bar: {
            columnWidth: '50%',
            borderRadius: 4
          }
        },
        annotations: {
          yaxis: [
            {
              y: dayTarget,
              borderColor: error,
              borderWidth: 2,
              label: {
                borderColor: error,
                style: {
                  color: '#fff',
                  background: error,
                  fontSize: '12px'
                },
                text: 'Tagesziel',
                offsetX: 10,
                offsetY: -2
              }
            }
          ]
        }
      }
    };

    setChartData(newChartData);
  }, [dailySales, dayTarget, primary200, primary, darkLight, divider, grey500, mode, error]);

  useEffect(() => {
    if (!isLoading) {
      ApexCharts.exec(`bar-chart`, 'updateOptions', chartData.options, false, true);
      ApexCharts.exec(`bar-chart`, 'updateSeries', chartData.series, true);
    }
  }, [isLoading, chartData]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid size={12}>
              <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Grid>
                  <Grid container direction="column" spacing={1}>
                    <Grid>
                      <Typography variant="subtitle2">{chartTitle}</Typography>
                    </Grid>
                    <Grid>
                      <Typography variant="h3">{totalSales} Autos</Typography>
                    </Grid>
                    <Grid>
                      <Typography variant="subtitle2">
                        An {targetExceededCount} von {totalWorkingDays} Arbeitstagen wurde das Tagesziel überschritten ({exceedPercentage}
                        %)
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              size={12}
              sx={{
                ...theme.applyStyles('light', {
                  '& .apexcharts-series:nth-of-type(4) path:hover': {
                    filter: `brightness(0.95)`,
                    transition: 'all 0.3s ease'
                  }
                }),
                '& .apexcharts-menu': {
                  bgcolor: 'background.paper'
                },
                '.apexcharts-theme-light .apexcharts-menu-item:hover': {
                  bgcolor: 'dark.main'
                },
                '& .apexcharts-theme-light .apexcharts-menu-icon:hover svg, .apexcharts-theme-light .apexcharts-reset-icon:hover svg, .apexcharts-theme-light .apexcharts-selection-icon:not(.apexcharts-selected):hover svg, .apexcharts-theme-light .apexcharts-zoom-icon:not(.apexcharts-selected):hover svg, .apexcharts-theme-light .apexcharts-zoomin-icon:hover svg, .apexcharts-theme-light .apexcharts-zoomout-icon:hover svg':
                  {
                    fill: theme.palette.grey[400]
                  }
              }}
            >
              <Chart {...chartData} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
}

SalesPerformanceChart.propTypes = {
  isLoading: PropTypes.bool,
  dailySales: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      day: PropTypes.number.isRequired,
      sales: PropTypes.number.isRequired,
      isWorkingDay: PropTypes.bool.isRequired,
      date: PropTypes.string.isRequired,
      weekday: PropTypes.string.isRequired
    })
  ).isRequired,
  dayTarget: PropTypes.number
};
