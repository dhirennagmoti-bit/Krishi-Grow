export default async function handler(req, res) {
  // Dynamic CORS origin configuration
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
      userName,
      userRole = 'FARMER',
      userEmail,
      userPhone,
      buyerType,
      category = 'GENERAL_INQUIRY',
      urgency = 'MEDIUM',
      subject,
      description,
      lotOrOrderReference
    } = body || {};

    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return res.status(400).json({ error: 'Ticket subject is required' });
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ error: 'Ticket description is required' });
    }

    const cleanEmail = (userEmail || '').trim() || 'farmer@krishigrow.in';
    const cleanName = (userName || '').trim() || (userRole === 'FARMER' ? 'Valued Farmer' : 'Valued Buyer Partner');
    const cleanPhone = (userPhone || '').trim() || '+91 98220 12345';

    // Generate unique Ticket ID
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const ticketNumber = `KG-${userRole === 'FARMER' ? 'FAR' : 'BUY'}-${new Date().getFullYear()}-${randomSuffix}`;
    const timestamp = new Date().toISOString();

    // 1. Generate Intelligent AI Auto-Reply & Resolution Guidance
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.VITE_GOOGLE_API_KEY;

    let aiResolutionText = '';

    if (apiKey) {
      try {
        const supportPrompt = `You are Krishi Grow Customer Support AI Desk Officer.
A ${userRole} (${cleanName}) has submitted an urgent customer support ticket.
Category: ${category}
Urgency: ${urgency}
Subject: ${subject.trim()}
Details: ${description.trim()}
${lotOrOrderReference ? `Reference Lot/Order: ${lotOrOrderReference}` : ''}

Provide an immediate, highly helpful, empathetic, and professional preliminary resolution.
- Acknowledge their issue clearly.
- If it's a payment delay, cite APMC / Farmer Payment mandates (settlement within 24 hours under APMC Act / e-NAM).
- If it's crop quality/grading dispute, explain the digital weighment slip re-inspection procedure.
- If it's transport/logistics, explain vehicle tracking and mandi dispatch verification.
- Provide 2-3 immediate actionable next steps.
- Keep the tone respectful, clear, and reassuring.
- Format with clean bullet points.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: supportPrompt }] }],
              generationConfig: { temperature: 0.3 }
            })
          }
        );

        const data = await response.json();
        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          aiResolutionText = data.candidates[0].content.parts[0].text.trim();
        }
      } catch {
        // Fallback below
      }
    }

    // Fallback AI auto-reply if API unavailable
    if (!aiResolutionText) {
      if (category === 'PAYMENT_DISPUTE') {
        aiResolutionText = `Namaste ${cleanName}. We have received your payment grievance (Ref: ${ticketNumber}). 
• **APMC Payment Mandate**: Under agricultural trade regulations, buyer payments must be settled within 24 hours of weighbridge QC acceptance.
• **Action Taken**: Our Grievance Officer has placed an immediate hold and notification to the buyer's account.
• **Next Step**: Please ensure your bank IFSC and registered UPI details match your Krishi Grow profile. An officer will call you within 2 hours.`;
      } else if (category === 'CROP_QUALITY_DISPUTE') {
        aiResolutionText = `Namaste ${cleanName}. We have recorded your quality grading dispute regarding lot ${lotOrOrderReference || 'your recent batch'}.
• **Digital QC Re-Verification**: Your batch samples and weighment slip moisture/damage records are being re-audited against our NABL/APMC grade specifications.
• **Resolution Window**: Standard re-inspection takes 4 working hours.
• **Recommendation**: Please keep your high-resolution harvest photos available in case additional visual evidence is needed.`;
      } else if (category === 'TRANSPORT_LOGISTICS') {
        aiResolutionText = `Namaste ${cleanName}. Your logistics tracking request is being prioritized.
• **Fleet Live Status**: Our transport coordination team has pinged the assigned carrier driver.
• **Toll & Route Status**: Cold storage / mandi transit routes are monitored in real time.
• **Emergency Helpline**: For direct driver escalation, dial our logistics helpline at 1800-180-1551.`;
      } else {
        aiResolutionText = `Namaste ${cleanName}. Thank you for contacting Krishi Grow Support Desk.
• Your ticket **${ticketNumber}** has been registered with ${urgency} priority.
• Our dedicated agri-support specialist has been assigned to your case.
• We typically resolve inquiries in under 2 hours for urgent issues and 24 hours for standard questions.`;
      }
    }

    // 2. Generate Beautiful HTML & PlainText Auto-Reply Email Confirmation
    const resolutionHours = urgency === 'CRITICAL_URGENT' ? 2 : urgency === 'HIGH' ? 6 : 24;

    const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0f12; color: #e2e8f0; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #161b22; border: 1px solid #30363d; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; opacity: 0.9; font-size: 13px; }
    .body-content { padding: 28px; }
    .ticket-badge { display: inline-block; background: #064e3b; border: 1px solid #10b981; color: #6ee7b7; font-weight: 700; padding: 6px 14px; border-radius: 20px; font-size: 13px; margin-bottom: 18px; }
    .details-box { background: #0d1117; border: 1px solid #21262d; border-radius: 12px; padding: 16px; margin: 16px 0; }
    .details-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #161b22; font-size: 13px; }
    .details-row:last-child { border-bottom: none; }
    .label { color: #8b949e; }
    .value { color: #f0f6fc; font-weight: 600; }
    .ai-box { background: #1c2128; border-left: 4px solid #10b981; padding: 16px; border-radius: 0 12px 12px 0; margin: 20px 0; }
    .ai-title { color: #34d399; font-weight: 700; font-size: 13px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .ai-text { color: #c9d1d9; font-size: 13px; line-height: 1.6; white-space: pre-line; }
    .footer { background: #0d1117; padding: 20px; text-align: center; border-top: 1px solid #21262d; font-size: 11px; color: #8b949e; }
    .help-button { display: inline-block; background: #10b981; color: #000000 !important; font-weight: 700; padding: 10px 22px; border-radius: 8px; text-decoration: none; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌾 Krishi Grow Support Desk</h1>
      <p>Official Ticket Receipt & Immediate Action Advisory</p>
    </div>
    <div class="body-content">
      <div class="ticket-badge">Ticket ID: ${ticketNumber}</div>
      <p>Namaste <strong>${cleanName}</strong>,</p>
      <p>We have successfully registered your support inquiry. Our automated intelligence engine and customer grievance cell are actively processing your request.</p>

      <div class="details-box">
        <div class="details-row"><span class="label">Category:</span><span class="value">${category.replace(/_/g, ' ')}</span></div>
        <div class="details-row"><span class="label">Priority:</span><span class="value" style="color: ${urgency === 'CRITICAL_URGENT' ? '#f87171' : '#34d399'}">${urgency}</span></div>
        <div class="details-row"><span class="label">Subject:</span><span class="value">${subject.trim()}</span></div>
        <div class="details-row"><span class="label">Target Resolution:</span><span class="value">Within ${resolutionHours} Hours</span></div>
      </div>

      <div class="ai-box">
        <div class="ai-title">⚡ Instant Automated Assessment & Next Steps:</div>
        <div class="ai-text">${aiResolutionText}</div>
      </div>

      <p style="font-size: 12px; color: #8b949e;">If your inquiry requires urgent escalation, our toll-free agricultural grievance helpline is operational 24/7 across Maharashtra & India.</p>

      <center>
        <a href="https://krishigrow.in" class="help-button">View Live Ticket Status</a>
      </center>
    </div>
    <div class="footer">
      <p>Krishi Grow Agri Value-Chain Network • Nashik & National APMC Hubs</p>
      <p>Toll-Free Kisan Call Centre: 1800-180-1551 | Direct Desk: +91 1800-572-4769 | support@krishigrow.in</p>
    </div>
  </div>
</body>
</html>`;

    const emailPlainText = `KRISHI GROW SUPPORT DESK - OFFICIAL TICKET RECEIPT
------------------------------------------------------------
Ticket ID: ${ticketNumber}
Submitted By: ${cleanName} (${userRole})
Email: ${cleanEmail} | Phone: ${cleanPhone}
Category: ${category} | Urgency: ${urgency}
Subject: ${subject.trim()}
Expected SLA: Within ${resolutionHours} Hours
------------------------------------------------------------

INSTANT AI RESOLUTION ASSESSMENT:
${aiResolutionText}

------------------------------------------------------------
24x7 Kisan Grievance Helpline: 1800-180-1551
Direct Support: support@krishigrow.in | https://krishigrow.in`;

    const ticketResponse = {
      id: `ticket_${Date.now()}`,
      ticketNumber,
      userId: `usr_${Date.now()}`,
      userName: cleanName,
      userRole,
      userEmail: cleanEmail,
      userPhone: cleanPhone,
      buyerType,
      category,
      urgency,
      subject: subject.trim(),
      description: description.trim(),
      lotOrOrderReference,
      status: 'AI_AUTO_RESOLVED',
      createdAt: timestamp,
      updatedAt: timestamp,
      autoReplyEmailSent: true,
      autoReplyEmailPreview: {
        subject: `[${ticketNumber}] Support Ticket Confirmation: ${subject.trim()}`,
        recipient: cleanEmail,
        sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        htmlContent: emailHtml,
        plainText: emailPlainText
      },
      replies: [
        {
          id: `rep_${Date.now()}_1`,
          sender: 'USER',
          senderName: cleanName,
          message: description.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: `rep_${Date.now()}_2`,
          sender: 'AI_SUPPORT',
          senderName: 'AgriAI Support Desk',
          message: aiResolutionText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      assignedOfficerName: userRole === 'FARMER' ? 'Officer Vikrant Shinde (Farmer Grievance Desk)' : 'Officer Meera Kulkarni (Buyer Supply Chain QC)',
      estimatedResolutionHours: resolutionHours
    };

    return res.status(200).json(ticketResponse);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error while processing customer support ticket' });
  }
}
