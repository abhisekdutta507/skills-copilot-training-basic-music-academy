import { NextResponse } from 'next/server';
import { db } from '@/lib/db.js';
import { paymentOutcomeSchema } from '@/schemas/payment.js';

function createPaymentReference(enrollmentId) {
    return `demo_${enrollmentId.slice(-6)}_${Date.now().toString().slice(-6)}`;
}

export async function POST(request, { params }) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = paymentOutcomeSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
    }

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

    if (parsed.data.outcome === 'success') {
        if (enrollment.paymentStatus === 'PAID' && enrollment.status === 'ACTIVE') {
            return NextResponse.json({ error: 'Enrollment is already paid' }, { status: 409 });
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

    if (enrollment.paymentStatus === 'PAID' || enrollment.status === 'ACTIVE') {
        return NextResponse.json({ error: 'Paid enrollments cannot be marked as failed' }, { status: 409 });
    }

    const updated = await db.enrollment.update({
        where: { id },
        data: {
            status: 'PENDING',
            paymentStatus: 'FAILED',
            paymentFailureReason: parsed.data.reason?.trim() || 'Payment simulation failed',
            paymentReference: null,
            paidAt: null,
        },
        include: { course: { select: { id: true, name: true, monthlyFee: true } } },
    });

    return NextResponse.json(updated);
}