import { NextResponse } from 'next/server';
import { auth } from '@/auth.js';
import { db } from '@/lib/db.js';
import { forbiddenResponse, isAdminSession } from '@/lib/adminAuth.js';

export async function POST(_req, { params }) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!isAdminSession(session)) return forbiddenResponse();

    const { id } = await params;
    const enrollment = await db.enrollment.findUnique({ where: { id } });

    if (!enrollment) return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    if (enrollment.status !== 'ACTIVE') {
        return NextResponse.json(
            { error: `Cannot refund an enrollment with status: ${enrollment.status}` },
            { status: 409 }
        );
    }

    const updated = await db.enrollment.update({
        where: { id },
        data: { status: 'REFUNDED', refundedAt: new Date() },
        include: { course: { select: { name: true } } },
    });
    return NextResponse.json(updated);
}
