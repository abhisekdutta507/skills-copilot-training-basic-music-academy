import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth.js';
import { db } from '@/lib/db.js';
import { isAdminSession } from '@/lib/adminAuth.js';

const statusSchema = z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
});

export async function PATCH(request, { params }) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
    }

    const existing = await db.demoRequest.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Demo request not found' }, { status: 404 });

    const updated = await db.demoRequest.update({
        where: { id },
        data: { status: parsed.data.status },
        include: { course: { select: { name: true } } },
    });
    return NextResponse.json(updated);
}
