// src/lib/schemas/contact.ts
import { z } from 'zod';

export const contact_schema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long').trim(),
	email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
	phone: z
		.string()
		.min(10, 'Phone number must be at least 10 digits')
		.max(15, 'Phone number is too long')
		.regex(
			/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
			'Please enter a valid phone number'
		)
		.trim(),
	note: z
		.string()
		.min(3, 'Message must be at least 3 characters')
		.max(1500, 'Message is too long')
		.trim(),
	referrer: z.string().optional().default('direct'),
	origin: z.string().optional()
});
