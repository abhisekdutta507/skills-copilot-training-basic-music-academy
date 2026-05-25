/**
 * Prisma seed script
 * Populates the DB with the 7 seeded courses from src/data/classes.js
 * and creates the default admin user.
 *
 * Run: node prisma/seed.js
 *
 * Default admin credentials (change in production):
 *   Email:    admin@musicacademy.com
 *   Password: Admin@1234
 */

import path from 'node:path';
import pkg from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';

const { PrismaClient } = pkg;

const dbPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const db = new PrismaClient({ adapter });

const seedCourses = [
    {
        id: 'guitar-foundations',
        name: 'Contemporary Guitar',
        category: 'Strings',
        level: 'Beginner',
        monthlyFee: 2400,
        duration: '60 min',
        schedule: 'Tue / Thu 5:00 PM',
        batch: 'Weekday',
        demoAvailable: true,
        ageGroup: '10+ years',
        icon: '🎸',
        blurb: 'Rhythm patterns, fretboard basics, and performance-ready strumming drills.',
        instructor: 'Arjun Menon',
    },
    {
        id: 'piano-essentials',
        name: 'Piano Essentials',
        category: 'Keys',
        level: 'Beginner',
        monthlyFee: 2800,
        duration: '60 min',
        schedule: 'Mon / Wed 4:30 PM',
        batch: 'Weekday',
        demoAvailable: true,
        ageGroup: '7+ years',
        icon: '🎹',
        blurb: 'Keyboard orientation, notation reading, and simple repertoire building.',
        instructor: 'Nisha Sethi',
    },
    {
        id: 'violin-performance',
        name: 'Violin Performance Lab',
        category: 'Strings',
        level: 'Intermediate',
        monthlyFee: 3200,
        duration: '75 min',
        schedule: 'Sat 10:00 AM',
        batch: 'Weekend',
        demoAvailable: true,
        ageGroup: '9+ years',
        icon: '🎻',
        blurb: 'Bow control, tone production, and ensemble practice for progressing learners.',
        instructor: 'Ritika Varma',
    },
    {
        id: 'drums-rhythm-lab',
        name: 'Drums Rhythm Lab',
        category: 'Percussion',
        level: 'Beginner',
        monthlyFee: 2600,
        duration: '60 min',
        schedule: 'Fri 6:00 PM',
        batch: 'Weekday',
        demoAvailable: true,
        ageGroup: '11+ years',
        icon: '🥁',
        blurb: 'Stick control, groove fundamentals, timing work, and coordinated fills.',
        instructor: 'Karan Bedi',
    },
    {
        id: 'flute-expression',
        name: 'Flute Expression',
        category: 'Wind',
        level: 'Intermediate',
        monthlyFee: 2200,
        duration: '50 min',
        schedule: 'Sun 9:00 AM',
        batch: 'Weekend',
        demoAvailable: true,
        ageGroup: '8+ years',
        icon: '🎶',
        blurb: 'Breath control, tone shaping, and melody phrasing through guided pieces.',
        instructor: 'Meera Kaul',
    },
    {
        id: 'keyboard-production',
        name: 'Keyboard and Harmony',
        category: 'Keys',
        level: 'Advanced',
        monthlyFee: 3600,
        duration: '90 min',
        schedule: 'Sat / Sun 2:00 PM',
        batch: 'Weekend',
        demoAvailable: false,
        ageGroup: '14+ years',
        icon: '🎼',
        blurb: 'Advanced harmony, chord voicings, and arrangement skills for serious keyboardists.',
        instructor: 'Deepak Raina',
    },
    {
        id: 'vocals-stage-ready',
        name: 'Vocals Stage Ready',
        category: 'Vocals',
        level: 'Intermediate',
        monthlyFee: 2900,
        duration: '60 min',
        schedule: 'Wed / Fri 6:30 PM',
        batch: 'Weekday',
        demoAvailable: true,
        ageGroup: '13+ years',
        icon: '🎤',
        blurb: 'Stage technique, breath support, pitch training, and performance confidence.',
        instructor: 'Priya Anand',
    },
];

async function main() {
    console.log('Seeding courses…');
    for (const course of seedCourses) {
        await db.course.upsert({
            where: { id: course.id },
            update: course,
            create: course,
        });
    }
    console.log(`✓ ${seedCourses.length} courses seeded.`);

    console.log('Seeding admin user…');
    const passwordHash = await bcrypt.hash('Admin@1234', 12);
    await db.user.upsert({
        where: { email: 'admin@musicacademy.com' },
        update: {},
        create: {
            email: 'admin@musicacademy.com',
            passwordHash,
            role: 'ADMIN',
        },
    });
    console.log('✓ Admin user seeded.');
    console.log('  Email:    admin@musicacademy.com');
    console.log('  Password: Admin@1234');
    console.log('\nChange these credentials before deploying to production!');
}

main()
    .catch(err => {
        console.error(err);
        process.exit(1);
    })
    .finally(() => db.$disconnect());
