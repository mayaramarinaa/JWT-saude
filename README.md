# Portal de Saúde com JWT e PWA (PRECISA MUDAR O NOME DO REPOSITORIO)

Aplicação didática com Node.js, Express, MongoDB, Mongoose, JWT e frontend em HTML/CSS/JavaScript. O cadastro público diferencia pacientes (CPF) e médicos (CRM e especialidade); ambos usam o mesmo fluxo de login. A gestão da lista de contas é exclusiva do perfil `admin`.

## Rodar localmente

Requisitos: Node.js 20.13+ e MongoDB local ou uma instância no MongoDB Atlas.

1. Copie `.env.example` para `.env` e configure `MONGO_URI` e `JWT_SECRET`.
2. Instale as dependências com `npm i`.
3. Inicie com `npm run dev`.
4. Abra `http://localhost:3000`; a documentação da API fica em `http://localhost:3000/api-docs`.
5. Rode os testes com `npm test`.

`JWT_SECRET` deve ser uma chave aleatória longa. O arquivo `.env` não deve ser enviado ao GitHub.

## Autenticação e perfis

- `POST /api/auth/register`: recebe `nome`, `email`, `senha`, `role` e os campos do perfil. `role` aceita somente `medico` ou `paciente`; cadastro público não pode criar administradores.
- Médicos informam `crm` e `especialidade`; pacientes informam `cpf`.
- `POST /api/auth/login`: retorna JWT e os dados do próprio perfil.
- `GET /api/users/me`: retorna os dados da conta autenticada.
- `GET /api/users` e `/api/users/:id`, além das operações de criação, edição e remoção, exigem perfil `admin`.

O frontend redireciona usuários sem sessão para o login. Médicos e pacientes veem seus próprios dados; administradores também têm acesso ao CRUD.

Para habilitar um administrador inicial, cadastre primeiro uma conta e execute `npm run promote-admin -- email@exemplo.com` com o MongoDB configurado. Esse comando altera somente uma conta já existente e não cria uma rota pública de privilégio.

## Deploy

O servidor já serve o frontend e usa a porta fornecida pela plataforma. Para publicar em Render, crie um banco MongoDB Atlas, envie o projeto para um repositório GitHub e crie um Blueprint no Render usando `render.yaml`. Informe `MONGO_URI` com a connection string do Atlas quando solicitado; o Render gera `JWT_SECRET`. Libere no Atlas o acesso de rede do serviço de hospedagem.

Não use dados reais de saúde nesta versão didática: antes de produção, implemente controles adequados à LGPD, recuperação de conta, validação robusta de CPF/CRM, política de sessão e revisão de segurança.
