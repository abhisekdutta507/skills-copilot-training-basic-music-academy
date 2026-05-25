export const ADMIN_ROLE = 'ADMIN';

export function isAdminSession(session) {
    return session?.user?.role === ADMIN_ROLE;
}
