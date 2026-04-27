// ============================================
// GYMCALC.IO — Netlify Function: Email Subscribe
// File: netlify/functions/subscribe.js
//
// Handles Mailchimp subscriptions server-side.
// Set MAILCHIMP_API_KEY and MAILCHIMP_LIST_ID in Netlify env vars.
// ============================================

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const { email, source = 'website', tags = [] } = JSON.parse(event.body);

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid email' }) };
    }

    const apiKey = process.env.MAILCHIMP_API_KEY;
    const listId = process.env.MAILCHIMP_LIST_ID;
    const datacenter = apiKey ? apiKey.split('-')[1] : null;

    if (!apiKey || !listId || !datacenter) {
      console.error('Mailchimp config missing');
      // Still return success to user — don't break UX over config issues
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Subscribed' }) };
    }

    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${listId}/members`;

    const body = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {},
      tags: [source, ...tags].filter(Boolean)
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    // Mailchimp returns 400 if already subscribed — still a "success" for user
    if (response.ok || data.title === 'Member Exists') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Subscribed successfully' })
      };
    }

    console.error('Mailchimp error:', data);
    return {
      statusCode: 200, // Still return 200 to user
      headers,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    console.error('Subscribe function error:', err);
    return {
      statusCode: 200, // Always return success to user
      headers,
      body: JSON.stringify({ success: true })
    };
  }
};
