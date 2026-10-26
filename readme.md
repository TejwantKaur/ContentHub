https://www.prisma.io/docs/guides/deployment/cloudflare-workers

### CloudFLare
- bunx create-cloudflare backend --type hello-world --lang=ts --git --no-deploy --no-agents

- wrangler.jsonc => "compatibility_flags": ["nodejs_compat"], 


### Hono Primsa => cd backend
<!-- bun create prisma@latest my-hono-api --template hono --provider postgres --no-deploy;    
it creates another folder --> 
bun add hono

### Prisma
goto workers again => add prisma
bunx prisma@latest orm init --yes --target postgres --authoring psl

### .env
prisma.config.ts => direct;
db.ts => pooled;
wrangler put => pooled

### Create Handlers

### Create models;
- bunx prisma db init

### types.ts
add urls in .env b4 running this
bunx wrangler types => will add .env details in [worker-configuration.d.ts]

### index.ts
add c.set("db", db);

### Hono JWT;
http://hono.dev/docs/helpers/jwt

add .env => JWT_SECRET="some-long-random-string"
run bunx wrangler types;
then access in bindings


### run check; signup, signin
bun run dev;
donot use body.success; && body.data.email; it only works; if we use zod; remove it;
=> use body.email;

### add middleware to reach /api/v1/blog
this will always run b4 we can reach out any blog url;

## Routes 
create type.ts