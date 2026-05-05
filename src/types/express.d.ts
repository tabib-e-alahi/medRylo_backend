declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        image: string | null | undefined;
        role: "ADMIN" | "PHARMACY" | "STAFF" | "USER";
        status: "ACTIVE" | "SUSPENDED";
        phone: string | null | undefined;
        needPasswordChange: boolean;
        isDeleted: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
      };
      session: {
        id: string;
        token: string;
        userId: string;
        expiresAt: Date;
        ipAddress: string | null | undefined;
        userAgent: string | null | undefined;
        createdAt: Date;
        updatedAt: Date;
      };
      file?: Express.Multer.File;
      files?:
        | Express.Multer.File[]
        | { [fieldname: string]: Express.Multer.File[] };
    }
  }
}

export {}; // makes this a module so declare global works correctly