const VITE_APP_API_BASE_URL = 'http://localhost:3000';

export async function fetchDashboardData(date) {
  try {
    const response = await fetch(`${VITE_APP_API_BASE_URL}/sales/${date}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}
