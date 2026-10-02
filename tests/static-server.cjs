const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// Serve the same relative HTML/CSS paths used by GitHub Pages.
module.exports = function staticServer({ transformHtml = html => html } = {}) {
  const root = path.resolve(__dirname, '..');
  return http.createServer((req, res) => {
    let file;
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    } catch {
      res.writeHead(400).end();
      return;
    }
    if (!file.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    if (file.endsWith('/favicon.ico')) {
      res.writeHead(204).end();
      return;
    }
    fs.readFile(file, (error, data) => {
      if (error) { res.writeHead(404).end(); return; }
      const type = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' }[path.extname(file)] || 'text/plain';
      res.setHeader('Content-Type', type + '; charset=utf-8');
      res.end(path.extname(file) === '.html' ? transformHtml(data.toString('utf8')) : data);
    });
  });
};
