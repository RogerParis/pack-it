import Constants from 'expo-constants';

import axios from 'axios';

const API_KEY = Constants.expoConfig?.extra?.OPEN_WEATHER_API_KEY;

export const getWeatherForecast = async (location: string) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
    location,
  )}&appid=${API_KEY}&units=metric`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
};
