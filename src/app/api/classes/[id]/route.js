import { NextResponse } from 'next/server';
import { db } from '@/lib/db.js';

export async function GET(_request, { params }) {
    const { id } = await params;
    const course = await db.course.findUnique({ where: { id } });
    if (!course) {
        return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }
    return NextResponse.json(course);
}
