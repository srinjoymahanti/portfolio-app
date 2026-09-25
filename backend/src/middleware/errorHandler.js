export function notFound(req, res, next) {
  res.status(404).json({ error: "Route not found" });
}

// Centralized error handler - never leak stack traces or internal details.
export function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err.message);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  const status = err.statusCode || 500;
  const publicMessage =
    status === 500
      ? "Something went wrong on our end. Please try again shortly."
      : err.message;

  res.status(status).json({ error: publicMessage });
}
