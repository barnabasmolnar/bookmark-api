import Router from "@koa/router";

import prisma from "./prisma";

const router = new Router();

router.get("/", async (ctx) => {
  ctx.body = await prisma.tag.findMany();
});

export default router;
