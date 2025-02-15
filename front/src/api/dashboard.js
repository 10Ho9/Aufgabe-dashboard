export async function fetchDashboardData(date) {
  const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
  try {
    const response = await fetch(`${baseUrl}/sales/${date}`);

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
