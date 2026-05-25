import { NextResponse } from 'next/server';
import { auth } from '@/auth.js';
import { db } from '@/lib/db.js';
import { isAdminSession } from '@/lib/adminAuth.js';

export async function POST(_req, { params }) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const enrollment = await db.enrollment.findUnique({ where: { id } });

    if (!enrollment) return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    if (enrollment.status !== 'ACTIVE') {
        return NextResponse.json(
            { error: `Cannot refund an enrollment with status: ${enrollment.status}` },
            { status: 409 }
        );
    }
    if (enrollment.paymentStatus !== 'PAID') {
        return NextResponse.json(
            { error: `Only paid enrollments can be refunded. Current payment status: ${enrollment.paymentStatus}` },
            { status: 409 }
        );
    }

    const updated = await db.enrollment.update({
        where: { id },
        data: {
            status: 'REFUNDED',
            paymentStatus: 'REFUNDED',
            refundedAt: new Date(),
            paymentFailureReason: null,
        },
        include: { course: { select: { id: true, name: true, monthlyFee: true } } },
    });
    return NextResponse.json(updated);
}
