// Zod é a biblioteca que usamos para descrever o "formato" (schema/contrato) que o JSON deve ter.
// Lendo um schema você sabe quais campos a API precisa devolver e de qual tipo cada um é.
import { z } from 'zod';

// ===================== POST =====================
// Um post precisa ter: userId (número), id (número), title (texto) e body (texto).
export const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

// Lista de posts: um array onde CADA item segue o postSchema.
export const listaDePostsSchema = z.array(postSchema);

// ===================== USER =====================
// O usuário tem objetos dentro de objetos (address -> geo, e company).
// Por isso descrevemos cada "pedaço" dentro do schema principal.
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.email(), // além de ser texto, precisa ter formato de e-mail
  address: z.object({
    street: z.string(),
    suite: z.string(),
    city: z.string(),
    zipcode: z.string(),
    geo: z.object({
      lat: z.string(),
      lng: z.string(),
    }),
  }),
  phone: z.string(),
  website: z.string(),
  company: z.object({
    name: z.string(),
    catchPhrase: z.string(),
    bs: z.string(),
  }),
});

// Lista de usuários: array de userSchema.
export const listaDeUsersSchema = z.array(userSchema);

// ===================== COMMENT =====================
// Um comentário tem: postId, id, name, email e body.
export const commentSchema = z.object({
  postId: z.number(),
  id: z.number(),
  name: z.string(),
  email: z.email(),
  body: z.string(),
});

// Lista de comentários: array de commentSchema.
export const listaDeCommentsSchema = z.array(commentSchema);
