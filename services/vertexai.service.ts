import { getApp } from '@react-native-firebase/app';
import { getGenerativeModel, getVertexAI } from '@react-native-firebase/vertexai';

export const getPackingSuggestionsFromAI = async (
  location: string,
  startDate: Date | null,
  endDate: Date | null,
  activities: string,
  weather: string,
) => {
  console.log('Generating packing suggestions...');
  const prompt = `
I am preparing for a trip and need to create a packing list.

Here are the trip details:
- Destination: ${location || 'Unknown'}
- Start Date: ${startDate ? startDate.toDateString() : 'Unknown'}
- End Date: ${endDate ? endDate.toDateString() : 'Unknown'}
- Activities: ${activities || 'None'}
- Weather forecast: ${weather || 'No forecast'}

Please provide a list of items I should pack for this trip.
`;

  const app = getApp();
  const vertexai = getVertexAI(app);
  const model = getGenerativeModel(vertexai, { model: 'gemini-1.5-flash' });

  const result = await model.generateContent(prompt);
  console.log('VertexAI result:', result);

  const text = result.response.text();
  console.log('VertexAI response:', text);

  return text;
};
