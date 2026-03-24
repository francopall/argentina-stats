const TOKEN = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4MDU5MTcxMzIsInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJmcmFuY28ucGFsbGl0dG9AZ21haWwuY29tIn0.o9GpWQrIC53GtmF0pGR6IQPHFAlCqRCL2lx1JxswlnUgjHhi7Lc6Y_dfmYq5cYCNCaRFGL590fGvHDShjHBDbQ';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const path = req.query.path;
  if (!path) {
    res.status(400).json({ error: 'Falta path' });
    return;
  }

  try {
    const upstream = await fetch('https://api.estadisticasbcra.com/' + path, {
      headers: { 'Authorization': 'BEARER ' + TOKEN }
    });
    const data = await upstream.json();
    res.setHeader('Cache-Control', 's-maxage=300');
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
