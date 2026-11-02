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

  try {
    return app(req, res);
  } catch (handlerErr) {
    console.error("FATAL: Handler Error:", handlerErr);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        success: false,
        message: "Request Handler Error: " + handlerErr.message,
      })
    );
  }
};
