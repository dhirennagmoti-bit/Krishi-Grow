export default async function handler(req, res) {
  // CORS configuration
  const origin = req.headers.origin || '';
  const allowedOrigins = [
    'https://krishigrow.in',
    'https://krishi-grow.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
  ];

  const isAllowedOrigin = !origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app');

  if (isAllowedOrigin && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON payload' });
      }
    }
    const { prompt, language = 'en-IN' } = body || {};

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (prompt.length > 2000) {
      return res.status(400).json({ error: 'Prompt exceeds maximum length' });
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.VITE_GOOGLE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'AI service is temporarily unavailable. API Key is missing.'
      });
    }

    // Mock Functions
    const fetchWeatherData = () => {
      return "Current weather in your region: 28°C, Partly cloudy, Humidity 65%. Light rain expected in the evening.";
    };

    const fetchCropData = (crop) => {
      if (crop.toLowerCase().includes('tomato') || crop.toLowerCase().includes('टमाटर') || crop.toLowerCase().includes('टोमॅटो')) {
        return "Tomato (टोमॅटो): Avoid excess watering. For early blight, apply Mancozeb 2.5g/liter. Market demand is currently high.";
      } else if (crop.toLowerCase().includes('onion') || crop.toLowerCase().includes('प्याज') || crop.toLowerCase().includes('कांदा')) {
        return "Onion (कांदा): Ensure proper drainage. Watch out for Thrips. Apply Imidacloprid if needed. Good time to hold stocks in cold storage.";
      }
      return "General Crop Advice: Maintain optimal soil moisture and monitor for pests regularly.";
    };

    const fetchMandiData = () => {
      return "Latest APMC Mandi Rates (Lasalgaon): Onions at ₹2400-₹2800 per quintal. Tomatoes at ₹1500-₹2000 per quintal. Prices are showing an upward trend this week.";
    };

    // Gather context
    const weatherContext = fetchWeatherData();
    const cropContext = fetchCropData(prompt);
    const mandiContext = fetchMandiData();

    // Map language hint to explicit language instruction
    let languageInstruction = "Reply in the exact same language the user spoke.";
    if (language.startsWith('hi')) {
      languageInstruction = "Reply strictly in Hindi (Devanagari script) in a conversational, helpful tone.";
    } else if (language.startsWith('mr')) {
      languageInstruction = "Reply strictly in Marathi (Devanagari script) in a conversational, helpful tone.";
    } else if (language.startsWith('en')) {
      languageInstruction = "Reply strictly in English in a conversational, helpful tone.";
    }

    const systemInstruction = `You are Krishi Grow AI, an expert, friendly agricultural voice assistant for Indian farmers.
Your goal is to answer the user's voice query clearly and concisely, as it will be read aloud via Text-to-Speech.
Do not use markdown formatting like **bold**, *italics*, or bullet points (- or *) in your response, as the TTS engine will try to read them aloud awkwardly. 
Keep sentences short and natural.

${languageInstruction}

Use the following real-time data to inform your answer if relevant:
[Weather Data]: ${weatherContext}
[Crop Advice]: ${cropContext}
[Mandi Prices]: ${mandiContext}`;

    const formattedContents = [
      {
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\nUser Spoke: ${prompt.trim()}` }]
      }
    ];

    // Use gemini-1.5-flash for faster voice responses
    const model = 'gemini-1.5-flash-latest';
    const apiVersion = 'v1beta';

    const response = await fetch(
      `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: formattedContents }),
      }
    );

    const data = await response.json();

    if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return res.status(200).json({ text: data.candidates[0].content.parts[0].text });
    }

    console.error("Gemini API Error:", data);
    return res.status(500).json({
      error: 'AI service was unable to generate a response at this time.'
    });
  } catch (error) {
    console.error("Internal Server Error in voice-assistant:", error);
    return res.status(500).json({ error: 'Internal server error while processing AI request' });
  }
}
