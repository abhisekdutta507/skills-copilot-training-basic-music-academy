import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db.js';
import { loginSchema } from '@/schemas/auth.js';
import { authConfig } from '@/auth.config.js';

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    secret: process.env.AUTH_SECRET,
    session: { strategy: 'jwt' },
    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const parsed = loginSchema.safeParse(credentials);
                if (!parsed.success) return null;

                const user = await db.user.findUnique({
                    where: { email: parsed.data.email },
                });
                if (!user) return null;

                const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
                if (!valid) return null;

                return { id: user.id, email: user.email, role: user.role };
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) token.role = user.role;
            return token;
        },
        session({ session, token }) {
            if (token?.role) session.user.role = token.role;
            return session;
        },
    },
});
