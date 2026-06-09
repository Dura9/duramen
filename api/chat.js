export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages, model, max_tokens, temperature } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' })
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
        'HTTP-Referer': 'https://duramen.vercel.app',
        'X-Title': 'Duramen',
      },
      body: JSON.stringify({
        model: model || 'anthropic/claude-3.5-haiku',
        messages,
        max_tokens: max_tokens || 600,
        temperature: temperature || 0.7,
      }),
    })

    const data = await response.json()
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}
