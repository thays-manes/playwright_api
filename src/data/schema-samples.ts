import type { Comment } from '../schemas/comment.schema';
import type { Post } from '../schemas/post.schema';
import type { User } from '../schemas/user.schema';

/**
 * Amostras locais para os testes unitários dos schemas.
 * NÃO são respostas da API: servem para provar que os schemas aceitam o formato correto
 * e rejeitam payloads malformados de forma controlada.
 */
export const validPost: Post = {
  userId: 1,
  id: 1,
  title: 'Título de exemplo',
  body: 'Corpo de exemplo',
};

export const validUser: User = {
  id: 1,
  name: 'Pessoa de Exemplo',
  username: 'exemplo',
  email: 'pessoa@exemplo.com',
  address: {
    street: 'Rua Exemplo',
    suite: 'Apto 1',
    city: 'São Paulo',
    zipcode: '01000-000',
    geo: { lat: '-23.5505', lng: '-46.6333' },
  },
  phone: '11 99999-0000',
  website: 'exemplo.com',
  company: { name: 'Empresa Exemplo', catchPhrase: 'Frase', bs: 'negócios' },
};

export const validComment: Comment = {
  postId: 1,
  id: 1,
  name: 'Comentário de exemplo',
  email: 'autor@exemplo.com',
  body: 'Texto do comentário',
};
