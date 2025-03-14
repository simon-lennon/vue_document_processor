import axios from 'axios';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

const claudeClient = axios.create({
  baseURL: CLAUDE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
    'anthropic-version': '2023-06-01',
  },
});

export const claudeService = {
  async analyzeDocument(prompt) {
    try {
      const response = await claudeClient.post('', {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      // Extract the Claude response text
      const responseText = response.data.content[0].text;
      
      // Parse the JSON from the response
      // Find JSON content within the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If no valid JSON found, throw error
      throw new Error('Failed to parse JSON from Claude response');
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw error;
    }
  },
};
