import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { ForbiddenError, UnauthorizedError } from "../errors/AppError";
import { UserRole } from '../../generated/prisma/enums';

export { UserRole };

const authMiddleware = (...roles: UserRole[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

    
      
      if (!session?.user) {
        throw new UnauthorizedError(
          "You are not logged in. Please log in to continue."
        );
      }
      const { user } = session;
      const typedUser = user as unknown as Express.Request["user"];

      if (typedUser.isDeleted) {
        throw new ForbiddenError(
          "This account no longer exists. Please contact support."
        );
      }

      if (typedUser.status === "SUSPENDED") {
        throw new ForbiddenError(
          "Your account has been suspended. Please contact support."
        );
      }

      if (roles.length > 0 && !roles.includes(typedUser.role as UserRole)) {
        throw new ForbiddenError(
          "You do not have permission to access this resource."
        );
      }
      req.user = typedUser;
      req.session = session.session as unknown as Express.Request["session"];

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authMiddleware;


// Convenience role guard arrays (spread into route definitions)
export const requireAuth = [authMiddleware()];
export const requireAdmin = [authMiddleware(UserRole.ADMIN)];
export const requirePharmacy = [authMiddleware(UserRole.ADMIN, UserRole.PHARMACY)];
export const requireStaff = [authMiddleware(UserRole.ADMIN, UserRole.PHARMACY, UserRole.STAFF)];