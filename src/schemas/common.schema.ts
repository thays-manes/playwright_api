import { z } from 'zod';

export const IdSchema = z.number().int().positive();
export const NonEmptyStringSchema = z.string().trim().min(1);

/** Corpo `{}` devolvido pelo JSONPlaceholder em DELETE e em recursos inexistentes. */
export const EmptyObjectSchema = z.strictObject({});
