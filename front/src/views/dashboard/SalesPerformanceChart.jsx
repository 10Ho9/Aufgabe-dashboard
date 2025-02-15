import PropTypes from 'prop-types';
import React, { useState, useEffect, useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

// calendar-ui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { de } from 'date-fns/locale';
import { isBefore, isAfter } from 'date-fns';

// third party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

import { fetchAvailableMonths, fetchDashboardData } from 'api/dashboard';

export default function SalesPerformanceChart() {
  const theme = useTheme();

  const { primary } = theme.palette.text;
  const grey500 = theme.palette.grey[500];
  const error = theme.palette.error.main;

  const [chartData, setChartData] = useState({
    series: [],
    options: {}
  });

  const [selectedDate, setSelectedDate] = useState(new Date(2025, 2, 31));
  const [availableMonths, setAvailableMonths] = useState([]);
  const [loadingMonths, setLoadingMonths] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [monthlySalesData, setMonthlySalesData] = useState(null);
  const [loadingSales, setLoadingSales] = useState(false);
  const [salesError, setSalesError] = useState(null);

  const minDate = new Date(2025, 0, 1);
  const maxDate = new Date(2025, 11, 31);
  useEffect(() => {
    async function fetchMonths() {
      try {
        const months = await fetchAvailableMonths();
        setAvailableMonths(months);
      } catch (error) {
        setApiError(error);
        console.error('Error fetching available months:', error);
      } finally {
        setLoadingMonths(false);
      }
    }

    fetchMonths();
  }, []);

  useEffect(() => {
    async function fetchMonthlySales(yearMonth) {
      try {
        setLoadingSales(true);
        setSalesError(null);
        const data = await fetchDashboardData(yearMonth);
        setMonthlySalesData(data);
      } catch (error) {
        setSalesError(error);
        console.error('Error fetching sales data:', error);
      } finally {
        setLoadingSales(false);
      }
    }

    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const yearMonth = `${year}${month}`;
      fetchMonthlySales(yearMonth);
    }
  }, [selectedDate]);

  const chartDataMemo = useMemo(() => {
    if (!monthlySalesData) {
      return { series: [], options: {} };
    }

    const { dailySales, plannedSales, workingDaysCount, actualSales } = monthlySalesData;
    const dayTarget = parseFloat((plannedSales / workingDaysCount).toFixed(1));

    const filteredSales = dailySales
      .filter((item) => item.isWorkingDay)
      .map((item) => ({
        ...item,
        exceedsTarget: item.sales >= dayTarget
      }));

    const currentTargetExceededCount = filteredSales.filter((item) => item.exceedsTarget).length;
    const currentTotalWorkingDays = filteredSales.length;
    const currentExceedPercentage = currentTotalWorkingDays > 0 ? (currentTargetExceededCount / currentTotalWorkingDays) * 100 : 0;

    const sales = filteredSales.map((item) => item.sales);
    const dates = filteredSales.map((item) => item.date);

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
    const selectedMonth = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const selectedYear = selectedDate.getFullYear();
    const chartTitle = `${monthNames[parseInt(selectedMonth) - 1]} ${selectedYear}`;

    const formattedTotalSales = actualSales.toLocaleString('de-DE');

    return {
      series: [
        {
          name: 'Verkauf',
          type: 'column',
          data: sales
        }
      ],
      options: {
        chart: { id: `bar-chart`, type: 'bar' },
        xaxis: {
          categories: dates,
          labels: {
            style: { colors: primary, fontSize: '12px', whiteSpace: 'pre-line' },
            rotate: -45,
            rotateAlways: true,
            formatter: function (value) {
              const date = new Date(value);
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const weekday = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][date.getDay()];
              return `${month}/${day}\n${weekday}`;
            }
          },
          tooltip: {
            enabled: false
          },
          tickAmount: 'dataPoints'
        },
        yaxis: {
          title: { text: 'Verkauf', style: { color: primary } },
          labels: {
            style: { colors: primary, fontSize: '12px' },
            formatter: (value) => value.toFixed(0)
          },
          min: 0,
          max: 10,
          tickAmount: 9
        },
        tooltip: {
          followCursor: true,
          style: {
            background: '#fff',
            color: '#000',
            fontSize: '15px'
          },
          y: {
            formatter: (value) => value.toLocaleString('de-DE')
          }
        },
        legend: { labels: { colors: grey500 } },
        plotOptions: {
          bar: {
            columnWidth: '50%',
            borderRadius: 4
          }
        },
        dataLabels: {
          enabled: false
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
                text: `Tagesziel ${dayTarget}`,
                offsetX: 5,
                offsetY: -2
              }
            }
          ]
        }
      },
      totalSales: formattedTotalSales,
      chartTitle,
      targetExceededCount: currentTargetExceededCount,
      totalWorkingDays: currentTotalWorkingDays,
      exceedPercentage: currentExceedPercentage.toFixed(2)
    };
  }, [monthlySalesData, primary, grey500, error, selectedDate]);

  useEffect(() => {
    ApexCharts.exec(`bar-chart`, 'updateOptions', chartDataMemo.options, false, true);
    ApexCharts.exec(`bar-chart`, 'updateSeries', chartDataMemo.series, true);
  }, [chartDataMemo]);

  return (
    <>
      <MainCard>
        <Grid container spacing={gridSpacing}>
          <Grid size={12}>
            <Grid container direction="column" spacing={1}>
              <Grid item={true}>
                <Typography variant="h2">{chartDataMemo.chartTitle}</Typography>
              </Grid>
              <Grid item={true}>
                <Typography variant="h3">Insgesamt {chartDataMemo.totalSales} Autos verkaufen</Typography>
              </Grid>
              <Grid item={true}>
                <Typography variant="subtitle2">
                  An {chartDataMemo.targetExceededCount} von {chartDataMemo.totalWorkingDays} Arbeitstagen wurde das Tagesziel überschritten
                  ({chartDataMemo.exceedPercentage}%)
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1} justifyContent="flex-end" alignItems="center">
              <Grid item={true}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
                  <DatePicker
                    views={['month']}
                    openTo="month"
                    label="Monat"
                    minDate={minDate}
                    maxDate={maxDate}
                    value={selectedDate}
                    onChange={(newValue) => {
                      setSelectedDate(newValue);
                    }}
                    shouldDisableMonth={(date) => {
                      if (isBefore(date, minDate) || isAfter(date, maxDate)) {
                        return true;
                      }
                      if (loadingMonths) {
                        return true;
                      }
                      const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
                      return !availableMonths.includes(yearMonth);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} helperText={null} error={!!apiError} label={apiError ? 'error' : 'monats'} />
                    )}
                    disabled={loadingMonths}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item={true}>
                {loadingSales && <p>Loading sales data...</p>}
                {salesError && <p>Error: {salesError.message}</p>}
              </Grid>
            </Grid>
          </Grid>
          <Grid
            size={12}
            sx={{
              '& .apexcharts-series:nth-of-type(4) path:hover': {
                filter: `brightness(0.95)`,
                transition: 'all 0.3s ease'
              },
              '& .apexcharts-menu': {
                bgcolor: 'background.paper'
              },
              '.apexcharts-theme-light .apexcharts-menu-item:hover': {
                bgcolor: 'dark.main'
              },
              '& .apexcharts-theme-light .apexcharts-menu-icon:hover svg, .apexcharts-theme-light .apexcharts-reset-icon:hover svg, .apexcharts-theme-light .apexcharts-selection-icon:not(.apexcharts-selected):hover svg, .apexcharts-theme-light .apexcharts-zoom-icon:not(.apexcharts-selected):hover svg, .apexcharts-theme-light .apexcharts-zoomin-icon:hover svg, .apexcharts-theme-light .apexcharts-zoomout-icon:hover svg':
                {
                  fill: theme.palette.grey[500]
                }
            }}
          >
            <Chart options={chartDataMemo.options} series={chartDataMemo.series} type="bar" />
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
}
