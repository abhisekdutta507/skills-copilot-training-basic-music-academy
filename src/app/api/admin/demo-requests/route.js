import { NextResponse } from 'next/server';
import { auth } from '@/auth.js';
import { db } from '@/lib/db.js';
import { isAdminSession } from '@/lib/adminAuth.js';

export async function GET(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status && status !== 'all' ? { status } : {};
    const demoRequests = await db.demoRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { course: { select: { id: true, name: true } } },
    });
    return NextResponse.json(demoRequests);
}
