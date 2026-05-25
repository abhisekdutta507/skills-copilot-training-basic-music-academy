import { NextResponse } from 'next/server';
import { db } from '@/lib/db.js';
import { demoRequestSchema } from '@/schemas/demoRequest.js';

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = demoRequestSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
    }

    const { classId, ...rest } = parsed.data;

    const course = await db.course.findUnique({ where: { id: classId } });
    if (!course) {
        return NextResponse.json({ error: 'Selected class not found' }, { status: 404 });
    }

    if (!course.demoAvailable) {
        return NextResponse.json(
            { error: 'Demo is not available for this class. Please join the waitlist.' },
            { status: 409 }
        );
    }

    const demoRequest = await db.demoRequest.create({
        data: { ...rest, courseId: classId },
        include: { course: { select: { name: true } } },
    });

    return NextResponse.json(demoRequest, { status: 201 });
}
