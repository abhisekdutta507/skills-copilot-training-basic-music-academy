import { z } from 'zod';

export const paymentOutcomeSchema = z.object({
    outcome: z.enum(['success', 'failure']),
    reason: z.string().trim().max(160).optional(),
});