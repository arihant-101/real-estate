export function errorHandler(err, _req, res, _next) {
  const code = err.code || "INTERNAL_ERROR";
  const status = err.status ?? (code === "VALIDATION_ERROR" ? 400 : code === "UNAUTHORIZED" ? 401 : code === "FORBIDDEN" ? 403 : code === "NOT_FOUND" ? 404 : 500);
  const message = err.message || "Internal server error";
  if (status >= 500) console.error(err);
  res.status(status).json({ error: message, code });
}
