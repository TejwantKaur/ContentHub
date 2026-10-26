import { Hono } from "hono";
import postgres from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";
import type { Contract } from "./prisma/contract.d";
import contractJson from "./prisma/contract.json" with { type: "json" };

import { Bindings, Variables } from "./prisma/types";
import { userRouter } from "./routes/userRouter";
import { blogRouter } from "./routes/blogRouter";

const app = new Hono<{ 
	Bindings: Bindings,
	Variables: Variables 	// c.set("db", db)
}>();

const contract = contractFromJson<Contract>(contractJson);

// one db client per request, closed after the response
app.use("*", async (c, next) => {
  const db = postgres({ // eh db da type uper Variables ch dita h;
	contract, 
	url: c.env.DATABASE_URL 
});
  c.set("db", db);
  try { await next() } 
  finally {
    c.executionCtx.waitUntil(db.close());
  }
});

app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter)

export default app;