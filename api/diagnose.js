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
    const { cropName, userNotes, imageBase64, mimeType = 'image/jpeg' } = req.body || {};

    if (!cropName) {
      return res.status(400).json({ error: 'Crop name is required' });
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.VITE_GOOGLE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'Gemini API key is not configured on the server environment.'
      });
    }

    let contents = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      const actualMime = imageBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/)?.[1] || mimeType;

      const prompt = `You are AgriAI, an expert Indian agricultural scientist and plant pathologist.
Analyze this photo of a ${cropName} crop leaf / plant / fruit.
${userNotes ? `Additional farmer observations: "${userNotes}".` : ''}

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
      const prompt = `Perform a comprehensive agronomic diagnosis for ${cropName} crop.${userNotes ? ` Additional notes/symptoms observed by farmer: "${userNotes}".` : ''}

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
      console.error('Gemini API diagnosis error:', data);
      return res.status(response.status).json({
        error: data.error?.message || 'Error generating diagnosis from Gemini AI'
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
    console.error('Error in /api/diagnose handler:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
