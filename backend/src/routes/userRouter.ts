import { Hono } from "hono";
import { Bindings, Variables } from "../prisma/types";
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
    Bindings: Bindings,     // c.env.JWT_SECRET
    Variables: Variables    // c.get("db")
}>();

userRouter.post("/signup", async(c) => {
//   const body = signupSchema.safeParse(await c.req.json());
	const body = await c.req.json();
	console.log(body);

	// if(!body.success) return c.json({ msge: "Incorrect Credentials!" }, 400);

	try{
		const user = await c.get("db").orm.public.User
		.create({ 
			// ...body.data, // iterate body.data => body.data.email, body.data.name, body.data.password
			name: body.name,
			username: body.username,
			password: body.password
		})

		const token = await sign({id: user.id}, c.env.JWT_SECRET, 'HS256');
		return c.json({ token });
	} 
	catch (e) {
		return c.json({ msge: "email already registered | Try login" }, 403);
	}
})

userRouter.post("/signin", async(c) => {
	const body = await c.req.json();
	// if(!body.success) return c.json({ msge: "Incorrect Credentials!" }, 400);

	const user = await c.get("db").orm.public.User
	.where({ username: body.username })
	.first();

	if (!user || user.password !== body.password) {
		return c.json({ msge: "User not found | Incorrect Credentials" }, 401);
	}
	const token = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ token });
});