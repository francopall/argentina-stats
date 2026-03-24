export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const bco = req.query.bco || 'AAA00';

  try {
    const upstream = await fetch(
      `https://www.bcra.gob.ar/api-indicadores-economicos.php?action=indicadores&bco=${encodeURIComponent(bco)}`
    );
    if (!upstream.ok) {
      const text = await upstream.text();
      res.status(upstream.status).json({ error: text });
      return;
    }
    const data = await upstream.json();
    res.setHeader('Cache-Control', 's-maxage=3600');
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
