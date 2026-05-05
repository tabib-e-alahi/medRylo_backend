import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import envConfig from "../config/route.config";
import { UserAccountStatus, UserRole } from "../../generated/prisma/enums";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: envConfig.BACKEND_BASE_URL,
    secret: envConfig.BETTER_AUTH_SECRET,

    advanced: {
        cookies: {
            session_token: {
                name: "session_token",
                attributes: {
                    httpOnly: true,
                    secure: envConfig.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                },
            },
        },
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24,      // refresh every 24h
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5,
        },
    },

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, //! set true in production
    },

    socialProviders: {
        google: {
            clientId: envConfig.GOOGLE_CLIENT_ID,
            clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
            prompt: "select_account consent",
        },
    },

    emailVerification: {
        sendOnSignUp: false,
        sendOnSignIn: false,
        autoSignInAfterVerification: true,
    },

    trustedOrigins: [
        envConfig.FRONTEND_URL,
        envConfig.BACKEND_BASE_URL,
        "http://localhost:3000",
        "http://localhost:5000",
    ].filter(Boolean),

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: UserRole.USER,
                input: false,
            },
            status: {
                type: "string",
                required: true,
                defaultValue: UserAccountStatus.ACTIVE,
                input: false,
            },
            phone: {
                type: "string",
                required: false,
                input: true,
            },
            needPasswordChange: {
                type: "boolean",
                required: false,
                defaultValue: false,
            },
            isDeleted: {
                type: "boolean",
                required: false,
                defaultValue: false,
            },
            deletedAt: {
                type: "date",
                required: false,
                defaultValue: null,
            },
        },
    },

    plugins: [],

    databaseHooks: {
        user: {
            create: {
                before: async (user, context) => {
                    const intendedRole =
                        context?.headers?.get("x-intended-role") || "USER";
                    return {
                        data: { ...user, role: intendedRole },
                    };
                },
                after: async (user, context) => {
                    const role = context?.headers?.get("x-intended-role");

                    if (role === "STAFF") {
                        const inviteCode = context?.headers?.get("x-staff-invite-code");
                        if (inviteCode) {
                            const pharmacy = await prisma.pharmacy.findUnique({
                                where: { inviteCode },
                            });

                            if (pharmacy) {
                                await prisma.staff.create({
                                    data: {
                                        userId: user.id,
                                        pharmacyId: pharmacy.id,
                                    },
                                });
                            }
                        }
                    }
                },
            },
        },
    },
});

export type Auth = typeof auth;
