import { z } from 'zod';

export const demoRequestSchema = z.object({
    studentName: z.string().min(2).max(100),
    age: z.number({ coerce: true }).int().min(5).max(70),
    email: z.string().email('Enter a valid email address'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
    classId: z.string().min(1, 'Please select a class'),
    preferredDate: z.string().optional(),
});
