import { NextResponse } from 'next/server';
import { auth } from '@/auth.js';
import { db } from '@/lib/db.js';
import { isAdminSession } from '@/lib/adminAuth.js';
import { courseUpdateSchema } from '@/schemas/course.js';

export async function GET(_req, { params }) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const course = await db.course.findUnique({
        where: { id },
        include: {
            _count: { select: { enrollments: true, demoRequests: true } },
        },
    });
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    return NextResponse.json(course);
}

export async function PUT(request, { params }) {
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

    const parsed = courseUpdateSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
    }

    const existing = await db.course.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    const course = await db.course.update({ where: { id }, data: parsed.data });
    return NextResponse.json(course);
}

export async function DELETE(_req, { params }) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!isAdminSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const existing = await db.course.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    await db.course.delete({ where: { id } });
    return new Response(null, { status: 204 });
}
