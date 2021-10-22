const Router = require("@koa/router");
const prisma = require("./prisma");

const router = new Router();

router.get("/", async (ctx) => {
  const id = ctx.state.user.id;
  ctx.body = await prisma.user.findUnique({ where: { id } });
});

module.exports = router;
