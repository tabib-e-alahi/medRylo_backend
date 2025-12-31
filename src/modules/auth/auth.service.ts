import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import envConfig from "../../config/route.config";
import { UnauthorizedError } from "../../errors/AppError";
import type { IncomingHttpHeaders } from "http";
import { deleteFromCloudinary, deleteFromCloudinaryByPublicId } from "../../utils/claudinary";

const DEMO_USERS = {
  admin: {
    name: envConfig.ADMIN_Name,
    email: envConfig.ADMIN_Email,
    password:envConfig.ADMIN_Password,
    role: "ADMIN",
  },
  pharmacy: {
    name: envConfig.PHARMACY_Name,
    email: envConfig.PHARMACY_Email,
    password:envConfig.PHARMACY_Password,
    role: "PHARMACY",
  },
  staff: {
    name: envConfig.STAFF_Name,
    email: envConfig.STAFF_Email,
    password:envConfig.STAFF_Password,
    role: "STAFF",
  },
  user: {
    name: envConfig.USER_Name,
    email: envConfig.USER_Email,
    password:envConfig.USER_Password,
    role: "USER",
  },
} as const;

type DemoRole = keyof typeof DEMO_USERS;


export async function getMe(headers: IncomingHttpHeaders) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(headers),
  });
  if (!session?.user) {
    throw new UnauthorizedError("Not authenticated");
  }

  // Strip sensitive fields
  const { user } = session;
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      role: (user as any).role,
      status: (user as any).status,
      phone: (user as any).phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    session: {
      id: session.session.id,
      expiresAt: session.session.expiresAt,
    },
  };
}


export async function demoLogin(role: DemoRole) {
  const demoUser = DEMO_USERS[role];
  const password = demoUser.password;

  // Check if user already exists
  const existing = await prisma.user.findUnique({
    where:{
      email: demoUser.email
    }
  })


  if (!existing) {
    await auth.api.signUpEmail({
      body: {
        name: demoUser.name,
        email: demoUser.email,
        password,
      },
      headers: new Headers({
        "x-intended-role": demoUser.role,
      }),
    });
  }

  // Sign in via Better Auth to get a valid session
  const signInResponse = await auth.api.signInEmail({
    body: {
      email: demoUser.email,
      password,
    },
  });

  return signInResponse;
}

export async function updateProfileImage(
  userId: string,
  image: { secureUrl: string; publicId: string }
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new UnauthorizedError("Not authenticated");
  }

  if (user.image && user.image !== image.secureUrl) {
    await deleteFromCloudinaryByPublicId(user.imagePublicId);
    if (!user.imagePublicId) {
      await deleteFromCloudinary(user.image);
    }
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      image: image.secureUrl,
      imagePublicId: image.publicId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  });
}

export async function removeProfileImage(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new UnauthorizedError("Not authenticated");
  }

  if (user.image) {
    await deleteFromCloudinaryByPublicId(user.imagePublicId);
    if (!user.imagePublicId) {
      await deleteFromCloudinary(user.image);
    }
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      image: null,
      imagePublicId: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  });
}
