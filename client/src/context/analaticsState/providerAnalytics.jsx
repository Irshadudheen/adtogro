import { useState, useEffect } from 'react';
import AnalyticsContext from './analaticsState';
import { fetchAnalytics } from '../../Api/analytics';

const AnalyticsProvider = ({ children }) => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
const callAnalytics = async () => {
  try {
    const response = await fetchAnalytics()
    setAnalyticsData(response);
  } catch (error) {
    throw error;
  }
}
    callAnalytics();
  }, []);
console.log(analyticsData, 'the analytics data from provider');
  return (
    <AnalyticsContext.Provider value={analyticsData}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;
