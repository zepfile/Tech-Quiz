// Polyfill SlowBuffer for Node 24+ / modern Vercel runtime
const buffer = require("buffer");
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}
if (!global.SlowBuffer) {
  global.SlowBuffer = buffer.Buffer;
}

const app = require("../server/server");

module.exports = app;
