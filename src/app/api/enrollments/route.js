import { NextResponse } from 'next/server';
import { db } from '@/lib/db.js';
import { enrollmentSchema } from '@/schemas/enrollment.js';

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = enrollmentSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
    }

    const { classId, ...rest } = parsed.data;

    const course = await db.course.findUnique({ where: { id: classId } });
    if (!course) {
        return NextResponse.json({ error: 'Selected program not found' }, { status: 404 });
    }

    const enrollment = await db.enrollment.create({
        data: { ...rest, courseId: classId },
        include: { course: { select: { name: true } } },
    });

    return NextResponse.json(enrollment, { status: 201 });
}
