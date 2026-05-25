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
            const pathname = request.nextUrl.pathname;
            const isAdminArea = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
            if (!isAdminArea) return true;

            // Edge middleware should only gate by sign-in state.
            // Role authorization is enforced in admin layout and admin API handlers.
            return !!auth;
        },
    },
};
