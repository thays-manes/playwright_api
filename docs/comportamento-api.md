# Comportamento esperado do JSONPlaceholder

> **Status: não observado neste ambiente.** O projeto foi criado num ambiente sem acesso de rede ao
> `jsonplaceholder.typicode.com` nem ao registro do npm. As expectativas abaixo seguem o
> comportamento documentado e amplamente conhecido do JSONPlaceholder. Antes de considerar a suíte
> validada, confirme-as na sua máquina com:
>
> ```powershell
> npm run explore:api
> ```
>
> Se algum valor divergir, ajuste o teste correspondente e esta tabela.

| Chamada | Status esperado | Corpo esperado | Teste |
|---|---|---|---|
| `GET /posts` | 200 | Array com 100 posts | `tests/posts/posts.spec.ts` |
| `GET /posts/1` | 200 | Post com `id: 1` | `tests/posts/posts.spec.ts` |
| `GET /posts/999999` | 404 | `{}` | `tests/posts/posts.spec.ts` |
| `POST /posts` | 201 | Dados enviados + `id` simulado (normalmente `101`) | `tests/posts/posts.spec.ts` |
| `PUT /posts/1` | 200 | Exatamente os campos enviados (com `id: 1`) | `tests/posts/posts.spec.ts` |
| `PATCH /posts/1` | 200 | Post 1 completo com o campo enviado alterado | `tests/posts/posts.spec.ts` |
| `DELETE /posts/1` | 200 | `{}` | `tests/posts/posts.spec.ts` |
| `GET /users` | 200 | Array com 10 usuários | `tests/users/users.spec.ts` |
| `GET /users/1` | 200 | Usuário com `id: 1` | `tests/users/users.spec.ts` |
| `GET /users/999999` | 404 | `{}` | `tests/users/users.spec.ts` |
| `GET /comments?postId=1` | 200 | Array de comentários, todos com `postId: 1` | `tests/comments/comments.spec.ts` |
| `GET /comments?postId=999999` | 200 | `[]` | `tests/comments/comments.spec.ts` |

## Observações

- Operações de escrita (`POST`, `PUT`, `PATCH`, `DELETE`) são **simuladas**: a API responde como se
  tivesse alterado os dados, mas nada é persistido. Um `GET /posts/1` depois de um `PUT` continua
  devolvendo o post original.
- O `id` devolvido no `POST` é sempre o mesmo valor simulado; por isso o teste valida apenas que é um
  inteiro positivo, sem fixar o número.
- Os testes não dependem da ordem dos registros nem do total exato de itens.
