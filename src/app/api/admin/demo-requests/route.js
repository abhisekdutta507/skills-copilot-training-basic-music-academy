import { NextResponse } from 'next/server';
import { auth } from '@/auth.js';
import { db } from '@/lib/db.js';

export async function GET(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
