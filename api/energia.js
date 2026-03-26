export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { sql } = req.method === 'POST' ? req.body : req.query;
  if (!sql) {
    res.status(400).json({ error: 'Falta sql' });
    return;
  }

  try {
    const upstream = await fetch(
      'http://datos.energia.gob.ar/api/3/action/datastore_search_sql',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ sql })
      }
    );
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: await upstream.text() });
      return;
    }
    const data = await upstream.json();
    res.setHeader('Cache-Control', 's-maxage=3600');
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
