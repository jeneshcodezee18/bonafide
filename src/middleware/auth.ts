import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Unauthorized: Invalid token");
  }
}


export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
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