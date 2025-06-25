const jsonServer = require('json-server');
const path = require('path');
const merge = require('./merge-json.cjs'); // pastikan ini function

merge(); // generate db.json

const server = jsonServer.create();
server.use(jsonServer.defaults());

const router = jsonServer.router(path.join(__dirname, 'db.json'));
server.use(router);

// Gunakan PORT dari Railway (default 3000 jika tidak ada)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ JSON Server running on port ${PORT}`);
});

