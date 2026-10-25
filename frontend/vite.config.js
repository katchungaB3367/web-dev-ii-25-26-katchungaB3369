const { defineConfig } = require('vite');

module.exports = defineConfig({
  server: {
    host: '127.0.0.1',
    proxy: { '/api': 'http://127.0.0.1:5001' },
  },
});
