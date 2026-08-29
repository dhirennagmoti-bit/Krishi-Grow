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

    const {
      action = 'SEND_REQUEST', // 'SEND_REQUEST' | 'ACCEPT_REQUEST' | 'REJECT_REQUEST'
      senderId,
      senderName = 'Farmer / Partner',
      senderRole = 'FARMER',
      senderEmail = 'farmer@krishigrow.in',
      senderPhone = '+91 98220 12345',
      senderDistrict = 'Nashik',
      senderState = 'Maharashtra',

      receiverId,
      receiverName = 'Buyer Partner',
      receiverType = 'AGGREGATOR',
      receiverEmail = 'procurement@krishigrow.in',
      receiverPhone = '+91 94221 88990',
      receiverDistrict = 'Pune',

      targetType = 'CROP_TRADE', // 'CROP_TRADE' | 'COLD_STORAGE_BOOKING' | 'PROCESSING_FACILITY'
      cropName = 'Tomato',
      variety = 'Hybrid Grade A',
      quantityTonnes = 10,
      offeredPricePerQuintal = 2500,
      targetDate = new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      customMessage = '',
      requestId
    } = body || {};

    const requestNumber = requestId || `REQ-KG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let emailSubject = '';
    let emailHtml = '';
    let emailPlainText = '';
    let status = 'PENDING';

    if (action === 'SEND_REQUEST') {
      status = 'PENDING';
      const isStorage = targetType === 'COLD_STORAGE_BOOKING';

      emailSubject = isStorage
        ? `[${requestNumber}] New Cold Storage Reservation Request from ${senderName}`
        : `[${requestNumber}] New Agri Trade Connection & Procurement Proposal: ${quantityTonnes}T ${cropName}`;

      emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0c0f12; color: #e2e8f0; margin: 0; padding: 20px; }
    .card { max-width: 600px; margin: 0 auto; background: #161b22; border: 1px solid #30363d; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, ${isStorage ? '#4338ca, #6366f1' : '#059669, #10b981'}); padding: 24px; text-align: center; color: #ffffff; }
    .badge { display: inline-block; background: rgba(0,0,0,0.3); padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-top: 6px; }
    .content { padding: 28px; }
    .trade-box { background: #0d1117; border: 1px solid #21262d; border-radius: 12px; padding: 18px; margin: 16px 0; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #161b22; font-size: 13px; }
    .row:last-child { border-bottom: none; }
    .lbl { color: #8b949e; }
    .val { color: #f0f6fc; font-weight: 600; }
    .msg-box { background: #1f242c; border-left: 4px solid #10b981; padding: 14px; border-radius: 0 10px 10px 0; margin: 16px 0; font-size: 13px; color: #d1d5db; font-style: italic; }
    .btn-row { text-align: center; margin: 24px 0 10px 0; }
    .btn-accept { display: inline-block; background: #10b981; color: #000 !important; font-weight: 700; padding: 12px 28px; border-radius: 8px; text-decoration: none; margin-right: 10px; font-size: 13px; }
    .footer { background: #0d1117; padding: 18px; text-align: center; font-size: 11px; color: #8b949e; border-top: 1px solid #21262d; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 style="margin:0; font-size:22px; font-weight:800;">🌾 Krishi Grow Matchmaking Network</h1>
      <div class="badge">${isStorage ? '❄️ Cold Storage Booking' : '🤝 Trade Procurement Request'}</div>
    </div>
    <div class="content">
      <p>Namaste <strong>${receiverName}</strong>,</p>
      <p>You have received a verified connection request from <strong>${senderName}</strong> (${senderRole === 'FARMER' ? '🌾 Verified Farmer' : '🏢 Buyer Partner'}) via the Krishi Grow platform.</p>

      <div class="trade-box">
        <div class="row"><span class="lbl">Reference ID:</span><span class="val">${requestNumber}</span></div>
        <div class="row"><span class="lbl">Sender:</span><span class="val">${senderName} (${senderDistrict}, ${senderState})</span></div>
        <div class="row"><span class="lbl">Sender Contact:</span><span class="val">${senderPhone} • ${senderEmail}</span></div>
        <div class="row"><span class="lbl">Crop / Requirement:</span><span class="val">${cropName} (${variety})</span></div>
        <div class="row"><span class="lbl">Quantity:</span><span class="val">${quantityTonnes} Tonnes</span></div>
        ${offeredPricePerQuintal ? `<div class="row"><span class="lbl">Offered Price:</span><span class="val" style="color:#34d399;">₹${offeredPricePerQuintal} / Quintal</span></div>` : ''}
        <div class="row"><span class="lbl">Target Dispatch Date:</span><span class="val">${targetDate}</span></div>
      </div>

      ${customMessage ? `<div class="msg-box">"${customMessage}"</div>` : ''}

      <div class="btn-row">
        <a href="https://krishigrow.in" class="btn-accept">Accept & Open Direct Trade Chat</a>
      </div>

      <p style="font-size:11px; color:#8b949e; text-align:center;">
        Under APMC Mandate, all confirmed transactions are escrow protected and backed by digital weighment slips.
      </p>
    </div>
    <div class="footer">
      Krishi Grow Agricultural Value-Chain Platform • 24/7 Helpline: 1800-180-1551 • support@krishigrow.in
    </div>
  </div>
</body>
</html>`;

      emailPlainText = `KRISHI GROW - NEW TRADE CONNECTION REQUEST
------------------------------------------------------------
Reference ID: ${requestNumber}
Sender: ${senderName} (${senderRole}) - ${senderDistrict}, ${senderState}
Contact: ${senderPhone} | ${senderEmail}
Crop/Requirement: ${cropName} (${variety})
Quantity: ${quantityTonnes} Tonnes
Offered Price: ₹${offeredPricePerQuintal}/Quintal
Target Date: ${targetDate}
------------------------------------------------------------
Message: "${customMessage || 'Ready for direct farm dispatch.'}"

To accept or respond to this proposal, log in to Krishi Grow:
https://krishigrow.in
------------------------------------------------------------
Krishi Grow Help Desk: 1800-180-1551 | support@krishigrow.in`;

    } else if (action === 'ACCEPT_REQUEST') {
      status = 'ACCEPTED';
      emailSubject = `[CONFIRMED] Connection Request ${requestNumber} Accepted by ${senderName}`;
      emailHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif; background:#0c0f12; color:#e2e8f0; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:#161b22; border:1px solid #10b981; border-radius:16px; padding:24px; text-align:center;">
    <h2 style="color:#34d399; margin:0;">🎉 Connection Request Confirmed!</h2>
    <p style="font-size:14px; margin-top:8px;"><strong>${senderName}</strong> has accepted your connection request for <strong>${quantityTonnes}T ${cropName}</strong>.</p>
    <div style="background:#0d1117; padding:16px; border-radius:12px; text-align:left; margin:16px 0; font-size:13px;">
      <p style="margin:4px 0;"><strong>Direct Phone:</strong> ${senderPhone}</p>
      <p style="margin:4px 0;"><strong>Location:</strong> ${senderDistrict}, ${senderState}</p>
      <p style="margin:4px 0;"><strong>Target Delivery:</strong> ${targetDate}</p>
    </div>
    <a href="https://krishigrow.in" style="background:#10b981; color:#000; padding:10px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">Open Direct Dispatch Channel</a>
  </div>
</body>
</html>`;

      emailPlainText = `KRISHI GROW - CONNECTION REQUEST CONFIRMED!
------------------------------------------------------------
Reference ID: ${requestNumber}
${senderName} has ACCEPTED your connection proposal for ${quantityTonnes}T ${cropName}.
Direct Contact Phone: ${senderPhone}
Location: ${senderDistrict}, ${senderState}
Target Delivery: ${targetDate}

Log in to Krishi Grow to finalize collection & weighment:
https://krishigrow.in`;
    }

    const responsePayload = {
      id: `conn_${Date.now()}`,
      requestNumber,
      senderId,
      senderName,
      senderRole,
      senderEmail,
      senderPhone,
      senderDistrict,
      senderState,
      receiverId,
      receiverName,
      receiverType,
      receiverEmail,
      receiverPhone,
      receiverDistrict,
      targetType,
      cropName,
      variety,
      quantityTonnes: Number(quantityTonnes),
      offeredPricePerQuintal: Number(offeredPricePerQuintal),
      targetDate,
      customMessage,
      status,
      requestDate: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
      emailSent: true,
      emailPreview: {
        subject: emailSubject,
        recipient: receiverEmail,
        recipientRole: receiverType,
        sentAt: `${formattedDate} at ${formattedTime}`,
        htmlContent: emailHtml,
        plainText: emailPlainText
      },
      farmerPhone: senderRole === 'FARMER' ? senderPhone : receiverPhone,
      buyerPhone: senderRole === 'BUYER' ? senderPhone : receiverPhone
    };

    return res.status(200).json(responsePayload);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error while processing connection notification' });
  }
}
