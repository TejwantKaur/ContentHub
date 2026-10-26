import { Hono } from "hono";
import { Bindings, Variables } from "../prisma/types";
import { verify } from "hono/jwt";


export const blogRouter = new Hono<{
    Bindings: Bindings,     // c.env.JWT_SECRET
    Variables: Variables
}>();

// middleware (verify user)
blogRouter.use("/*", async(c, next) => {
	const authHeader = c.req.header("Authorization") || "";
	const token = authHeader.split(" ")[1];
	if (!token) return c.json({ error: "unauthorized - no token" }, 403);

	try{
		const response = await verify(token, c.env.JWT_SECRET, "HS256")
		console.log(response);

		if(response.id){
            c.set("authorId", response.id as string) // add type of authorId in bindings 
            // wither add this or add return => if (res.id != string)
            await next();
        } 
			
	}
	catch (err) { 
    	return c.json({ error: "unauthorized" }, 403);
  }
})

// fetch all
blogRouter.get("/", async(c) => {
    try{
        const AllBlogs = await c.get("db").orm.public.Blog
        .all()

        return c.json({ AllBlogs })
    }
    catch (err) { 
        return c.json({ error: "unauthorized" }, 403);
    }
});


// blog by id
blogRouter.get("/:id", async(c) => {
    try{
        const userBlog = await c.get("db").orm.public.Blog
        .where({id: c.req.param("id")})
        .first()

        return c.json({ userBlog })
    }
    catch (err) { 
        return c.json({ error: "unauthorized" }, 403);
    }
});


// create
blogRouter.post("/", async(c) => {
    const body = await c.req.json();
    console.log(body);

    try{
        const blog = await c.get("db").orm.public.Blog
        .create({
            ...body, // title, content
            authorId: c.get("authorId")
        })

        return c.json({
            msge: "Blog Created!",
            blog
        })
    }
    catch (err) { 
        return c.json({ error: "unauthorized" }, 403);
    }
});

// update
blogRouter.put("/:id", async(c) => {
    const body = await c.req.json();

    try{
        const userBlog = await c.get("db").orm.public.Blog
        .where({ id: c.req.param("id")}) // blog milgya
        .update({
            title: body.title,
            content: body.content
        })

        return c.json({
            msge: "Updated!",
            userBlog
        })
    }
    catch (err) { 
        return c.json({ error: "unauthorized" }, 403);
    }
});


// delete
blogRouter.delete("/:id", async(c) => {
    try{
        const userBlog = await c.get("db").orm.public.Blog
        .where({id: c.req.param("id")})
        .delete()
        
        if (!userBlog) return c.json({ msge: "BLog not exist" })

        return c.json({
            msge: "Blog Deleted!",
            id: userBlog.id as string
        })

    }
    catch (err) { 
        return c.json({ error: "unauthorized" }, 403);
    }
});

