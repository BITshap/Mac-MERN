const fetch = require('node-fetch')
const env = require('../.env');

const API_KEY = env.openAIkey;

async function getOpenAIResponse(text) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'assistant', content: "You are a friendly therapist looking to give a helpful response based on the user's text. You have 15 years of experience in the field, have read 3000 books on human psychology, and got your phd from Columbia."},
          { role: 'user', content: text },
          { role: 'assistant', content: ' ' },
        ],
        temperature: 0.7,
      }),
    });

    // Convert the response to JSON
    const responseData = await response.json();

    // Remove any circular references (if any)
    const sanitizedData = removeCircularReferences(responseData);
    console.log(sanitizedData)
    return sanitizedData.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('An error occurred while processing the request.');
  }
}

function removeCircularReferences(obj, seen = new WeakSet()) {
  if (typeof obj === 'object' && obj !== null) {
    if (seen.has(obj)) {
      return null; // Break the circular reference
    }
    seen.add(obj);
    for (const key in obj) {
      obj[key] = removeCircularReferences(obj[key], seen);
    }
  }
  return obj;
}



module.exports = { getOpenAIResponse };