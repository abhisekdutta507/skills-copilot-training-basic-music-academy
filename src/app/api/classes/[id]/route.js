import { NextResponse } from 'next/server';
import { getClassById } from '../../../../data/classes.js';

export async function GET(_request, { params }) {
    const { id } = await params;
    const classData = getClassById(id);
    if (!classData) {
        return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }
    return NextResponse.json(classData);
}
