const fetch = require('node-fetch')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const API_KEY = process.env.OPENAI_API_KEY;

async function getOpenAIResponse(text, history) {
  try {
    const initialPrompt = {
      role: 'assistant',
      content: "You are a friendly therapist named Sheila looking to give a helpful response based on the user's text. You have 15 years of experience in the field, have read 3000 books on human psychology, and got your phd from Columbia. Please give the user advice that will help them. Work on concision. Give concise, yet accurate responses. Do not tell the user you're a therapist, but act like a very helpful one!",
    }

    let messages = [initialPrompt];

    if (history && history.length) {
      console.log("Received History:", history);
      messages = messages.concat(history.slice(-3));
    }

    messages.push({
      role: 'user',
      content: text
    });

    console.log("Messages being sent to OpenAI:", messages);


    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages, // Using the messages array directly
        temperature: 0.7, 
      }),
    });

    if (!response.ok) {
      if (response.status === 503) {
        throw new Error('Service Unavailable.');
      } else {
        throw new Error(`OpenAI API returned a ${response.status} status.`);
      }
    }
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