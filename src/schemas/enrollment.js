import { z } from 'zod';

export const enrollmentSchema = z.object({
    studentName: z.string().min(2).max(100),
    guardianName: z.string().min(2).max(100),
    email: z.string().email('Enter a valid email address'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
    classId: z.string().min(1, 'Please select a program'),
    startDate: z.string().optional(),
});
