export function requireLandlord(req, res, next) {
  if (req.user?.role !== "LANDLORD") {
    return res.status(403).json({ error: "Landlord access required", code: "FORBIDDEN" });
  }
  next();
}
