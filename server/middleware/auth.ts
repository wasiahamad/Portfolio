import type { Request, Response, NextFunction } from "express";
import type { Session } from "express-session";

declare global {
  namespace Express {
    interface Request {
      adminId?: string;
      session?: Session & { adminId?: string };
    }
  }
}

export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const adminId = (req.session as any)?.adminId;
  if (!adminId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  req.adminId = adminId;
  next();
}
