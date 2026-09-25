// Simple shared-secret admin guard. Set ADMIN_SECRET in .env and send it
// as the "x-admin-secret" header from your admin tool/Postman.
export function adminAuth(req, res, next) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return res.status(503).json({ error: "Admin endpoints are not configured." });
  }
  if (req.headers["x-admin-secret"] !== secret) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
