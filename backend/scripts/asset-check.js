const http = require('http');
const url = 'http://localhost:3003';
http.get(url, res => {
  let s = '';
  res.on('data', d => s += d);
  res.on('end', () => {
    const match = s.match(/href=\"(\/ _next\/static\/css\/app\/layout\.css\?v=[^\"]+)\"/); // placeholder
    console.log('PAGE', res.statusCode);
    console.log('BODY_LEN', s.length);
    // We'll just print the first part to inspect
    console.log(s.slice(0, 400));
  });
}).on('error', e => {
  console.error('ERR', e.message);
});
