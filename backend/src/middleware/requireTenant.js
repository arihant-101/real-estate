export function requireTenant(req, res, next) {
  if (req.user?.role !== "TENANT") {
    return res.status(403).json({ error: "Tenant access required", code: "FORBIDDEN" });
  }
  next();
}
