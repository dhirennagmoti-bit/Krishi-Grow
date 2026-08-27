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
    const { prompt, chatHistory = [] } = req.body || {};

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.VITE_GOOGLE_API_KEY;

    if (!apiKey) {
      console.warn('Server GEMINI_API_KEY environment variable is missing.');
      return res.status(500).json({
        error: 'Gemini API key is not configured on the Vercel server environment.'
      });
    }

    const systemInstruction = `You are AgriAI, an expert Indian agricultural value-chain and farming advisor assistant on Krishi Grow platform.
Your expertise covers:
1. Crop cultivation, plant health, disease management, and specific chemical or organic pesticide/fungicide recommendations with exact dosages (e.g. Copper Oxychloride 50 WP @ 2.5g/L water, Mancozeb, Imidacloprid, Neem oil).
2. Post-harvest value addition (e.g., converting tomatoes into concentrated puree with 34% margin, onions into dehydrated flakes, cotton ginning).
3. Mandi prices, APMC market price trends (Lasalgaon, Pimpalgaon, Latur, Akola), and holding advice.
4. Logistics, cold storage facility recommendation, and transport cost optimization.

Provide helpful, clear, professional responses formatted with bullet points and bold highlights when appropriate. Keep answers concise, actionable, and encouraging for Indian farmers and buyers.`;

    // Ensure strictly alternating user/model sequence starting with user
    const sanitizedContents = [];
    let expectingUser = true;

    for (const msg of chatHistory) {
      const text = typeof msg.text === 'string' ? msg.text.trim() : '';
      if (!text) continue;
      const isUser = msg.sender === 'user' || msg.role === 'user';

      if (expectingUser && isUser) {
        sanitizedContents.push({ role: 'user', parts: [{ text }] });
        expectingUser = false;
      } else if (!expectingUser && !isUser) {
        sanitizedContents.push({ role: 'model', parts: [{ text }] });
        expectingUser = true;
      }
    }

    // Append current prompt as the latest user turn
    if (expectingUser) {
      sanitizedContents.push({ role: 'user', parts: [{ text: prompt.trim() }] });
    } else {
      sanitizedContents[sanitizedContents.length - 1].parts[0].text += `\n${prompt.trim()}`;
    }

    // Try models: gemini-1.5-flash, then gemini-2.0-flash
    const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash'];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: systemInstruction }]
              },
              contents: sanitizedContents,
              generationConfig: {
                temperature: 0.7,
              }
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          const text = data.candidates[0].content.parts[0].text;
          return res.status(200).json({ text });
        }

        lastError = data.error?.message || 'Empty response from Gemini';
        console.warn(`Model ${modelName} returned error:`, data);
      } catch (err) {
        lastError = err.message;
        console.warn(`Fetch error with model ${modelName}:`, err);
      }
    }

    return res.status(500).json({
      error: `Gemini API Error: ${lastError || 'Unknown error'}`
    });
  } catch (error) {
    console.error('Error in /api/chat handler:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
