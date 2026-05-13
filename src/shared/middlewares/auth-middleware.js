import { User } from "../../modules/users/users.model.js";
import { verifyAccessTokenPayload } from "../services/jwt-service.js";

/**
 * Requires `Authorization: Bearer <access JWT>`.
 * Attaches `req.authUser`, `req.roles`, and `req.permissions` when valid.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export async function authenticateJwt(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = header.slice("Bearer ".length).trim();

  let payload;
  try {
    payload = verifyAccessTokenPayload(token);
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }

  const user = await User.findByPk(payload.sub);
  if (!user || !user.is_active) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  req.authUser = user;
  req.roles = payload.roles;
  req.permissions = payload.permissions;
  next();
}
