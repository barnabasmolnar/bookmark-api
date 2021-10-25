import Router from "@koa/router";

import prisma from "./prisma";

const router = new Router();

router.get("/", async (ctx) => {
  const id = ctx.state.user.id;
  ctx.body = await prisma.user.findUnique({ where: { id } });
});

export default router;
