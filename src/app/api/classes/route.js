import { NextResponse } from 'next/server';
import { classes } from '../../../data/classes.js';

export function GET() {
    return NextResponse.json(classes);
}
