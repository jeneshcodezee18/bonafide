import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  userData?: any; // or specify the actual type if you know it
}

// You can type this directly as RequestHandler
export const requireAuth: RequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userData = decoded;
    next();
  } catch (err: any) {
    res.status(401).send("Unauthorized: Invalid token");
  }
};

export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userData = req.userData;
    const hasPermission =
      userData &&
      (userData.permissions
        ? userData.permissions[permission] === "yes"
        : userData[permission] === "yes");

    if (hasPermission) {
      return next();
    } else {
      return res.redirect("/admin_master/no-access");
    }
  };
}
