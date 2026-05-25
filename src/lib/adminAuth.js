import { NextResponse } from 'next/server';

export const ADMIN_ROLE = 'ADMIN';

export function isAdminSession(session) {
    return session?.user?.role === ADMIN_ROLE;
}

export function forbiddenResponse() {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
