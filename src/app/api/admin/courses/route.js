import { NextResponse } from 'next/server';
import { auth } from '@/auth.js';
import { db } from '@/lib/db.js';
import { isAdminSession } from '@/lib/adminAuth.js';
import { courseSchema } from '@/schemas/course.js';

export async function GET() {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const courses = await db.course.findMany({
        orderBy: { createdAt: 'asc' },
        include: {
            _count: { select: { enrollments: true, demoRequests: true } },
        },
    });
    return NextResponse.json(courses);
}

export async function POST(request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = courseSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
    }

    const existing = await db.course.findUnique({ where: { id: parsed.data.id } });
    if (existing) {
        return NextResponse.json({ error: 'A course with this ID already exists' }, { status: 409 });
    }

    const course = await db.course.create({ data: parsed.data });
    return NextResponse.json(course, { status: 201 });
}
