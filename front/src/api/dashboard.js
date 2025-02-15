const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

export async function fetchDashboardData(date) {
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

export async function fetchAvailableMonths() {
  try {
    const response = await fetch(`${baseUrl}/sales/available-months`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || !data.every((item) => /^\d{6}$/.test(item))) {
      throw new Error('Invalid API response. Expected an array of strings in YYYYMM format. Received: ' + JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('Error fetching available months:', error);
    throw error;
  }
}
