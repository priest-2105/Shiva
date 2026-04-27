import { PrismaAdapter } from "@auth/prisma-adapter";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { emailSchema, loginPasswordSchema, normalizeEmail } from "@/lib/auth-security";

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            id: string;
        };
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const parsed = z
                    .object({
                        email: emailSchema,
                        password: loginPasswordSchema,
                    })
                    .safeParse(credentials);

                if (!parsed.success) {
                    return null;
                }

                const email = normalizeEmail(parsed.data.email);
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user?.passwordHash) {
                    return null;
                }

                const isValid = await compare(parsed.data.password, user.passwordHash);

                if (!isValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "google") {
                const googleProfile = profile as { email?: string; email_verified?: boolean } | undefined;

                if (!googleProfile?.email || googleProfile.email_verified !== true) {
                    return false;
                }
            }

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }

            return token;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) {
                return `${baseUrl}${url}`;
            }

            try {
                const parsed = new URL(url);
                return parsed.origin === baseUrl ? url : `${baseUrl}/chat/1`;
            } catch {
                return `${baseUrl}/chat/1`;
            }
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }

            return session;
        },
    },
};
