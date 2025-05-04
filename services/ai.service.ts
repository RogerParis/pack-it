import Constants from 'expo-constants';

import axios from 'axios';

const OPENAI_API_KEY = Constants.expoConfig?.extra?.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn('Missing OPENAI_API_KEY in app.config.ts');
}

export const getPackingSuggestionsFromAI = async (
  location: string,
  startDate: Date | null,
  endDate: Date | null,
  activities: string,
  weather: string,
) => {
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

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 50,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    },
  );

  console.log('AI response:', response.data);
  const aiText = response.data.choices?.[0]?.message?.content || '';
  return aiText;
};
