const Router = require("@koa/router");
const prisma = require("./prisma");

const router = new Router();

router.get("/", async (ctx) => {
  ctx.body = await prisma.tag.findMany();
});

module.exports = router;
