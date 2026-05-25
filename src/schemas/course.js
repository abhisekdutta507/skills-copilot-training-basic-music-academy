import { z } from 'zod';

const CATEGORIES = ['Strings', 'Keys', 'Percussion', 'Wind', 'Vocals'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const BATCHES = ['Weekday', 'Weekend'];

export const courseSchema = z.object({
    id: z
        .string()
        .regex(/^[a-z0-9-]+$/, 'ID must be lowercase letters, numbers, and hyphens')
        .min(2)
        .max(80),
    name: z.string().min(2).max(100),
    category: z.enum(CATEGORIES, { message: `Category must be one of: ${CATEGORIES.join(', ')}` }),
    level: z.enum(LEVELS, { message: `Level must be one of: ${LEVELS.join(', ')}` }),
    monthlyFee: z.number({ coerce: true }).int().positive('Monthly fee must be a positive integer'),
    duration: z.string().min(1).max(20),
    schedule: z.string().min(1).max(100),
    batch: z.enum(BATCHES, { message: `Batch must be one of: ${BATCHES.join(', ')}` }),
    demoAvailable: z.boolean({ coerce: true }).default(true),
    ageGroup: z.string().min(1).max(30),
    icon: z.string().min(1).max(10),
    blurb: z.string().min(10).max(300),
    instructor: z.string().min(2).max(100),
});

export const courseUpdateSchema = courseSchema.partial().omit({ id: true });
