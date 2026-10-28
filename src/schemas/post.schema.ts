import { z } from 'zod';
import { IdSchema, NonEmptyStringSchema } from './common.schema';

export const PostSchema = z.object({
  userId: IdSchema,
  id: IdSchema,
  title: NonEmptyStringSchema,
  body: NonEmptyStringSchema,
});

export const PostListSchema = z.array(PostSchema);

/** Payload de criação (POST): sem `id`, que é gerado (simulado) pela API. */
export const PostInputSchema = PostSchema.omit({ id: true });

/** Payload de substituição completa (PUT). */
export const PostUpdateSchema = PostSchema;

/** Payload de atualização parcial (PATCH): ao menos um campo editável. */
export const PostPatchSchema = PostInputSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'PATCH precisa de ao menos um campo',
});

/** Resposta de criação: os dados enviados + `id` simulado. */
export const CreatedPostSchema = PostSchema;

export type Post = z.infer<typeof PostSchema>;
export type PostInput = z.infer<typeof PostInputSchema>;
export type PostUpdate = z.infer<typeof PostUpdateSchema>;
export type PostPatch = z.infer<typeof PostPatchSchema>;
