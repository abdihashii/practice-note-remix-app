import { Application, Router } from "@oak/oak";

const router = new Router();

router.get("/test", (ctx) => {
  ctx.response.body = "Hello World";
});

// router.get("/notes", async (ctx) => {
//   ctx.response.body = await getAllNotes();
// });

// router.post("/todos", async (ctx) => {
//   const { title } = await ctx.request.body().value;
//   ctx.response.body = await addTodo(title);
// });

// router.put("/todos/:id", async (ctx) => {
//   const id = parseInt(ctx.params.id);
//   const { completed } = await ctx.request.body().value;
//   ctx.response.body = await updateTodo(id, completed);
// });

// router.delete("/todos/:id", async (ctx) => {
//   const id = parseInt(ctx.params.id);
//   await deleteTodo(id);
//   ctx.response.body = { message: "Todo deleted successfully" };
// });

const app = new Application();

// Create the table if it doesn't exist
// await createTable();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8000 });

console.log("Server is running on http://localhost:8000");
