const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from the Vite build output
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// SPA fallback: for any route that isn't a static file, serve index.html
// so React Router can handle client-side paths like /shop, /login, etc.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

