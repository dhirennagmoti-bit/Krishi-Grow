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
        error: 'GEMINI_API_KEY is not set in Vercel Environment Variables.'
      });
    }

    const systemInstruction = `You are AgriAI, an expert Indian agricultural value-chain and farming advisor assistant on Krishi Grow platform.
Your expertise covers:
1. Crop cultivation, plant health, disease management, and specific chemical or organic pesticide/fungicide recommendations with exact dosages (e.g. Copper Oxychloride 50 WP @ 2.5g/L water, Mancozeb, Imidacloprid, Neem oil).
2. Post-harvest value addition (e.g., converting tomatoes into concentrated puree with 34% margin, onions into dehydrated flakes, cotton ginning).
3. Mandi prices, APMC market price trends (Lasalgaon, Pimpalgaon, Latur, Akola), and holding advice.
4. Logistics, cold storage facility recommendation, and transport cost optimization.

Provide helpful, clear, professional responses formatted with bullet points and bold highlights when appropriate. Keep answers concise, actionable, and encouraging for Indian farmers and buyers.`;

    // 1. Fetch available models for this specific API key dynamically
    let candidateModels = [];
    try {
      const listRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      );
      if (listRes.ok) {
        const listData = await listRes.json();
        if (Array.isArray(listData.models)) {
          candidateModels = listData.models
            .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
            .map((m) => m.name.replace(/^models\//, ''));
        }
      }
    } catch (e) {
      console.warn('ModelService.ListModels error:', e);
    }

    // Default candidates if list query fails
    if (candidateModels.length === 0) {
      candidateModels = [
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash',
        'gemini-2.0-flash',
        'gemini-2.0-flash-exp',
        'gemini-pro',
        'gemini-1.5-flash-8b',
        'gemini-1.5-pro-latest'
      ];
    } else {
      // Prioritize flash models first for fast responses
      candidateModels.sort((a, b) => {
        if (a.includes('flash') && !b.includes('flash')) return -1;
        if (!a.includes('flash') && b.includes('flash')) return 1;
        return 0;
      });
    }

    // Prepare contents
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
      formattedContents.push({
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt.trim()}` }]
      });
    } else {
      formattedContents[formattedContents.length - 1].parts[0].text += `\n\n${prompt.trim()}`;
    }

    let lastError = null;

    // Try candidate models in order
    for (const model of candidateModels.slice(0, 5)) {
      for (const apiVersion of ['v1beta', 'v1']) {
        try {
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

          lastError = data.error?.message || JSON.stringify(data);
        } catch (err) {
          lastError = err.message;
        }
      }
    }

    return res.status(500).json({
      error: `Gemini API call failed: ${lastError || 'Unknown error'}`
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
