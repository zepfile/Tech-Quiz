// Polyfill SlowBuffer for Node 24+ / modern Vercel runtime
const buffer = require("buffer");
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}
if (!global.SlowBuffer) {
  global.SlowBuffer = buffer.Buffer;
}

let app = null;
let loadError = null;

try {
  app = require("../server/server");
} catch (err) {
  loadError = err;
  console.error("FATAL: Failed to load server:", err);
}

module.exports = (req, res) => {
  if (loadError || !app) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        success: false,
        message: "Server Initialization Error: " + (loadError ? loadError.message : "Unknown error"),
        stack: loadError ? loadError.stack : null,
      })
    );
  }
  return app(req, res);
};
