import { NextResponse } from 'next/server';
import { classes } from '../../../data/classes.js';

export function GET(request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const search = searchParams.get('search');

    let result = classes;

    if (category && category !== 'all') {
        result = result.filter(c => c.category === category);
    }

    if (level && level !== 'all') {
        result = result.filter(c => c.level === level);
    }

    if (search && search.trim()) {
        const term = search.trim().toLowerCase();
        result = result.filter(c => {
            const haystack = `${c.name} ${c.category} ${c.blurb} ${c.instructor}`.toLowerCase();
            return haystack.includes(term);
        });
    }

    return NextResponse.json(result);
}
