export default async function handler(req, res) {
  // CORS configuration - dynamic origin validation
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

    const { cropName, userNotes, imageBase64, mimeType = 'image/jpeg' } = body || {};

    if (!cropName || typeof cropName !== 'string' || !cropName.trim()) {
      return res.status(400).json({ error: 'Crop name is required' });
    }

    if (cropName.length > 100) {
      return res.status(400).json({ error: 'Crop name is too long' });
    }

    if (userNotes && typeof userNotes === 'string' && userNotes.length > 2000) {
      return res.status(400).json({ error: 'User notes exceed maximum limit of 2000 characters' });
    }

    // Limit base64 image data payload size (approx 8MB max)
    if (imageBase64) {
      if (typeof imageBase64 !== 'string' || imageBase64.length > 10 * 1024 * 1024) {
        return res.status(400).json({ error: 'Image payload exceeds maximum allowed size (8MB)' });
      }
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.VITE_GOOGLE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'Diagnostic service is temporarily unavailable. Please configure GEMINI_API_KEY in Vercel Environment Variables.'
      });
    }

    let contents = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      const actualMime = imageBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/)?.[1] || mimeType;

      const prompt = `You are AgriAI, an expert Indian agricultural scientist and plant pathologist.
Analyze this photo of a ${cropName.trim()} crop leaf / plant / fruit.
${userNotes ? `Additional farmer observations: "${userNotes.trim()}".` : ''}

Provide a diagnostic assessment. If the leaf is healthy, state that it is Healthy. If affected, identify the exact pest/disease, severity, observed symptoms, IPM prevention, and verified treatment options.

You MUST return ONLY a raw JSON object matching this schema:
{
  "diseaseName": "Disease / Pest name (e.g., Early Blight, Thrips Infestation, Healthy Crop, Leaf Spot)",
  "confidencePercent": 93,
  "severity": "MODERATE",
  "symptoms": [
    "Key visual symptom observed from image",
    "Foliage/fruit condition description"
  ],
  "treatmentPlan": [
    "Integrated Pest Management (IPM) & verified registered active ingredient guidance",
    "Application safety and cultural management practice"
  ],
  "preventiveMeasures": [
    "Key prevention tip to avert future recurrence",
    "Crop hygiene and spacing recommendation"
  ]
}`;

      contents = [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: actualMime,
                data: cleanBase64
              }
            }
          ]
        }
      ];
    } else {
      const prompt = `Perform a comprehensive agronomic diagnosis for ${cropName.trim()} crop.${userNotes ? ` Additional notes/symptoms observed by farmer: "${userNotes.trim()}".` : ''}

You MUST return ONLY a raw JSON object matching this exact schema:
{
  "diseaseName": "Name of the crop disease or pest infestation (e.g., Early Blight, Late Blight, Purple Blotch, Leaf Curl, Aphids, Pink Bollworm)",
  "confidencePercent": 94,
  "severity": "MILD",
  "symptoms": [
    "Symptom 1 description",
    "Symptom 2 description",
    "Symptom 3 description"
  ],
  "treatmentPlan": [
    "Recommended Pesticide/Fungicide 1 (with exact trade/chemical name & dosage, e.g. Spray Copper Oxychloride 50 WP @ 2.5g / Litre of water)",
    "Recommended Pesticide/Fungicide 2 (e.g. Spray Mancozeb 75 WP @ 2g / Litre water + sticker)",
    "Application frequency and safety instructions"
  ],
  "preventiveMeasures": [
    "Preventive agricultural practice 1",
    "Preventive agricultural practice 2"
  ]
}`;

      contents = [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ];
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          }
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: 'Diagnostic analysis failed to complete. Please try again with a clearer crop photo.'
      });
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    try {
      const parsed = JSON.parse(rawText);
      return res.status(200).json(parsed);
    } catch {
      return res.status(200).json({ raw: rawText });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error while processing diagnosis' });
  }
}
