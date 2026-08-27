export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
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
        body = {};
      }
    }
    const { prompt, chatHistory = [] } = body || {};

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.VITE_GOOGLE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not set in Vercel Environment Variables. Please add GEMINI_API_KEY or VITE_GEMINI_API_KEY to your Vercel Project Settings and redeploy.'
      });
    }

    const systemInstruction = `You are AgriAI, an expert Indian agricultural value-chain and farming advisor assistant on Krishi Grow platform.
Your expertise covers:
1. Crop cultivation, plant health, disease management, and specific chemical or organic pesticide/fungicide recommendations with exact dosages (e.g. Copper Oxychloride 50 WP @ 2.5g/L water, Mancozeb, Imidacloprid, Neem oil).
2. Post-harvest value addition (e.g., converting tomatoes into concentrated puree with 34% margin, onions into dehydrated flakes, cotton ginning).
3. Mandi prices, APMC market price trends (Lasalgaon, Pimpalgaon, Latur, Akola), and holding advice.
4. Logistics, cold storage facility recommendation, and transport cost optimization.

Provide helpful, clear, professional responses formatted with bullet points and bold highlights when appropriate. Keep answers concise, actionable, and encouraging for Indian farmers and buyers.`;

    // Construct alternating contents starting with user
    const formattedContents = [];
    let expectingUser = true;

    for (const msg of chatHistory) {
      const text = typeof msg.text === 'string' ? msg.text.trim() : '';
      if (!text) continue;
      const isUser = msg.sender === 'user' || msg.role === 'user';

      if (expectingUser && isUser) {
        formattedContents.push({ role: 'user', parts: [{ text }] });
        expectingUser = false;
      } else if (!expectingUser && !isUser) {
        formattedContents.push({ role: 'model', parts: [{ text }] });
        expectingUser = true;
      }
    }

    if (expectingUser) {
      formattedContents.push({ role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt.trim()}` }] });
    } else {
      formattedContents[formattedContents.length - 1].parts[0].text += `\n\n${prompt.trim()}`;
    }

    // Try models: gemini-1.5-flash, gemini-2.0-flash, gemini-1.5-pro
    const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
    let lastError = null;

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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

        lastError = data.error?.message || JSON.stringify(data);
      } catch (err) {
        lastError = err.message;
      }
    }

    return res.status(500).json({
      error: `Gemini API call failed: ${lastError || 'Unknown error'}`
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
