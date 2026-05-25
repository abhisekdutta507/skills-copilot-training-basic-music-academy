import { NextResponse } from 'next/server';
import { db } from '@/lib/db.js';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const search = searchParams.get('search');
    const demoAvailable = searchParams.get('demoAvailable');

    const where = {};

    if (category && category !== 'all') {
        where.category = category;
    }

    if (level && level !== 'all') {
        where.level = level;
    }

    if (demoAvailable === 'true' || demoAvailable === 'false') {
        where.demoAvailable = demoAvailable === 'true';
    }

    let result = await db.course.findMany({ where, orderBy: { name: 'asc' } });

    if (search && search.trim()) {
        const term = search.trim().toLowerCase();
        result = result.filter(c => {
            const haystack = `${c.name} ${c.category} ${c.blurb} ${c.instructor}`.toLowerCase();
            return haystack.includes(term);
        });
    }

    return NextResponse.json(result);
}
