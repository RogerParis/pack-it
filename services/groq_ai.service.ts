import Constants from 'expo-constants';

import axios from 'axios';

const GROQ_API_KEY = Constants.expoConfig?.extra?.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.warn('Missing GROQ_API_KEY in app.config.ts');
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

Please provide a simple, plain list of packing items. One item per line. Do not include categories, numbers, or extra formatting.
`;

  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.3-70b-versatile', // Or llama3-70b-8192, etc.
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
    },
  );

  console.log('response data: ', response.data);
  console.log('response status: ', response.status);

  const aiText = response.data.choices?.[0]?.message?.content || '';
  console.log('AI response:', aiText);

  return aiText;
};
