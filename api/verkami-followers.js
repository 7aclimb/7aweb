const VERKAMI_URL = 'https://www.verkami.com/projects/42698-7a-escala-como-puedas';

function parseFollowers(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const patterns = [
    /(\d{1,6})\s+personas?\s+(?:siguen|sigue|siguiendo)/i,
    /(\d{1,6})\s+(?:seguidores|followers)/i,
    /(?:siguen|siguiendo)\s+(\d{1,6})\s+personas?/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return Number(match[1]);
  }

  const rawPatterns = [
    /"followers_count"\s*:\s*(\d{1,6})/i,
    /"followers"\s*:\s*(\d{1,6})/i,
    /"watchers_count"\s*:\s*(\d{1,6})/i
  ];
  for (const pattern of rawPatterns) {
    const match = html.match(pattern);
    if (match) return Number(match[1]);
  }

  return null;
}

export default async function handler(req, res) {
  try {
    const response = await fetch(VERKAMI_URL, {
      headers: {
        'user-agent': 'Mozilla/5.0 7a-crowdfunding-counter',
        'accept-language': 'es-ES,es;q=0.9,en;q=0.8'
      }
    });

    if (!response.ok) return res.status(502).json({ error: 'No se pudo leer Verkami' });

    const html = await response.text();
    const followers = parseFollowers(html);
    if (!followers) return res.status(404).json({ error: 'No se encontró el contador' });

    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).json({ followers, source: VERKAMI_URL, updatedAt: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
