import { NextResponse } from 'next/server';
import { db } from '@/lib/db.js';

function createPaymentReference(enrollmentId) {
    return `demo_${enrollmentId.slice(-6)}_${Date.now().toString().slice(-6)}`;
}

export async function POST(_request, { params }) {
    const { id } = await params;
    const enrollment = await db.enrollment.findUnique({
        where: { id },
        include: { course: { select: { id: true, name: true, monthlyFee: true } } },
    });

    if (!enrollment) {
        return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    if (enrollment.status === 'REFUNDED' || enrollment.paymentStatus === 'REFUNDED') {
        return NextResponse.json({ error: 'Payment updates are not allowed after a refund' }, { status: 409 });
    }

    if (enrollment.paymentStatus === 'PAID' && enrollment.status === 'ACTIVE') {
        return NextResponse.json(enrollment);
    }

    const updated = await db.enrollment.update({
        where: { id },
        data: {
            status: 'ACTIVE',
            paymentStatus: 'PAID',
            paymentReference: enrollment.paymentReference ?? createPaymentReference(id),
            paymentAmount: enrollment.course.monthlyFee,
            paymentFailureReason: null,
            paidAt: new Date(),
        },
        include: { course: { select: { id: true, name: true, monthlyFee: true } } },
    });

    return NextResponse.json(updated);
}