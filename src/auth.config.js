/**
 * Lightweight auth config used by Next.js middleware (Edge runtime).
 * Must NOT import Node.js-only modules (e.g. bcryptjs, Prisma).
 */
export const authConfig = {
    pages: {
        signIn: '/login',
    },
    providers: [],
    callbacks: {
        authorized({ auth, request }) {
            const isAdmin = request.nextUrl.pathname.startsWith('/admin');
            return isAdmin ? !!auth : true;
        },
    },
};
