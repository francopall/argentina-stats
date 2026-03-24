export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const path = req.query.path;
  if (!path) {
    return res.status(400).json({ error: 'Falta el parámetro path' });
  }

  const TOKEN = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4MDU5MTcxMzIsInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJmcmFuY28ucGFsbGl0dG9AZ21haWwuY29tIn0.o9GpWQrIC53GtmF0pGR6IQPHFAlCqRCL2lx1JxswlnUgjHhi7Lc6Y_dfmYq5cYCNCaRFGL590fGvHDShjHBDbQ';

  try {
    const response = await fetch(`https://api.estadisticasbcra.com/${path}`, {
      headers: { 'Authorization': 'BEARER ' + TOKEN }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error upstream' });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
