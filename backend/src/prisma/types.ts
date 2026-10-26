
import postgres from "@prisma/orm-postgres/runtime";
import { Hono } from "hono";
import { Contract } from "./contract";

// add in .env then => ran bunx wrangler types; to access;
export type Bindings = {
  DATABASE_URL: string,
  JWT_SECRET: string,
};

export type Variables = {
    db: ReturnType<typeof postgres<Contract>>,
    authorId: string
}

// bunx wrangler types
