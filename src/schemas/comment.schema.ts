import { z } from 'zod';
import { IdSchema, NonEmptyStringSchema } from './common.schema';

export const CommentSchema = z.object({
  postId: IdSchema,
  id: IdSchema,
  name: NonEmptyStringSchema,
  email: z.email(),
  body: NonEmptyStringSchema,
});

export const CommentListSchema = z.array(CommentSchema);

export type Comment = z.infer<typeof CommentSchema>;
